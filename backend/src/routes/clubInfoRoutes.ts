import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import {
  getClubInfo,
  updateClubInfo,
} from "../controllers/clubInfoController";
import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // 100 Mo max
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (!isImage && !isVideo) {
      cb(new Error("Seules les images et les vidéos sont autorisées."));
      return;
    }

    cb(null, true);
  },
});

const uploadHeroMedia = (req: Request, res: Response, next: NextFunction) => {
  upload.single("heroMedia")(req, res, (error: any) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message:
            "Le fichier est trop lourd. Utilise une image ou une vidéo plus légère.",
        });
      }

      return res.status(400).json({
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        message: error.message || "Erreur pendant l'upload du fichier.",
      });
    }

    next();
  });
};

router.get("/", getClubInfo);

router.put(
  "/",
  protect,
  requireRole(["admin"]),
  uploadHeroMedia,
  updateClubInfo
);

export default router;