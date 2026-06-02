import express from "express";
import {
  getPublishedNews,
  getNewsBySlug,
  getAllNewsAdmin,
  createNews,
  updateNews,
  deleteNews,
  togglePublishNews,
} from "../controllers/newsController";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import upload from "../middlewares/uploadNews";

const router = express.Router();

// Routes admin
router.get("/admin/all", protect, requireRole(["admin"]), getAllNewsAdmin);
router.post("/", protect, requireRole(["admin"]),upload.single("image"), createNews);
router.put("/:id", protect, requireRole(["admin"]), upload.single("image"),updateNews);
router.patch("/:id/toggle-publish",protect,requireRole(["admin"]),togglePublishNews);
router.delete("/:id", protect, requireRole(["admin"]), deleteNews);

// Routes publiques
router.get("/", getPublishedNews);
router.get("/:slug", getNewsBySlug);

export default router;
