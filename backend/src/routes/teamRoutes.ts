import express from "express";
import {
  getPublicTeams,
  getTeamBySlug,
  getAllTeamsAdmin,
  createTeam,
  updateTeam,
  deleteTeam,
  toggleTeamStatus,
} from "../controllers/teamController";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = express.Router();

// Routes admin
router.get("/admin/all", protect, requireRole(["admin"]), getAllTeamsAdmin);
router.post("/", protect, requireRole(["admin"]), createTeam);
router.put("/:id", protect, requireRole(["admin"]), updateTeam);
router.patch("/:id/toggle-status", protect, requireRole(["admin"]), toggleTeamStatus);
router.delete("/:id", protect, requireRole(["admin"]), deleteTeam);

// Routes publiques
router.get("/", getPublicTeams);
router.get("/:slug", getTeamBySlug);

export default router;