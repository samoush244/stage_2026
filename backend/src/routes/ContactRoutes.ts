import express from "express";

import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/ContactController";

const router = express.Router();

router.post("/", createContactMessage);

router.get("/", getContactMessages);

router.patch("/:id/status", updateContactMessageStatus);

router.delete("/:id", deleteContactMessage);

export default router;