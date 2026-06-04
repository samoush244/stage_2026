import { Request, Response } from "express";
import Partner from "../models/partner";
import cloudinary from "../config/cloudinary";

const getUploadedFile = (req: Request) => {
  return (req as Request & { file?: Express.Multer.File }).file;
};

const uploadLogoToCloudinary = async (
  file?: Express.Multer.File
): Promise<string | undefined> => {
  if (!file) {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "stage-handball/partners",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result?.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

const toBoolean = (value: unknown, defaultValue = true) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "Visible";
};

export const getPartners = async (req: Request, res: Response) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({
      category: 1,
      order: 1,
      name: 1,
    });

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des partenaires",
    });
  }
};

export const getAllPartnersAdmin = async (req: Request, res: Response) => {
  try {
    const partners = await Partner.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération admin des partenaires",
    });
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    const { name, url, category, order, isActive } = req.body;

    if (!name || !url || !category) {
      return res.status(400).json({
        message: "Le nom, la catégorie et l'URL sont obligatoires",
      });
    }

    const file = getUploadedFile(req);

    if (!file) {
      return res.status(400).json({
        message: "Le logo est obligatoire",
      });
    }

    const logoUrl = await uploadLogoToCloudinary(file);

    if (!logoUrl) {
      return res.status(400).json({
        message: "Erreur lors de l'upload du logo",
      });
    }

    const partner = await Partner.create({
      name,
      url,
      category,
      logo: logoUrl,
      order: order ? Number(order) : 0,
      isActive: toBoolean(isActive, true),
    });

    res.status(201).json(partner);
  } catch (error) {
    console.error("Erreur création partenaire :", error);
    res.status(500).json({
      message: "Erreur lors de la création du partenaire",
    });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, category, order, isActive } = req.body;

    const updateData: {
      name?: string;
      url?: string;
      category?: string;
      logo?: string;
      order?: number;
      isActive?: boolean;
    } = {};

    if (name) updateData.name = name;
    if (url) updateData.url = url;
    if (category) updateData.category = category;
    if (order !== undefined) updateData.order = Number(order);

    if (isActive !== undefined) {
      updateData.isActive = toBoolean(isActive, true);
    }

    const file = getUploadedFile(req);
    const logoUrl = await uploadLogoToCloudinary(file);

    if (logoUrl) {
      updateData.logo = logoUrl;
    }

    const partner = await Partner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!partner) {
      return res.status(404).json({
        message: "Partenaire introuvable",
      });
    }

    res.status(200).json(partner);
  } catch (error) {
    console.error("Erreur modification partenaire :", error);

    res.status(500).json({
      message: "Erreur lors de la modification du partenaire",
    });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByIdAndDelete(id);

    if (!partner) {
      return res.status(404).json({
        message: "Partenaire introuvable",
      });
    }

    res.status(200).json({
      message: "Partenaire supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du partenaire",
    });
  }
};
