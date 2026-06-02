import { Request, Response } from "express";
import Player from "../models/Player";
import Team from "../models/Team";
import { importPlayersFromExcel } from "../utils/importPlayerFromExcel";


const normalizeText = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const findTeamByExcelName = async (excelTeamName: string) => {
  const cleanExcelTeamName = normalizeText(excelTeamName);

  const teams = await Team.find().lean();

  const team = teams.find((team) => {
    const teamName = normalizeText(team.name || "");
    const teamSlug = normalizeText(team.slug || "");

    return (
      teamName === cleanExcelTeamName ||
      teamSlug === cleanExcelTeamName ||
      teamName.includes(cleanExcelTeamName) ||
      cleanExcelTeamName.includes(teamName)
    );
  });

  return team || null;
};

// IMPORT DE JOUEUR VIA EXCEL
export const importPlayersExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Aucun fichier Excel reçu.",
      });
    }

    // req.file.buffer is a Buffer; importPlayersFromExcel expects a string (e.g., file path
    // or string content). Cast to unknown->string to satisfy TypeScript here. If the
    // util requires a path, consider saving the buffer to a temp file and passing its path.
    const result = await importPlayersFromExcel(req.file.buffer);

    return res.status(200).json({
      message: "Import Excel terminé avec succès.",
      ...result,
    });
  } catch (error: any) {
    console.error("Erreur import joueurs :", error);

    return res.status(500).json({
      message: "Erreur lors de l'import des joueurs.",
      error: error.message,
    });
  }
};
/**ADMIN CREER UN JOUEUR */
export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { licenseNumber, firstName, lastName, roles, team, teamName, birthDate,
      photo: bodyPhoto,
      number,
      position,
      isDisplayed,
      isActive,} = req.body;

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
    // chemin pour avoir la photo 
    const photo = req.file ? `/uploads/players/${req.file.filename}` : bodyPhoto;
    
    const player = await Player.create({
      licenseNumber,
      firstName,
      lastName,
      roles: roles && roles.length > 0 ? roles : ["joueur"],
      team,
      birthDate,
      photo,
      number,
      position,
      isDisplayed: isDisplayed ?? true,
      isActive: isActive ?? true,
    });

    const populatedPlayer = await Player.findById(player._id)
      .populate("team", "name slug level group gender")
      .populate("userAccount", "firstName lastName email roles");
    
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
    const players = await Player.find()
    .populate("team", "name slug level group gender")
    .populate("userAccount", "firstName lastName email roles")
    .sort({ lastName: 1, firstName: 1 });

    return res.json(players);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des joueurs.",
      error,
    });
  }
};

/**ADMIN MODIFIER UN JOUEUR */
export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updateData: any = {
      ...req.body,
    };

    if (req.body.birthDate) {
      updateData.birthDate = new Date(req.body.birthDate);
    }

    if (req.file) {
      updateData.photo = `/uploads/players/${req.file.filename}`;
    }

    delete updateData.team;

    const player = await Player.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!player) {
      return res.status(404).json({
        message: "Joueur introuvable.",
      });
    }

    return res.status(200).json(player);
  } catch (error: any) {
    console.error("Erreur updatePlayer :", error);

    return res.status(500).json({
      message: "Erreur lors de la modification du joueur.",
      error: error.message,
    });
  }
};
/** ADMIN -AFFICHER OU CACHER UN JOUEUR */
export const togglePlayerDisplay = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        message: "Joueur introuvable.",
      });
    }

    player.isDisplayed = !player.isDisplayed;
    await player.save();

    return res.status(200).json({
      message: player.isDisplayed ? "Joueur affiché." : "Joueur caché.",
      player,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la modification de l'affichage du joueur.",
      error,
    });
  }
};
/** ADMIN- ACTiver ou desactiver un joueur */
export const togglePlayerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        message: "Joueur introuvable.",
      });
    }
    
    player.isActive = !player.isActive;

    if (!player.isActive) {
      player.isDisplayed = false;
    }

    await player.save();
    return res.status(200).json({
      message: player.isActive ? "Joueur activé." : "Joueur désactivé.",
      player,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la modification du statut du joueur.",
      error,
    });
  }
};
/** ADMIN- SUPPRIMER UN JOUEUR */
export const deletePlayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const player = await Player.findByIdAndDelete(id);

    if (!player) {
      return res.status(404).json({
        message: "Joueur introuvable.",
      });
    }

    return res.status(200).json({
      message: "Joueur supprimé avec succès.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la suppression du joueur.",
      error,
    });
  }
};
/** PUBLIC RECUPERE L'EFFECTIF AFFFICHE D'UNE EQUIPE */
const calculateAge = (birthDate?: Date | string | null) => {
  if (!birthDate) return null;

  const date = new Date(birthDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < date.getDate())
  ) {
    age--;
  }

  return age;
};

const buildImageUrl = (req: Request, imagePath?: string | null) => {
  if (!imagePath) return null;

  const cleanPath = imagePath.replace(/\\/g, "/");

  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  if (cleanPath.startsWith("/")) {
    return `${req.protocol}://${req.get("host")}${cleanPath}`;
  }

  return `${req.protocol}://${req.get("host")}/uploads/players/${cleanPath}`;
};

export const getPublicRosterByTeamSlug = async (req:Request, res:Response) => {
  try {
    const { teamSlug } = req.params;

    console.log("SLUG REÇU :", teamSlug);

    const team = await Team.findOne({ slug: teamSlug });

    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable",
      });
    }

    const players = await Player.find({
      team: team._id,
      isActive: true,
      isDisplayed: true,
    }).sort({
      position: 1,
      lastName: 1,
      firstName: 1,
    });

    return res.status(200).json({
      team,
      players,
    });
  } catch (err) {
    console.error("Erreur récupération effectif public :", err);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

export const getPlayerById = async (req: Request, res: Response) => {
  try {
    const player= await Player.findById(req.params.id).populate("team");
    if (!player) {
      return res.status(404).json({
        message: "Joueur introuvable.",
      });
    }
    return res.status(200).json(player);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération du joueur.",
      error,
    });
  }
};

export const getPlayersByTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    
    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable.",
      });
    }

    const players = await Player.find({ team: teamId,active:true })
      .populate("team")
      .sort({ position: 1, number:1, lastName: 1, firstName: 1 });

    return res.status(200).json(players);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des joueurs par équipe.",
      error,
    });
  }
};

export const getPublicPlayersByTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    
    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable.",
      });
    }
    const players = await Player.find({ team: teamId, isDisplayed: true,isActive:true })
      .populate("team")
      .sort({ position: 1, number:1, lastName: 1 });

      return res.status(200).json({
        team,
        players,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des joueurs publics par équipe.",
      error,
    });
  }
};