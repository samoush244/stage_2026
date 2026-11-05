import { Request, Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import NewsletterSubscriber from "../models/NewsletterSubscriber";

const CONSENT_TEXT =
  "J’accepte de recevoir les actualités du club par email. Je pourrai me désabonner à tout moment.";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const escapeCSV = (value: unknown): string => {
  let text = String(value ?? "");
  // Neutralise les cellules interprétables comme formules par Excel.
  if (/^\s*[=+\-@\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

const subscriberPublicFields = "_id email isActive consentDate createdAt";

// POST /api/newsletter/subscribe (public)
export const subscribeNewsletter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, consentGiven } = req.body ?? {};

    if (typeof email !== "string" || !email.trim()) {
      res.status(400).json({ message: "L'email est obligatoire." });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({ message: "Adresse email invalide." });
      return;
    }

    if (consentGiven !== true) {
      res.status(400).json({
        message: "Vous devez accepter de recevoir la newsletter.",
      });
      return;
    }

    const existingSubscriber = await NewsletterSubscriber.findOne({
      email: cleanEmail,
    });

    if (existingSubscriber?.isActive) {
      res.status(200).json({
        message: "Cet email est déjà inscrit à la newsletter.",
        alreadySubscribed: true,
      });
      return;
    }

    const unsubscribeToken = crypto.randomBytes(32).toString("hex");
    const consentDate = new Date();

    if (existingSubscriber) {
      // Réinscription volontaire via le formulaire et nouveau consentement.
      existingSubscriber.isActive = true;
      existingSubscriber.consentGiven = true;
      existingSubscriber.consentDate = consentDate;
      existingSubscriber.consentText = CONSENT_TEXT;
      existingSubscriber.unsubscribeToken = unsubscribeToken;
      existingSubscriber.welcomeEmailSent = false;
      existingSubscriber.welcomeEmailSentAt = undefined;
      existingSubscriber.unsubscribedAt = undefined;
      await existingSubscriber.save();
    } else {
      await NewsletterSubscriber.create({
        email: cleanEmail,
        isActive: true,
        consentGiven: true,
        consentDate,
        consentText: CONSENT_TEXT,
        unsubscribeToken,
        welcomeEmailSent: false,
      });
    }

    // Ne pas renvoyer le document complet (notamment unsubscribeToken).
    res.status(201).json({
      message: "Inscription réussie.",
      alreadySubscribed: false,
      welcomeEmailSent: false,
    });
  } catch (error: unknown) {
    // En cas de deux inscriptions simultanées du même email.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(200).json({
        message: "Cet email est déjà inscrit à la newsletter.",
        alreadySubscribed: true,
      });
      return;
    }
    console.error("Erreur inscription newsletter :", error);
    res.status(500).json({
      message: "Erreur lors de l'inscription à la newsletter.",
    });
  }
};

// GET /api/newsletter (administrateur uniquement)
export const getNewsletterSubscribers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subscribers = await NewsletterSubscriber.find()
      .select(subscriberPublicFields)
      .sort({ createdAt: -1 })
      .lean();

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Erreur récupération newsletter :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des inscrits.",
    });
  }
};

// DELETE /api/newsletter/:id (administrateur uniquement)
export const deleteNewsletterSubscriber = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id ?? "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Identifiant invalide." });
      return;
    }

    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);
    if (!subscriber) {
      res.status(404).json({ message: "Email introuvable." });
      return;
    }

    res.status(200).json({ message: "Email supprimé de la newsletter." });
  } catch (error) {
    console.error("Erreur suppression newsletter :", error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};

// GET /api/newsletter/unsubscribe/:token (public)
export const unsubscribeNewsletter = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const token = String(req.params.token ?? "");
    if (!/^[a-f0-9]{64}$/.test(token)) {
      res.status(404).send(`
        <div style="font-family:Arial,sans-serif;padding:40px">
          <h1>Lien invalide</h1><p>Ce lien de désinscription est invalide.</p>
        </div>`);
      return;
    }

    const subscriber = await NewsletterSubscriber.findOne({
      unsubscribeToken: token,
    });
    if (!subscriber) {
      res.status(404).send(`
        <div style="font-family:Arial,sans-serif;padding:40px">
          <h1>Lien invalide</h1><p>Ce lien de désinscription est invalide ou a expiré.</p>
        </div>`);
      return;
    }

    if (!subscriber.isActive) {
      res.status(200).send(`
        <div style="font-family:Arial,sans-serif;padding:40px">
          <h1>Déjà désinscrit</h1><p>Vous êtes déjà désinscrit de la newsletter.</p>
        </div>`);
      return;
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).send(`
      <div style="font-family:Arial,sans-serif;padding:40px">
        <h1>Désinscription confirmée</h1>
        <p>Vous êtes bien désinscrit de la newsletter du club.</p>
        <p>Vous ne recevrez plus nos actualités par email.</p>
      </div>`);
  } catch (error) {
    console.error("Erreur désinscription newsletter :", error);
    res.status(500).send(`
      <div style="font-family:Arial,sans-serif;padding:40px">
        <h1>Erreur</h1><p>Une erreur est survenue pendant la désinscription.</p>
      </div>`);
  }
};

// PATCH /api/newsletter/:id/status (administrateur uniquement)
export const updateNewsletterStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id ?? "");
    const isActive: unknown = req.body?.isActive;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Identifiant invalide." });
      return;
    }
    if (typeof isActive !== "boolean") {
      res.status(400).json({ message: "Le statut doit être un booléen." });
      return;
    }
    if (isActive) {
      res.status(403).json({
        message: "La réactivation nécessite un nouveau consentement de l'abonné.",
      });
      return;
    }

    const subscriber = await NewsletterSubscriber.findById(id);
    if (!subscriber) {
      res.status(404).json({ message: "Abonné introuvable." });
      return;
    }
    if (subscriber.isActive) {
      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();
    }

    res.status(200).json({
      _id: subscriber._id,
      email: subscriber.email,
      isActive: subscriber.isActive,
      createdAt: subscriber.createdAt,
      consentDate: subscriber.consentDate,
    });
  } catch (error) {
    console.error("Erreur modification statut :", error);
    res.status(500).json({
      message: "Erreur lors de la modification du statut.",
    });
  }
};

// GET /api/newsletter/export (administrateur uniquement)
export const exportNewsletterSubscribers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subscribers = await NewsletterSubscriber.find({
      isActive: true,
      consentGiven: true,
    })
      .select("email consentDate")
      .sort({ consentDate: -1 })
      .lean();

    const rows: string[][] = [["Email", "Date d'inscription"]];
    subscribers.forEach((subscriber) => {
      rows.push([
        subscriber.email,
        subscriber.consentDate
          ? new Date(subscriber.consentDate).toLocaleDateString("fr-FR")
          : "",
      ]);
    });

    const csv =
      "\uFEFF" + rows.map((row) => row.map(escapeCSV).join(";")).join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="newsletter-valenciennes-handball.csv"'
    );
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.status(200).send(csv);
  } catch (error) {
    console.error("Erreur export newsletter :", error);
    res.status(500).json({
      message: "Erreur lors de l'export des inscrits.",
    });
  }
};

