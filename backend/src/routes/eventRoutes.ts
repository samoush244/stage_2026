import express from "express";
import {
  getPublicEvents,
  getPublicEventBySlug,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventcontroller";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import uploadEventImage from "../middlewares/uploadEventImage";
const router = express.Router();

// Public
router.get("/public", getPublicEvents);
router.get("/public/:slug", getPublicEventBySlug);

// Admin
router.get("/admin/all", protect, requireRole(["admin"]), getAllEventsAdmin);
router.post("/", protect, requireRole(["admin"]), uploadEventImage.single("image"), createEvent);
router.put("/:id", protect, requireRole(["admin"]),uploadEventImage.single("image"), updateEvent);
router.delete("/:id", protect, requireRole(["admin"]), deleteEvent);

export default router;