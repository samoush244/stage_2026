import express from "express";
import {
  subscribeNewsletter,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber,
} from "../controllers/NewsletterSubscriber";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/", getNewsletterSubscribers);
router.delete("/:id", deleteNewsletterSubscriber);

export default router;