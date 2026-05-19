import { Request, Response } from "express";
import NewsletterSubscriber from "../models/NewsletterSubscriber";

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "L'email est obligatoire." });
    }

    const existingSubscriber = await NewsletterSubscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(409).json({
        message: "Cet email est déjà inscrit à la newsletter.",
      });
    }

    const subscriber = await NewsletterSubscriber.create({
      email,
    });

    return res.status(201).json({
      message: "Inscription à la newsletter réussie.",
      subscriber,
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
      return res.status(404).json({ message: "Email introuvable." });
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