// src/controllers/teamController.ts
import { Request, Response } from "express";
import { put } from "@vercel/blob";
import Team from "../models/Team";

const createSlug = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// Envoie une nouvelle photo d'équipe vers Vercel Blob.
// Les anciennes URL Cloudinary restent valables tant que leurs fichiers existent.
const uploadImageToVercel = async (
  file?: Express.Multer.File
): Promise<string | undefined> => {
  if (!file) return undefined;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("La variable BLOB_READ_WRITE_TOKEN est absente du backend.");
  }

  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensions[file.mimetype];
  if (!extension) {
    throw new Error("Seules les images JPG, PNG et WEBP sont autorisées.");
  }

  const blob = await put(`teams/${Date.now()}.${extension}`, file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype,
    token,
  });

  return blob.url;
};

const toBoolean = (value: unknown, defaultValue = true) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "boolean") return value;
  return value === "true";
};

// PUBLIC - Récupérer les équipes premières
export const getPublicFirstTeams = async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find({ teamType: "premiere", isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    return res.status(200).json(teams);
  } catch (error) {
    console.error("Erreur récupération équipes premières :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des équipes premières.",
    });
  }
};

// PUBLIC - Récupérer les équipes actives
export const getPublicTeams = async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find({ isActive: true }).sort({
      teamType: -1,
      order: 1,
      createdAt: -1,
    });
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des équipes.",
    });
  }
};

// PUBLIC - Récupérer une équipe par slug
export const getTeamBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const team = await Team.findOne({ slug, isActive: true });

    if (!team) {
      return res.status(404).json({ message: "Équipe introuvable." });
    }
    return res.status(200).json(team);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'équipe.",
    });
  }
};

// ADMIN - Récupérer toutes les équipes
export const getAllTeamsAdmin = async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find().sort({
      teamType: -1,
      order: 1,
      createdAt: -1,
    });
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des équipes admin.",
    });
  }
};

// ADMIN - Créer une équipe
export const createTeam = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      teamType,
      gender,
      category,
      level,
      description,
      ffhandballUrl,
      scorencoUrl,
      order,
      isActive,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Le nom de l'équipe est obligatoire.",
      });
    }

    const finalSlug =
      slug && slug.trim() !== "" ? createSlug(slug) : createSlug(name);
    const existingTeam = await Team.findOne({ slug: finalSlug });

    if (existingTeam) {
      return res.status(400).json({
        message: "Une équipe existe déjà avec ce slug.",
      });
    }

    const imageUrl = await uploadImageToVercel(req.file);

    const team = await Team.create({
      name,
      slug: finalSlug,
      teamType: teamType || "autre",
      gender: gender || "mixte",
      category,
      level,
      description,
      image: imageUrl,
      ffhandballUrl,
      scorencoUrl,
      order: order ? Number(order) : 0,
      isActive: toBoolean(isActive, true),
    });

    return res.status(201).json(team);
  } catch (error) {
    console.error("Erreur création équipe :", error);
    return res.status(500).json({
      message: "Erreur lors de la création de l'équipe.",
    });
  }
};

// ADMIN - Modifier une équipe
export const updateTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({ message: "Équipe introuvable." });
    }

    const {
      name,
      slug,
      teamType,
      gender,
      category,
      level,
      description,
      ffhandballUrl,
      scorencoUrl,
      order,
      isActive,
    } = req.body;

    if (name !== undefined) team.name = name;

    if (slug !== undefined && slug.trim() !== "") {
      const newSlug = createSlug(slug);
      const existingTeam = await Team.findOne({
        slug: newSlug,
        _id: { $ne: team._id },
      });
      if (existingTeam) {
        return res.status(400).json({
          message: "Une équipe existe déjà avec ce slug.",
        });
      }
      team.slug = newSlug;
    }

    if (teamType !== undefined) team.teamType = teamType;
    if (gender !== undefined) team.gender = gender;
    if (category !== undefined) team.category = category;
    if (level !== undefined) team.level = level;
    if (description !== undefined) team.description = description;
    if (ffhandballUrl !== undefined) team.ffhandballUrl = ffhandballUrl;
    if (scorencoUrl !== undefined) team.scorencoUrl = scorencoUrl;
    if (order !== undefined) team.order = Number(order);
    if (isActive !== undefined) team.isActive = toBoolean(isActive, team.isActive);

    // Une modification sans nouveau fichier conserve la photo existante.
    const imageUrl = await uploadImageToVercel(req.file);
    if (imageUrl) team.image = imageUrl;

    await team.save();
    return res.status(200).json(team);
  } catch (error) {
    console.error("Erreur modification équipe :", error);
    return res.status(500).json({
      message: "Erreur lors de la modification de l'équipe.",
    });
  }
};

// ADMIN - Supprimer une équipe
export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({ message: "Équipe introuvable." });
    }

    // Ne supprime pas automatiquement le fichier Blob : il peut encore être référencé.
    await team.deleteOne();
    return res.status(200).json({
      message: "Équipe supprimée avec succès.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'équipe.",
    });
  }
};
