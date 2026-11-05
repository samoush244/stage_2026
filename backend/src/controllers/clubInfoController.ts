import { Request, Response } from "express";
import { put, del } from "@vercel/blob";
import ClubInfo from "../models/ClubInfo";

const DEFAULT_HERO_TEXT =
  "Un club, une équipe, une famille. Retrouvez les matchs, les équipes, les actualités et toute la vie du club.";

// Formats explicitement acceptés. Le middleware Multer doit appliquer
// des restrictions cohérentes (type et taille du fichier).
const MEDIA_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

function getBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN est manquant.");
  return token;
}

function getBlobUrlIfManaged(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol === "https:" &&
      /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i.test(parsed.hostname) &&
      parsed.pathname.startsWith("/infoclub/")
    ) {
      return url;
    }
  } catch {
    // Une ancienne valeur relative ou une URL invalide ne doit jamais être supprimée.
  }
  return null;
}

async function uploadHeroMedia(file: Express.Multer.File) {
  const extension = MEDIA_EXTENSIONS[file.mimetype];
  if (!extension) {
    throw new Error("Format non autorisé. Images : JPG, PNG, WebP, GIF. Vidéos : MP4, WebM, MOV.");
  }
  if (!file.buffer || file.size === 0) {
    throw new Error("Fichier vide ou non disponible en mémoire.");
  }

  const resourceType: "image" | "video" = file.mimetype.startsWith("video/")
    ? "video"
    : "image";

  const filename = `infoclub/hero-${Date.now()}.${extension}`;
  const blob = await put(filename, file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype,
    token: getBlobToken(),
  });

  return { url: blob.url, resourceType };
}

async function deleteManagedBlob(url: string) {
  const managedUrl = getBlobUrlIfManaged(url);
  if (!managedUrl) return;
  await del(managedUrl, { token: getBlobToken() });
}

async function getOrCreateClubInfo() {
  let clubInfo = await ClubInfo.findOne();

  if (!clubInfo) {
    clubInfo = await ClubInfo.create({
      address: "Gymnase du club",
      email: "contact@club-handball.fr",
      phone: "00 00 00 00 00",
      facebook: "",
      instagram: "",
      tiktok: "",
      heroText: DEFAULT_HERO_TEXT,
      heroMediaType: "none",
      heroMediaUrl: "",
      heroMediaPublicId: "",
    });
  }

  return clubInfo;
}

export const getClubInfo = async (_req: Request, res: Response) => {
  try {
    const clubInfo = await getOrCreateClubInfo();
    return res.status(200).json(clubInfo);
  } catch (error) {
    console.error("Erreur récupération infos club :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateClubInfo = async (req: Request, res: Response) => {
  let newBlobUrl: string | null = null;
  let wasSaved = false;

  try {
    const clubInfo = await getOrCreateClubInfo();
    const {
      address,
      email,
      phone,
      facebook,
      instagram,
      tiktok,
      heroText,
      heroMediaType,
    } = req.body;

    const previousMediaUrl = clubInfo.heroMediaUrl || "";

    // En cas de fichier, le fichier prend la priorité sur un éventuel "none"
    // envoyé simultanément par le formulaire.
    if (req.file) {
      const extension = MEDIA_EXTENSIONS[req.file.mimetype];
      if (!extension) {
        return res.status(400).json({
          message: "Format non autorisé. Images : JPG, PNG, WebP, GIF. Vidéos : MP4, WebM, MOV.",
        });
      }
    }

    clubInfo.address = address ?? clubInfo.address;
    clubInfo.email = email ?? clubInfo.email;
    clubInfo.phone = phone ?? clubInfo.phone;
    clubInfo.facebook = facebook ?? "";
    clubInfo.instagram = instagram ?? "";
    clubInfo.tiktok = tiktok ?? "";
    clubInfo.heroText = heroText || DEFAULT_HERO_TEXT;

    if (req.file) {
      const uploaded = await uploadHeroMedia(req.file);
      newBlobUrl = uploaded.url;
      clubInfo.heroMediaType = uploaded.resourceType;
      clubInfo.heroMediaUrl = uploaded.url;
      // Le champ historique reste pour la compatibilité du modèle :
      // Vercel Blob utilise son URL et non un public_id Cloudinary.
      clubInfo.heroMediaPublicId = "";
    } else if (heroMediaType === "none") {
      clubInfo.heroMediaType = "none";
      clubInfo.heroMediaUrl = "";
      clubInfo.heroMediaPublicId = "";
    }
    // Sans fichier et sans demande de suppression, ne pas changer le type
    // de média, sinon une image pourrait être traitée à tort comme une vidéo.

    const updatedClubInfo = await clubInfo.save();
    wasSaved = true;

    // Nettoyer APRES le succès MongoDB : jamais avant.
    // Les anciens médias Cloudinary restent intacts pendant la migration.
    if (previousMediaUrl && previousMediaUrl !== updatedClubInfo.heroMediaUrl) {
      try {
        await deleteManagedBlob(previousMediaUrl);
      } catch (cleanupError) {
        console.error("Ancien média Blob non supprimé :", cleanupError);
      }
    }

    return res.status(200).json(updatedClubInfo);
  } catch (error) {
    console.error("Erreur mise à jour infos club :", error);

    // Si le fichier a été envoyé mais que MongoDB a échoué, éviter un blob orphelin.
    if (newBlobUrl && !wasSaved) {
      try {
        await deleteManagedBlob(newBlobUrl);
      } catch (cleanupError) {
        console.error("Nettoyage du nouvel upload échoué :", cleanupError);
      }
    }

    return res.status(500).json({ message: "Erreur serveur lors de la mise à jour des infos club." });
  }
};
