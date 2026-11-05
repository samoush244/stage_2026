import { Request, Response } from "express";
import { put } from "@vercel/blob";
import Partner from "../models/partner";

const getUploadedFile = (req: Request): Express.Multer.File | undefined => {
  return (req as Request & { file?: Express.Multer.File }).file;
};

const uploadLogoToVercelBlob = async (
  file?: Express.Multer.File
): Promise<string | undefined> => {
  if (!file) return undefined;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN n'est pas configuré sur le serveur.");
  }

  const allowedExtensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  const extension = allowedExtensions[file.mimetype];
  if (!extension) {
    throw new Error("Seules les images JPG, PNG et WEBP sont autorisées.");
  }

  const blob = await put(`partners/${Date.now()}.${extension}`, file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype,
    token,
  });

  return blob.url;
};

const toBoolean = (value: unknown, defaultValue = true) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "boolean") return value;

  const normalizedValue = String(value).trim().toLowerCase();
  return (
    normalizedValue === "true" ||
    normalizedValue === "1" ||
    normalizedValue === "visible" ||
    normalizedValue === "on" ||
    normalizedValue === "oui"
  );
};

export const getPartners = async (_req: Request, res: Response) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({
      category: 1,
      order: 1,
      name: 1,
    });

    return res.status(200).json(partners);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des partenaires",
    });
  }
};

export const getAllPartnersAdmin = async (_req: Request, res: Response) => {
  try {
    const partners = await Partner.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json(partners);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération admin des partenaires",
    });
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    const { name, url, category, order, isActive, showOnHome } = req.body;

    if (!name || !url || !category) {
      return res.status(400).json({
        message: "Le nom, la catégorie et l'URL sont obligatoires",
      });
    }

    const file = getUploadedFile(req);
    if (!file) {
      return res.status(400).json({ message: "Le logo est obligatoire" });
    }

    const logoUrl = await uploadLogoToVercelBlob(file);
    if (!logoUrl) {
      return res.status(400).json({ message: "Erreur lors de l'upload du logo" });
    }

    const partner = await Partner.create({
      name,
      url,
      category,
      logo: logoUrl,
      order: order !== undefined && order !== "" ? Number(order) : 0,
      isActive: toBoolean(isActive, true),
      showOnHome: toBoolean(showOnHome, false),
    });

    return res.status(201).json(partner);
  } catch (error) {
    console.error("Erreur création partenaire :", error);
    return res.status(500).json({
      message: "Erreur lors de la création du partenaire",
    });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, category, order, isActive, showOnHome } = req.body;

    // Vérifier l'existence avant d'envoyer un éventuel nouveau logo.
    const existingPartner = await Partner.findById(id);
    if (!existingPartner) {
      return res.status(404).json({ message: "Partenaire introuvable" });
    }

    const updateData: {
      name?: string;
      url?: string;
      category?: string;
      logo?: string;
      order?: number;
      isActive?: boolean;
      showOnHome?: boolean;
    } = {};

    if (name) updateData.name = name;
    if (url) updateData.url = url;
    if (category) updateData.category = category;

    if (order !== undefined && order !== "") {
      updateData.order = Number(order);
    }

    if (isActive !== undefined) {
      updateData.isActive = toBoolean(isActive, true);
    }

    if (showOnHome !== undefined) {
      updateData.showOnHome = toBoolean(showOnHome, false);
    }

    const file = getUploadedFile(req);
    if (file) {
      const logoUrl = await uploadLogoToVercelBlob(file);
      if (logoUrl) updateData.logo = logoUrl;
    }

    const partner = await Partner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!partner) {
      return res.status(404).json({ message: "Partenaire introuvable" });
    }

    return res.status(200).json(partner);
  } catch (error) {
    console.error("Erreur modification partenaire :", error);
    return res.status(500).json({
      message: "Erreur lors de la modification du partenaire",
    });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByIdAndDelete(id);

    if (!partner) {
      return res.status(404).json({ message: "Partenaire introuvable" });
    }

    return res.status(200).json({
      message: "Partenaire supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression du partenaire",
    });
  }
};
