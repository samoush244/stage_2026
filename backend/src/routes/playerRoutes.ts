import express from "express";
import uploadExcel from "../middlewares/uploadExcel";
import {
  createPlayer,
  getPlayers,
  updatePlayer,
  togglePlayerDisplay,
  togglePlayerStatus,
  deletePlayer,
  getPublicRosterByTeamSlug,
  getPlayerById,
  getPlayersByTeam,
  getPublicPlayersByTeam,
  importPlayersExcel,
} from "../controllers/playerController";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = express.Router();

// Admin
router.post("/import",protect, requireRole(["admin"]),uploadExcel.single("file"),importPlayersExcel);
router.get("/admin/all", protect, requireRole(["admin"]), getPlayers);
router.post("/", protect, requireRole(["admin"]), createPlayer);
router.put("/:id", protect, requireRole(["admin"]), updatePlayer);
router.patch("/:id/toggle-display", protect, requireRole(["admin"]), togglePlayerDisplay);
router.patch("/:id/toggle-status", protect, requireRole(["admin"]), togglePlayerStatus);
router.delete("/:id", protect, requireRole(["admin"]), deletePlayer);

// Public
router.get("/team/:teamId/roster", getPublicRosterByTeamSlug);
router.get("/team/:teamId/players", getPublicPlayersByTeam);
router.get("/:id", getPlayerById);

export default router;