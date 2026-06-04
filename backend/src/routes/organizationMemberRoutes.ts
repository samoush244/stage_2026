import express from "express";
import {
  getPublicOrganizationMembers,
  getAllOrganizationMembers,
  createOrganizationMember,
  updateOrganizationMember,
  deleteOrganizationMember,
  toggleOrganizationMemberStatus,
} from "../controllers/organizationMemberController";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import uploadOrganization from "../middlewares/uploadOrganization";

const router = express.Router();

router.get("/", getPublicOrganizationMembers);

router.get("/admin/all", protect, requireRole(["admin"]), getAllOrganizationMembers);

router.post("/", protect, requireRole(["admin"]), uploadOrganization.single("photo"), createOrganizationMember);

router.put("/:id", protect, requireRole(["admin"]), uploadOrganization.single("photo"), updateOrganizationMember);

router.delete("/:id", protect, requireRole(["admin"]), deleteOrganizationMember);

router.patch("/:id/toggle-status", protect, requireRole(["admin"]), toggleOrganizationMemberStatus);

export default router;