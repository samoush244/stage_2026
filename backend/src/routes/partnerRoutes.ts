import express from "express";
import {
  getPartners,
  getAllPartnersAdmin,
  createPartner,
  updatePartner,
  deletePartner,
} from "../controllers/partnerController";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = express.Router();

/**
 * Routes publiques
 */
router.get("/", getPartners);

/**
 * Routes admin
 */
router.get("/admin/all", protect, requireRole(["admin"]), getAllPartnersAdmin);
router.post("/", protect, requireRole(["admin"]), createPartner);
router.put("/:id", protect, requireRole(["admin"]), updatePartner);
router.delete("/:id", protect, requireRole(["admin"]), deletePartner);

export default router;