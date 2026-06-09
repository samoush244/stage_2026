import express from "express";
import {
  subscribeNewsletter,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber,
  unsubscribeNewsletter,
} from "../controllers/NewsletterSubscriber";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/unsubscribe/:token", unsubscribeNewsletter);

router.get("/", getNewsletterSubscribers);
router.delete("/:id", deleteNewsletterSubscriber);

export default router;