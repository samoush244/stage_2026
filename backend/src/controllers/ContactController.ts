import { Request, Response } from "express";
import ContactMessage from "../models/ContactMessage";

export const createContactMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message: "Veuillez remplir tous les champs obligatoires.",
      });
    }

    const newMessage = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    });

    return res.status(201).json({
      message: "Message envoyé avec succès.",
      newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'envoi du message.",
      error,
    });
  }
};

export const getContactMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const messages = await ContactMessage.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des messages.",
      error,
    });
  }
};

export const updateContactMessageStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        message: "Message introuvable.",
      });
    }

    return res.status(200).json({
      message: "Statut mis à jour.",
      updatedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour.",
      error,
    });
  }
};

export const deleteContactMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const deletedMessage = await ContactMessage.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        message: "Message introuvable.",
      });
    }

    return res.status(200).json({
      message: "Message supprimé.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression.",
      error,
    });
  }
};