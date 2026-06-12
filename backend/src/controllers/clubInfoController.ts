import { Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";
import ClubInfo from "../models/ClubInfo";
import cloudinary from "../config/cloudinary";

const DEFAULT_HERO_TEXT =
  "Un club, une équipe, une famille. Retrouvez les matchs, les équipes, les actualités et toute la vie du club.";

function uploadToCloudinary(
  fileBuffer: Buffer,
  resourceType: "image" | "video"
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "club-info",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
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

export const getClubInfo = async (req: Request, res: Response) => {
  try {
    const clubInfo = await getOrCreateClubInfo();
    res.status(200).json(clubInfo);
  } catch (error) {
    console.error("Erreur récupération infos club :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateClubInfo = async (req: Request, res: Response) => {
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

    clubInfo.address = address ?? clubInfo.address;
    clubInfo.email = email ?? clubInfo.email;
    clubInfo.phone = phone ?? clubInfo.phone;
    clubInfo.facebook = facebook ?? "";
    clubInfo.instagram = instagram ?? "";
    clubInfo.tiktok = tiktok ?? "";
    clubInfo.heroText = heroText || DEFAULT_HERO_TEXT;

    if (heroMediaType === "none") {
      if (clubInfo.heroMediaPublicId) {
        await cloudinary.uploader.destroy(clubInfo.heroMediaPublicId, {
          resource_type: clubInfo.heroMediaType === "video" ? "video" : "image",
        });
      }

      clubInfo.heroMediaType = "none";
      clubInfo.heroMediaUrl = "";
      clubInfo.heroMediaPublicId = "";
    }

    if (req.file) {
      const isImage = req.file.mimetype.startsWith("image/");
      const isVideo = req.file.mimetype.startsWith("video/");

      if (!isImage && !isVideo) {
        return res.status(400).json({
          message: "Le fichier doit être une image ou une vidéo.",
        });
      }

      if (clubInfo.heroMediaPublicId) {
        await cloudinary.uploader.destroy(clubInfo.heroMediaPublicId, {
          resource_type: clubInfo.heroMediaType === "video" ? "video" : "image",
        });
      }

      const resourceType = isVideo ? "video" : "image";
      const uploaded = await uploadToCloudinary(req.file.buffer, resourceType);

      clubInfo.heroMediaType = resourceType;
      clubInfo.heroMediaUrl = uploaded.secure_url;
      clubInfo.heroMediaPublicId = uploaded.public_id;
    } else if (heroMediaType === "image" || heroMediaType === "video") {
      clubInfo.heroMediaType = heroMediaType;
    }

    const updatedClubInfo = await clubInfo.save();

    res.status(200).json(updatedClubInfo);
  } catch (error) {
    console.error("Erreur mise à jour infos club :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};