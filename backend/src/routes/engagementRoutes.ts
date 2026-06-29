import express from "express";

import {
  createEngagementGalleryItem,
  createEngagementLabel,
  deleteEngagementGalleryItem,
  deleteEngagementLabel,
  getEngagementPageAdmin,
  getPublicEngagementPage,
  updateEngagementGalleryItem,
  updateEngagementLabel,
  updateEngagementSettings,
} from "../controllers/engagementController";

import uploadEngagement from "../middlewares/uploadEngagement";
import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
const router = express.Router();

/* Public */
router.get("/", getPublicEngagementPage);

/*
  Ajoute ici ton middleware d'authentification admin existant
  sur toutes les routes ci-dessous.
*/

/* Admin : informations principales */
router.get("/admin",protect, requireRole(["admin"]), getEngagementPageAdmin);
router.put(
  "/admin/settings",protect, requireRole(["admin"]),
  uploadEngagement.single("partnerLogo"),
  updateEngagementSettings
);

/* Admin : labels */
router.post(
  "/admin/labels",protect, requireRole(["admin"]),
  uploadEngagement.single("labelLogo"),
  createEngagementLabel
);

router.put(
  "/admin/labels/:labelId",protect, requireRole(["admin"]),
  uploadEngagement.single("labelLogo"),
  updateEngagementLabel
);

router.delete("/admin/labels/:labelId",protect, requireRole(["admin"]), deleteEngagementLabel);

/* Admin : galerie */
router.post(
  "/admin/gallery",
  uploadEngagement.single("galleryImage"),protect, requireRole(["admin"]),
  createEngagementGalleryItem
);

router.put(
  "/admin/gallery/:galleryId",
  uploadEngagement.single("galleryImage"), protect, requireRole(["admin"]),
  updateEngagementGalleryItem
);

router.delete("/admin/gallery/:galleryId",protect, requireRole(["admin"]), deleteEngagementGalleryItem);

export default router;

