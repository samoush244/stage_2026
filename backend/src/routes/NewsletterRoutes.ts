import express from "express";
import {
  subscribeNewsletter,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber,
  unsubscribeNewsletter,
  exportNewsletterSubscribers,
} from "../controllers/NewsletterSubscriber";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/unsubscribe/:token", unsubscribeNewsletter);

router.get("/", getNewsletterSubscribers);
router.delete("/:id", deleteNewsletterSubscriber);
router.get("/export", exportNewsletterSubscribers);

export default router;