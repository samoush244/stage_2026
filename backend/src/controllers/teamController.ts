import { Request, Response } from "express";
import Team from "../models/Team";

const createSlug = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const getPublicTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find({ isActive: true }).sort({
      group: 1,
      order: 1,
      name: 1,
    });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des équipes",
    });
  }
};

export const getTeamBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const team = await Team.findOne({
      slug,
      isActive: true,
    });

    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable",
      });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'équipe",
    });
  }
};

export const getAllTeamsAdmin = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().sort({
      group: 1,
      order: 1,
      name: 1,
    });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération admin des équipes",
    });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      group,
      gender,
      level,
      season,
      image,
      description,
      ffhandballUrl,
      scorencoUrl,
      hasRosterPage,
      hasResultsPage,
      order,
      isActive,
    } = req.body;

    if (!name || !group) {
      return res.status(400).json({
        message: "Le nom et le groupe de l'équipe sont obligatoires",
      });
    }

    const finalSlug = slug ? createSlug(slug) : createSlug(name);

    const existingTeam = await Team.findOne({ slug: finalSlug });

    if (existingTeam) {
      return res.status(400).json({
        message: "Une équipe existe déjà avec ce slug",
      });
    }

    const team = await Team.create({
      name,
      slug: finalSlug,
      group,
      gender,
      level,
      season,
      image,
      description,
      ffhandballUrl,
      scorencoUrl,
      hasRosterPage: hasRosterPage ?? false,
      hasResultsPage: hasResultsPage ?? false,
      order: order ?? 0,
      isActive: isActive ?? true,
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'équipe",
    });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    if (req.body.slug) {
      updateData.slug = createSlug(req.body.slug);

      const existingTeam = await Team.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });

      if (existingTeam) {
        return res.status(400).json({
          message: "Une autre équipe utilise déjà ce slug",
        });
      }
    }

    const team = await Team.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable",
      });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification de l'équipe",
    });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable",
      });
    }

    res.status(200).json({
      message: "Équipe supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'équipe",
    });
  }
};

export const toggleTeamStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable",
      });
    }

    team.isActive = !team.isActive;
    await team.save();

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du changement de statut de l'équipe",
    });
  }
};