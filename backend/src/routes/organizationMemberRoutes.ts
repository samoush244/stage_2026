import express from "express";
import {
  getPublicOrganizationMembers,
  getAllOrganizationMembers,
  getOrganizationMemberById,
  createOrganizationMember,
  updateOrganizationMember,
  deleteOrganizationMember,
} from "../controllers/organizationMembercontroller";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/public", getPublicOrganizationMembers);

router.get("/", protect, requireRole(["admin"]), getAllOrganizationMembers);

router.get("/:id", protect, requireRole(["admin"]), getOrganizationMemberById);

router.post("/", protect, requireRole(["admin"]), createOrganizationMember);

router.put("/:id", protect, requireRole(["admin"]), updateOrganizationMember);

router.delete("/:id", protect, requireRole(["admin"]), deleteOrganizationMember);

export default router;