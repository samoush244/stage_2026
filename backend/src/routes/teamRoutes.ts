import express from "express";
import {
  getPublicTeams,
  getTeamBySlug,
  getAllTeamsAdmin,
  createTeam,
  updateTeam,
  deleteTeam,
 
} from "../controllers/teamController";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import uploadTeamImage from "../middlewares/uploadTeamImage";

const router = express.Router();

// Routes admin
router.get("/admin/all", protect, requireRole(["admin"]), getAllTeamsAdmin);
router.post("/", protect, requireRole(["admin"]),uploadTeamImage.single("image"), createTeam);
router.put("/:id", protect, requireRole(["admin"]), uploadTeamImage.single("image"),updateTeam);
router.delete("/:id", protect, requireRole(["admin"]), deleteTeam);

// Routes publiques
router.get("/", getPublicTeams);
router.get("/slug/:slug", getTeamBySlug);

export default router;