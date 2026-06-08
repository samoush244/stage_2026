import { Request, Response } from "express";
import crypto from "crypto";
import NewsletterSubscriber from "../models/NewsletterSubscriber";
import { sendWelcomeEmail } from "../services/mailServices";

const CONSENT_TEXT =
  "J’accepte de recevoir par email les actualités, événements et informations du club.";

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email, consentGiven } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "L'email est obligatoire.",
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        message: "Adresse email invalide.",
      });
    }

    if (consentGiven !== true) {
      return res.status(400).json({
        message: "Vous devez accepter de recevoir la newsletter.",
      });
    }

    const existingSubscriber = await NewsletterSubscriber.findOne({
      email: cleanEmail,
    });

    if (existingSubscriber && existingSubscriber.isActive) {
      return res.status(409).json({
        message: "Cet email est déjà inscrit à la newsletter.",
      });
    }

    const unsubscribeToken = crypto.randomBytes(32).toString("hex");

    let subscriber;

    if (existingSubscriber && !existingSubscriber.isActive) {
      existingSubscriber.isActive = true;
      existingSubscriber.consentGiven = true;
      existingSubscriber.consentDate = new Date();
      existingSubscriber.consentText = CONSENT_TEXT;
      existingSubscriber.unsubscribeToken = unsubscribeToken;
      existingSubscriber.welcomeEmailSent = false;
      existingSubscriber.welcomeEmailSentAt = undefined;
      existingSubscriber.unsubscribedAt = undefined;

      subscriber = await existingSubscriber.save();
    } else {
      subscriber = await NewsletterSubscriber.create({
        email: cleanEmail,
        isActive: true,
        consentGiven: true,
        consentDate: new Date(),
        consentText: CONSENT_TEXT,
        unsubscribeToken,
      });
    }

    const backendUrl =
      process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

    const unsubscribeUrl = `${backendUrl}/api/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;

    let welcomeEmailSent = false;

    try {
      await sendWelcomeEmail(cleanEmail, unsubscribeUrl);

      subscriber.welcomeEmailSent = true;
      subscriber.welcomeEmailSentAt = new Date();
      await subscriber.save();

      welcomeEmailSent = true;
    } catch (emailError) {
      console.error("Erreur envoi email de bienvenue :", emailError);
    }

    return res.status(201).json({
      message: welcomeEmailSent
        ? "Inscription réussie. Un email de bienvenue a été envoyé."
        : "Inscription réussie, mais l'email de bienvenue n'a pas pu être envoyé.",
      subscriber,
      welcomeEmailSent,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'inscription à la newsletter.",
      error,
    });
  }
};

export const getNewsletterSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(subscribers);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des inscrits.",
      error,
    });
  }
};

export const deleteNewsletterSubscriber = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const deletedSubscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!deletedSubscriber) {
      return res.status(404).json({
        message: "Email introuvable.",
      });
    }

    return res.status(200).json({
      message: "Email supprimé de la newsletter.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression.",
      error,
    });
  }
};

export const unsubscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const subscriber = await NewsletterSubscriber.findOne({
      unsubscribeToken: token,
    });

    if (!subscriber) {
      return res.status(404).send(`
        <h1>Lien invalide</h1>
        <p>Ce lien de désinscription est invalide ou a expiré.</p>
      `);
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();

    await subscriber.save();

    return res.status(200).send(`
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1>Désinscription confirmée</h1>
        <p>Vous êtes bien désinscrit de la newsletter du club.</p>
        <p>Vous ne recevrez plus nos actualités par email.</p>
      </div>
    `);
  } catch (error) {
    return res.status(500).send(`
      <h1>Erreur</h1>
      <p>Une erreur est survenue pendant la désinscription.</p>
    `);
  }
};