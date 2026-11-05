import { Request, Response } from "express";
import { del, put } from "@vercel/blob";
import History from "../models/history";

const parseArrayField = (value: unknown): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(String).filter((item) => item.trim() !== "");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.map(String).filter((item) => item.trim() !== "");
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");
    }
  }

  return [];
};

const getUploadedFile = (req: Request): Express.Multer.File | undefined => {
  return req.file;
};

const allowedImageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const uploadImageToVercelBlob = async (
  file?: Express.Multer.File
): Promise<string | undefined> => {
  if (!file) return undefined;

  const extension = allowedImageExtensions[file.mimetype];
  if (!extension) {
    throw new Error("Seules les images JPG, PNG et WEBP sont autorisées.");
  }

  if (!file.buffer || file.buffer.length === 0) {
    throw new Error("Le fichier image est vide ou indisponible.");
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN n'est pas configuré.");
  }

  const blob = await put(`history/${Date.now()}.${extension}`, file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype,
    token,
  });

  return blob.url;
};

// Si MongoDB échoue après l'envoi d'une nouvelle photo, éviter de laisser
// un fichier inutilisé dans Blob. Ne jamais effacer une ancienne image ici.
const rollbackNewUpload = async (newUrl?: string) => {
  if (!newUrl) return;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return;

  try {
    await del(newUrl, { token });
  } catch (error) {
    console.error("Impossible de nettoyer le nouvel upload Blob :", error);
  }
};

const toBoolean = (value: unknown, defaultValue = true) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value !== "false";
};

export const getPublicHistories = async (_req: Request, res: Response) => {
  try {
    const histories = await History.find({ isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });

    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'histoire du club.",
    });
  }
};

export const getAllHistoriesAdmin = async (_req: Request, res: Response) => {
  try {
    const histories = await History.find().sort({
      order: 1,
      createdAt: 1,
    });

    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des histoires.",
    });
  }
};

export const createHistory = async (req: Request, res: Response) => {
  let newImageUrl: string | undefined;
  try {
    const { year, title, order, isActive } = req.body;

    if (!year || !title) {
      return res.status(400).json({
        message: "L'année et le titre sont obligatoires.",
      });
    }

    const file = getUploadedFile(req);
    newImageUrl = await uploadImageToVercelBlob(file);

    const history = await History.create({
      year,
      title,
      image: newImageUrl || "",
      text: parseArrayField(req.body.text),
      details: parseArrayField(req.body.details),
      order: Number(order) || 0,
      isActive: toBoolean(isActive, true),
    });

    return res.status(201).json(history);
  } catch (error) {
    await rollbackNewUpload(newImageUrl);
    console.error("Erreur création histoire :", error);
    return res.status(500).json({
      message: "Erreur lors de la création de l'histoire.",
    });
  }
};

export const updateHistory = async (req: Request, res: Response) => {
  let newImageUrl: string | undefined;
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        message: "Histoire introuvable.",
      });
    }

    const { year, title, order, isActive } = req.body;

    history.year = year || history.year;
    history.title = title || history.title;

    if (req.body.text !== undefined) {
      history.text = parseArrayField(req.body.text);
    }

    if (req.body.details !== undefined) {
      history.details = parseArrayField(req.body.details);
    }

    if (order !== undefined) {
      history.order = Number(order);
    }

    if (isActive !== undefined) {
      history.isActive = toBoolean(isActive, history.isActive);
    }

    const file = getUploadedFile(req);
    newImageUrl = await uploadImageToVercelBlob(file);

    if (newImageUrl) {
      history.image = newImageUrl;
    }

    const updatedHistory = await history.save();

    return res.status(200).json(updatedHistory);
  } catch (error) {
    await rollbackNewUpload(newImageUrl);
    console.error("Erreur modification histoire :", error);
    return res.status(500).json({
      message: "Erreur lors de la modification de l'histoire.",
    });
  }
};

export const deleteHistory = async (req: Request, res: Response) => {
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        message: "Histoire introuvable.",
      });
    }

    // Ne pas supprimer l'image physique pendant la migration :
    // d'anciennes URL Cloudinary peuvent encore être utilisées ailleurs.
    await history.deleteOne();

    return res.status(200).json({
      message: "Histoire supprimée avec succès.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'histoire.",
    });
  }
};

export const toggleHistoryStatus = async (req: Request, res: Response) => {
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        message: "Histoire introuvable.",
      });
    }

    history.isActive = !history.isActive;

    const updatedHistory = await history.save();

    return res.status(200).json(updatedHistory);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors du changement de statut.",
    });
  }
};
