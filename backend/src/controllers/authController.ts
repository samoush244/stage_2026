import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Player from "../models/Player";

const generateToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET manquant dans le fichier .env");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const normalize = (value: string) => {
  return value.trim().toLowerCase();
};

export const register = async (req: Request, res: Response) => {
  try {
    const { licenseNumber, firstName, lastName, email, password } = req.body;

    if (!licenseNumber || !firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires.",
      });
    }

    const player = await Player.findOne({
      licenseNumber: licenseNumber.trim(),
    });

    if (!player) {
      return res.status(404).json({
        message: "Aucun licencié trouvé avec ce numéro de licence.",
      });
    }

    if (
      normalize(player.firstName) !== normalize(firstName) ||
      normalize(player.lastName) !== normalize(lastName)
    ) {
      return res.status(400).json({
        message: "Le nom ou le prénom ne correspond pas à cette licence.",
      });
    }

    if (player.userAccount) {
      return res.status(400).json({
        message: "Un compte est déjà lié à cette licence.",
      });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Un compte existe déjà avec cet email.",
      });
    }
    

    const user = await User.create({
      firstName: player.firstName,
      lastName: player.lastName,
      email,
      password,
      roles: ["membre"],
      playerId: player._id,
    });

    player.userAccount = user._id;
    await player.save();

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      message: "Compte créé avec succès.",
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        playerId: user.playerId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de l'inscription.",
      error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Identifiants incorrects.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Identifiants incorrects.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Compte désactivé.",
      });
    }

    const token = generateToken(user._id.toString());

    return res.json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        playerId: user.playerId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la connexion.",
      error,
    });
  }
};