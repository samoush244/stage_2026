import { Request, Response } from "express";
import Player from "../models/Player";
import Team from "../models/Team";
import { importPlayersFromExcel } from "../utils/importPlayerFromExcel";
// IMPORT DE JOUEUR VIA EXCEL
export const importPlayersExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Aucun fichier Excel envoyé.",
      });
    }

    const result = await importPlayersFromExcel(req.file.path);

    return res.status(200).json({
      message: "Import des joueurs terminé.",
      result,
    });
  } catch (error) {
    console.error("Erreur import joueurs :", error);

    return res.status(500).json({
      message: "Erreur lors de l'import des joueurs.",
    });
  }
};
/**ADMIN CREER UN JOUEUR */
export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { licenseNumber, firstName, lastName, roles,team,birthDate,
      photo,
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
    if (req.body.licenseNumber) {
      const existingPlayer = await Player.findOne({
        licenseNumber: req.body.licenseNumber.trim(),
        _id: { $ne: id }
      });
      if (existingPlayer) {
        return res.status(400).json({
          message: "Un joueur existe déjà avec ce numéro de licence.",
        });
      }
    req.body.licenseNumber = req.body.licenseNumber.trim();
  }
  if(req.body.team){
    const existingTeam = await Team.findById(req.body.team);
    if (!existingTeam) {
      return res.status(400).json({
        message: "L'équipe introuvable.",
      });
    }
  }
    const player = await Player.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    .populate("team", "name slug level group gender")
    .populate("userAccount", "firstName lastName email roles");

    if (!player) {
      return res.status(404).json({
        message: "Joueur introuvable.",
      });
    }

    return res.status(200).json({
      message: "Joueur mis à jour avec succès.",
      player,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour du joueur.",
      error,
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
export const getPublicRosterByTeamSlug = async (req: Request, res: Response) => {
  try {
    const { teamslug } = req.params;
    const team = await Team.findOne({ slug: teamslug,isActive:true });

    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable.",
      });
    }
    if(!team.hasRosterPage){
      return res.status(403).json({
        message: "Cette équipe n'a pas de page effectif publique.",
      });
    }

    const players = await Player.find({ team: team._id, isDisplayed: true,isActive:true })
      .populate("userAccount", "firstName lastName email roles")
      .sort({ position: 1, number:1, lastName: 1, firstName: 1 });
    
      return res.status(200).json({
        team,
        players,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération de l'effectif.",
      error,
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