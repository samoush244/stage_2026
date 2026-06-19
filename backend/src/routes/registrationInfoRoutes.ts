import express from "express";
import {
  addRegistrationDocument,
  deletePricingImage,
  deleteRegistrationDocument,
  getAdminRegistrationInfo,
  getPublicRegistrationInfo,
  updatePricingImage,
  updateRegistrationDocument,
  updateRegistrationInfo,
} from "../controllers/registrationInfoController";
import uploadRegistrationInfo from "../middlewares/uploadRegistrationInfo";

// IMPORTANT : adapte ces imports selon le nom exact de tes middlewares admin
import { protect} from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", getPublicRegistrationInfo);

router.get("/admin", protect, requireRole(["admin"]), getAdminRegistrationInfo);

router.put("/admin", protect, requireRole(["admin"]), updateRegistrationInfo);

router.post(
  "/admin/documents",
  protect,
  requireRole(["admin"]),
  uploadRegistrationInfo.single("file"),
  addRegistrationDocument
);

router.put(
  "/admin/documents/:documentId",
  protect,
  requireRole(["admin"]),
  updateRegistrationDocument
);

router.delete(
  "/admin/documents/:documentId",
  protect,
  requireRole(["admin"]),
  deleteRegistrationDocument
);

router.post(
  "/admin/pricing-image",
  protect,
  requireRole(["admin"]),
  uploadRegistrationInfo.single("image"),
  updatePricingImage
);

router.delete(
  "/admin/pricing-image",
  protect,
  requireRole(["admin"]),
  deletePricingImage
);

export default router;