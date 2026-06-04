import { Request, Response } from "express";
import History from "../models/history";
import cloudinary from "../config/cloudinary";

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

const getUploadedFile = (req: Request) => {
  return (req as Request & { file?: Express.Multer.File }).file;
};

const uploadImageToCloudinary = async (
  file?: Express.Multer.File
): Promise<string | undefined> => {
  if (!file) {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "stage-handball/histories",
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
  try {
    const { year, title, order, isActive } = req.body;

    if (!year || !title) {
      return res.status(400).json({
        message: "L'année et le titre sont obligatoires.",
      });
    }

    const file = getUploadedFile(req);
    const imageUrl = await uploadImageToCloudinary(file);

    const history = await History.create({
      year,
      title,
      image: imageUrl || "",
      text: parseArrayField(req.body.text),
      details: parseArrayField(req.body.details),
      order: Number(order) || 0,
      isActive: toBoolean(isActive, true),
    });

    res.status(201).json(history);
  } catch (error) {
    console.error("Erreur création histoire :", error);

    res.status(500).json({
      message: "Erreur lors de la création de l'histoire.",
    });
  }
};

export const updateHistory = async (req: Request, res: Response) => {
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
    const imageUrl = await uploadImageToCloudinary(file);

    if (imageUrl) {
      history.image = imageUrl;
    }

    const updatedHistory = await history.save();

    res.status(200).json(updatedHistory);
  } catch (error) {
    console.error("Erreur modification histoire :", error);

    res.status(500).json({
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

    await history.deleteOne();

    res.status(200).json({
      message: "Histoire supprimée avec succès.",
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du changement de statut.",
    });
  }
};
