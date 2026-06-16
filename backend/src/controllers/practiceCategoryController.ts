import { Request, Response } from "express";
import PracticeCategory from "../models/PracticeCategory";
import cloudinary from "../config/cloudinary";

type MulterRequest = Request & {
  file?: Express.Multer.File;
};

const cleanStringArray = (value: unknown): string[] => {
  let parsedValue = value;

  if (typeof value === "string") {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      parsedValue = value.split(",");
    }
  }

  if (!Array.isArray(parsedValue)) {
    return [];
  }

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

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue
    .map((row) => {
      const rawRow = row as {
        day?: unknown;
        cells?: unknown;
      };

      const cells = Array.isArray(rawRow.cells)
        ? rawRow.cells.map((cell) => {
            const rawCell = cell as {
              time?: unknown;
              location?: unknown;
            };

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

const uploadLogoToCloudinary = async (
  file?: Express.Multer.File
): Promise<{ logoUrl: string; logoPublicId: string } | null> => {
  if (!file) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "stage-handball/practice-categories",
        resource_type: "image",
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "auto",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
          return;
        }

        resolve({
          logoUrl: result.secure_url,
          logoPublicId: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

const deleteCloudinaryImage = async (publicId?: string) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Erreur suppression image Cloudinary :", error);
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
      message:
        "Erreur serveur lors de la récupération des informations pratiques.",
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
  try {
    const {
      title,
      birthYearsLabel,
      columns,
      rows,
      order,
      isActive,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Le nom de la catégorie est obligatoire.",
      });
    }

    const cleanColumns = cleanStringArray(columns);

    if (cleanColumns.length === 0) {
      return res.status(400).json({
        message: "Au moins une colonne est obligatoire.",
      });
    }

    const uploadedLogo = await uploadLogoToCloudinary(req.file);

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
  try {
    const { id } = req.params;

    const {
      title,
      birthYearsLabel,
      coachName,
      coachEmail,
      columns,
      rows,
      order,
      isActive,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Le nom de la catégorie est obligatoire.",
      });
    }

    const category = await PracticeCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Catégorie introuvable.",
      });
    }

    const cleanColumns = cleanStringArray(columns);

    if (cleanColumns.length === 0) {
      return res.status(400).json({
        message: "Au moins une colonne est obligatoire.",
      });
    }

    let logoUrl = category.logoUrl;
    let logoPublicId = category.logoPublicId;

    const uploadedLogo = await uploadLogoToCloudinary(req.file);

    if (uploadedLogo) {
      await deleteCloudinaryImage(category.logoPublicId);

      logoUrl = uploadedLogo.logoUrl;
      logoPublicId = uploadedLogo.logoPublicId;
    }

    category.title = String(title).trim();
    category.birthYearsLabel = birthYearsLabel
      ? String(birthYearsLabel).trim()
      : "";
    category.logoUrl = logoUrl || "";
    category.logoPublicId = logoPublicId || "";
    category.columns = cleanColumns;
    category.rows = cleanRows(rows);
    category.order = Number(order) || 0;
    category.isActive = isActive === "false" ? false : isActive !== false;

    await category.save();

    return res.status(200).json(category);
  } catch (error) {
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
      return res.status(404).json({
        message: "Catégorie introuvable.",
      });
    }

    await deleteCloudinaryImage(category.logoPublicId);

    return res.status(200).json({
      message: "Catégorie supprimée avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression catégorie pratique :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la suppression de la catégorie.",
    });
  }
};