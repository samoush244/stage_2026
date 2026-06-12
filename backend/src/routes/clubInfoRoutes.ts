import express from "express";
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
    fileSize: 50 * 1024 * 1024,
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

router.get("/", getClubInfo);

router.put(
  "/",
  protect,
  requireRole(["admin"]),
  upload.single("heroMedia"),
  updateClubInfo
);

export default router;