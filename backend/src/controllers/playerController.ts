import { Request, Response } from "express";
import Player from "../models/Player";

export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { licenseNumber, firstName, lastName, roles } = req.body;

    if (!licenseNumber || !firstName || !lastName) {
      return res.status(400).json({
        message: "Numéro de licence, nom et prénom sont obligatoires.",
      });
    }

    const existingPlayer = await Player.findOne({ licenseNumber });

    if (existingPlayer) {
      return res.status(400).json({
        message: "Un joueur existe déjà avec ce numéro de licence.",
      });
    }

    const player = await Player.create({
      licenseNumber,
      firstName,
      lastName,
      roles: roles && roles.length > 0 ? roles : ["joueur"],
    });

    return res.status(201).json({
      message: "Joueur créé avec succès.",
      player,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la création du joueur.",
      error,
    });
  }
};

export const getPlayers = async (_req: Request, res: Response) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });

    return res.json(players);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des joueurs.",
      error,
    });
  }
};