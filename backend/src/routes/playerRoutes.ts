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
import uploadPlayerImage from "../middlewares/uploadPlayerImage";

const router = express.Router();

// Public
router.get("/public/team/:teamSlug/roster", getPublicRosterByTeamSlug);
router.get("/team/:teamSlug/players", getPublicPlayersByTeam);
router.get("/:id", getPlayerById);

// Admin
router.post(
  "/import",
  protect,
  requireRole(["admin"]),
  uploadExcel.single("file"),
  importPlayersExcel
);

router.get("/admin/all", protect, requireRole(["admin"]), getPlayers);

router.post(
  "/",
  protect,
  requireRole(["admin"]),
  uploadPlayerImage.single("photo"),
  createPlayer
);

router.put(
  "/:id",
  protect,
  requireRole(["admin"]),
  uploadPlayerImage.single("photo"),
  updatePlayer
);

router.patch("/:id/toggle-display", protect, requireRole(["admin"]), togglePlayerDisplay);
router.patch("/:id/toggle-status", protect, requireRole(["admin"]), togglePlayerStatus);
router.delete("/:id", protect, requireRole(["admin"]), deletePlayer);

export default router;