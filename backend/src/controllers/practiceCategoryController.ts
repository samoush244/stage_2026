import { Request, Response } from "express";
import { del, put } from "@vercel/blob";
import PracticeCategory from "../models/PracticeCategory";

type MulterRequest = Request & { file?: Express.Multer.File };

const cleanStringArray = (value: unknown): string[] => {
  let parsedValue = value;
  if (typeof value === "string") {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      parsedValue = value.split(",");
    }
  }
  if (!Array.isArray(parsedValue)) return [];
  return parsedValue.map((item) => String(item).trim()).filter(Boolean);
};

const cleanRows = (value: unknown) => {
  let parsedValue = value;
  if (typeof value === "string") {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsedValue)) return [];
  return parsedValue
    .map((row) => {
      const rawRow = row as { day?: unknown; cells?: unknown };
      const cells = Array.isArray(rawRow.cells)
        ? rawRow.cells.map((cell) => {
            const rawCell = cell as { time?: unknown; location?: unknown };
            return {
              time: rawCell.time ? String(rawCell.time).trim() : "",
              location: rawCell.location ? String(rawCell.location).trim() : "",
            };
          })
        : [];
      return {
        day: rawRow.day ? String(rawRow.day).trim() : "",
        cells,
      };
    })
    .filter((row) => row.day);
};

const acceptedImages: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const uploadLogoToVercelBlob = async (
  file?: Express.Multer.File
): Promise<{ logoUrl: string; logoPublicId: string } | null> => {
  if (!file) return null;

  const extension = acceptedImages[file.mimetype];
  if (!extension) {
    throw new Error("Seules les images JPG, PNG ou WebP sont autorisées.");
  }
  if (!file.buffer?.length) {
    throw new Error("Le fichier image est vide ou indisponible.");
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN est manquant.");

  const blob = await put(`informations-pratiques/${Date.now()}.${extension}`, file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype,
    token,
  });

  // On conserve les deux champs du modèle : l'URL publique et le pathname Blob.
  return { logoUrl: blob.url, logoPublicId: blob.pathname };
};

const isVercelBlobUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
};

const deleteVercelLogoIfOwned = async (url?: string | null) => {
  if (!url || !isVercelBlobUrl(url)) return;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.warn("Nettoyage Blob ignoré : jeton manquant.");
    return;
  }
  try {
    await del(url, { token });
  } catch (error) {
    // L'erreur de nettoyage ne doit jamais annuler une modification MongoDB réussie.
    console.error("Erreur de nettoyage du logo Vercel Blob :", error);
  }
};

export const getPublicPracticeCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const categories = await PracticeCategory.find({ isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Erreur récupération catégories pratiques :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des informations pratiques.",
    });
  }
};

export const getAdminPracticeCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const categories = await PracticeCategory.find().sort({
      order: 1,
      createdAt: 1,
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Erreur récupération admin catégories pratiques :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des catégories.",
    });
  }
};

export const createPracticeCategory = async (
  req: MulterRequest,
  res: Response
) => {
  let newLogoUrl: string | undefined;
  try {
    const { title, birthYearsLabel, columns, rows, order, isActive } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Le nom de la catégorie est obligatoire." });
    }

    const cleanColumns = cleanStringArray(columns);
    if (cleanColumns.length === 0) {
      return res.status(400).json({ message: "Au moins une colonne est obligatoire." });
    }

    const uploadedLogo = await uploadLogoToVercelBlob(req.file);
    newLogoUrl = uploadedLogo?.logoUrl;

    const category = await PracticeCategory.create({
      title: String(title).trim(),
      birthYearsLabel: birthYearsLabel ? String(birthYearsLabel).trim() : "",
      logoUrl: uploadedLogo?.logoUrl || "",
      logoPublicId: uploadedLogo?.logoPublicId || "",
      columns: cleanColumns,
      rows: cleanRows(rows),
      order: Number(order) || 0,
      isActive: isActive === "false" ? false : isActive !== false,
    });
    return res.status(201).json(category);
  } catch (error) {
    // Si MongoDB échoue après l'upload, le nouveau Blob ne doit pas rester orphelin.
    await deleteVercelLogoIfOwned(newLogoUrl);
    console.error("Erreur création catégorie pratique :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création de la catégorie.",
    });
  }
};

export const updatePracticeCategory = async (
  req: MulterRequest,
  res: Response
) => {
  let newLogoUrl: string | undefined;
  try {
    const { id } = req.params;
    const {
      title,
      birthYearsLabel,
      columns,
      rows,
      order,
      isActive,
    } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Le nom de la catégorie est obligatoire." });
    }

    const category = await PracticeCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie introuvable." });
    }

    const cleanColumns = cleanStringArray(columns);
    if (cleanColumns.length === 0) {
      return res.status(400).json({ message: "Au moins une colonne est obligatoire." });
    }

    const previousLogoUrl = category.logoUrl;
    const uploadedLogo = await uploadLogoToVercelBlob(req.file);
    newLogoUrl = uploadedLogo?.logoUrl;

    category.title = String(title).trim();
    category.birthYearsLabel = birthYearsLabel
      ? String(birthYearsLabel).trim()
      : "";
    if (uploadedLogo) {
      category.logoUrl = uploadedLogo.logoUrl;
      category.logoPublicId = uploadedLogo.logoPublicId;
    }
    category.columns = cleanColumns;
    category.rows = cleanRows(rows);
    category.order = Number(order) || 0;
    category.isActive = isActive === "false" ? false : isActive !== false;

    await category.save();

    // On supprime seulement les anciens Blobs et seulement après sauvegarde.
    // Les anciennes images Cloudinary restent en place pendant la migration.
    if (uploadedLogo && previousLogoUrl !== uploadedLogo.logoUrl) {
      await deleteVercelLogoIfOwned(previousLogoUrl);
    }
    return res.status(200).json(category);
  } catch (error) {
    await deleteVercelLogoIfOwned(newLogoUrl);
    console.error("Erreur modification catégorie pratique :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la modification de la catégorie.",
    });
  }
};

export const deletePracticeCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await PracticeCategory.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie introuvable." });
    }

    await deleteVercelLogoIfOwned(category.logoUrl);
    return res.status(200).json({ message: "Catégorie supprimée avec succès." });
  } catch (error) {
    console.error("Erreur suppression catégorie pratique :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la suppression de la catégorie.",
    });
  }
};
