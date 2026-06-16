import { Request, Response, NextFunction } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error("Format d'image non autorisé. Utilisez JPG, PNG ou WEBP."));
    return;
  }

  cb(null, true);
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo
  },
}).single("logo");

export const uploadPracticeCategoryLogo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  multerUpload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message: "Le logo est trop lourd. Taille maximale autorisée : 2 Mo.",
        });
      }

      return res.status(400).json({
        message: "Erreur lors de l'envoi du logo.",
      });
    }

    if (error) {
      return res.status(400).json({
        message: error.message || "Format de logo non autorisé.",
      });
    }

    next();
  });
};