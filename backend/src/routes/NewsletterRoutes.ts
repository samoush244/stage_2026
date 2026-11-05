
import express from "express";

import {
  subscribeNewsletter,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber,
  unsubscribeNewsletter,
  updateNewsletterStatus,
  exportNewsletterSubscribers,
} from "../controllers/NewsletterSubscriber";

const router = express.Router();

// ======================================
// ROUTES PUBLIQUES
// ======================================

router.post("/subscribe", subscribeNewsletter);

router.get(
  "/unsubscribe/:token",
  unsubscribeNewsletter
);

// ======================================
// ROUTES ADMINISTRATEUR
// À PROTÉGER AVEC LE MIDDLEWARE ADMIN
// ======================================

// Télécharger le fichier CSV
router.get(
  "/export",
  exportNewsletterSubscribers
);

// Récupérer la liste des abonnés
router.get(
  "/",
  getNewsletterSubscribers
);

// Modifier le statut
router.patch(
  "/:id/status",
  updateNewsletterStatus
);

// Supprimer un abonné
router.delete(
  "/:id",
  deleteNewsletterSubscriber
);

export default router;
