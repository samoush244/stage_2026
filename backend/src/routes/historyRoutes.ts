import express from "express";

import {
  getPublicHistories,
  getAllHistoriesAdmin,
  createHistory,
  updateHistory,
  deleteHistory,
  toggleHistoryStatus,
} from "../controllers/historyController";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import uploadHistory from "../middlewares/uploadHistory";

const router = express.Router();

router.get("/public", getPublicHistories);

router.get("/admin/all", protect, requireRole(["admin"]), getAllHistoriesAdmin);

router.post(
  "/",
  protect,
  requireRole(["admin"]),
  uploadHistory.single("image"),
  createHistory
);

router.put(
  "/:id",
  protect,
  requireRole(["admin"]),
  uploadHistory.single("image"),
  updateHistory
);

router.patch(
  "/:id/toggle-status",
  protect,
  requireRole(["admin"]),
  toggleHistoryStatus
);

router.delete("/:id", protect, requireRole(["admin"]), deleteHistory);

export default router;