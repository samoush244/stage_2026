import { Request, Response } from "express";
import mongoose from "mongoose";
import Player, { type MemberType, type PlayerRole } from "../models/Player";
import Team from "../models/Team";
import { importPlayersFromExcel } from "../utils/importPlayerFromExcel";
import cloudinary from "../config/cloudinary";

const cleanOptionalString = (value: unknown) => {
  if (value === undefined || value === null) return "";

  return String(value).trim();
};

const normalizeMemberType = (value: unknown): MemberType => {
  return value === "staff" ? "staff" : "player";
};

const generateStaffLicenseNumber = () => {
  return `STAFF-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

const parseBoolean = (value: unknown, defaultValue: boolean) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return defaultValue;
};

const parseNumber = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return undefined;
  }

  return number;
};

const parseRoles = (
  roles: unknown,
  defaultRoles: PlayerRole[]
): PlayerRole[] => {
  const allowedRoles: PlayerRole[] = ["coach", "joueur", "membre"];

  if (!roles) {
    return defaultRoles;
  }

  let values: string[] = [];

  if (Array.isArray(roles)) {
    values = roles.map(String);
  } else if (typeof roles === "string") {
    try {
      const parsed = JSON.parse(roles);

      if (Array.isArray(parsed)) {
        values = parsed.map(String);
      } else {
        values = roles.split(",");
      }
    } catch {
      values = roles.split(",");
    }
  }

  const cleanRoles = values
    .map((role) => role.trim())
    .filter((role): role is PlayerRole =>
      allowedRoles.includes(role as PlayerRole)
    );

  return cleanRoles.length > 0 ? cleanRoles : defaultRoles;
};

const resolveTeamId = async (team?: unknown, teamName?: unknown) => {
  const cleanTeam = cleanOptionalString(team);

  if (cleanTeam) {
    return cleanTeam;
  }

  const cleanTeamName = cleanOptionalString(teamName);

  if (!cleanTeamName) {
    return undefined;
  }

  const foundTeam = await findTeamByExcelName(cleanTeamName);

  return foundTeam?._id;
};

const findTeamBySlugOrId = async (identifier: string) => {
  if (mongoose.isValidObjectId(identifier)) {
    const teamById = await Team.findById(identifier);

    if (teamById) {
      return teamById;
    }
  }

  return Team.findOne({ slug: identifier });
};



const uploadImageToCloudinary = async (
  file?: Express.Multer.File
): Promise<string | undefined> => {
  if (!file) {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "stage-handball/players",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result?.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

const buildUploadUrl = (
  req: Request,
  imagePath?: string | null,
  folder = "players"
) => {
  if (!imagePath) return null;

  const cleanPath = imagePath.replace(/\\/g, "/");

  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  if (cleanPath.startsWith("/")) {
    return `${req.protocol}://${req.get("host")}${cleanPath}`;
  }

  return `${req.protocol}://${req.get("host")}/uploads/${folder}/${cleanPath}`;
};

const formatPublicMember = (req: Request, member: any) => {
  return {
    ...member,
    age: calculateAge(member.birthDate),
    photoUrl: buildUploadUrl(req, member.photo, "players"),
  };
};

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
    const {
      licenseNumber,
      memberType,
      firstName,
      lastName,
      roles,
      team,
      teamName,
      birthDate,
      photo: bodyPhoto,
      number,
      position,
      displayOrder,
      isDisplayed,
      isActive,
      isFeaturedTeamPlayer,
    } = req.body;

    const finalMemberType = normalizeMemberType(memberType);

    const cleanFirstName = cleanOptionalString(firstName);
    const cleanLastName = cleanOptionalString(lastName);
    let cleanLicenseNumber = cleanOptionalString(licenseNumber);

    if (!cleanFirstName || !cleanLastName) {
      return res.status(400).json({
        message: "Le nom et le prénom sont obligatoires.",
      });
    }

    if (finalMemberType === "player" && !cleanLicenseNumber) {
      return res.status(400).json({
        message: "Le numéro de licence est obligatoire pour un joueur.",
      });
    }

    if (finalMemberType === "staff" && !cleanLicenseNumber) {
      cleanLicenseNumber = generateStaffLicenseNumber();
    }

    const existingPlayer = await Player.findOne({
      licenseNumber: cleanLicenseNumber,
    });

    if (existingPlayer) {
      return res.status(400).json({
        message: "Un membre existe déjà avec ce numéro de licence.",
      });
    }

    const uploadedPhoto = await uploadImageToCloudinary(req.file);
    const photo = uploadedPhoto || bodyPhoto || "";

    const resolvedTeamId = await resolveTeamId(team, teamName);

    const defaultRoles: PlayerRole[] =
      finalMemberType === "staff" ? ["membre"] : ["joueur"];

    const player = await Player.create({
      licenseNumber: cleanLicenseNumber,
      memberType: finalMemberType,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      roles: parseRoles(roles, defaultRoles),
      team: resolvedTeamId,
      birthDate: birthDate || undefined,
      photo,
      number: parseNumber(number),
      position: cleanOptionalString(position),
      displayOrder: parseNumber(displayOrder) ?? 0,
      isDisplayed: parseBoolean(isDisplayed, true),
      isActive: parseBoolean(isActive, true),
      isFeaturedTeamPlayer: parseBoolean(isFeaturedTeamPlayer, false),
    });

    const populatedPlayer = await Player.findById(player._id)
      .populate("team", "name slug level group gender")
      .populate("userAccount", "firstName lastName email roles");

    return res.status(201).json({
      message:
        finalMemberType === "staff"
          ? "Membre du staff créé avec succès."
          : "Joueur créé avec succès.",
      player: populatedPlayer,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la création du membre.",
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

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        message: "Membre introuvable.",
      });
    }

    const {
      licenseNumber,
      memberType,
      firstName,
      lastName,
      roles,
      team,
      teamName,
      birthDate,
      photo: bodyPhoto,
      number,
      position,
      displayOrder,
      isDisplayed,
      isActive,
      isFeaturedTeamPlayer,
    } = req.body;

    const finalMemberType = normalizeMemberType(memberType ?? player.memberType);

    let finalLicenseNumber = player.licenseNumber;

    if (licenseNumber !== undefined) {
      const cleanLicenseNumber = cleanOptionalString(licenseNumber);

      if (cleanLicenseNumber) {
        finalLicenseNumber = cleanLicenseNumber;
      } else if (finalMemberType === "staff") {
        finalLicenseNumber = player.licenseNumber || generateStaffLicenseNumber();
      } else {
        return res.status(400).json({
          message: "Le numéro de licence est obligatoire pour un joueur.",
        });
      }
    }

    if (finalMemberType === "player" && !finalLicenseNumber) {
      return res.status(400).json({
        message: "Le numéro de licence est obligatoire pour un joueur.",
      });
    }

    if (finalLicenseNumber !== player.licenseNumber) {
      const existingPlayer = await Player.findOne({
        _id: { $ne: id },
        licenseNumber: finalLicenseNumber,
      });

      if (existingPlayer) {
        return res.status(400).json({
          message: "Un membre existe déjà avec ce numéro de licence.",
        });
      }
    }

    const updateData: any = {
      memberType: finalMemberType,
      licenseNumber: finalLicenseNumber,
    };

    if (firstName !== undefined) {
      updateData.firstName = cleanOptionalString(firstName);
    }

    if (lastName !== undefined) {
      updateData.lastName = cleanOptionalString(lastName);
    }

    if (roles !== undefined) {
      const defaultRoles: PlayerRole[] =
        finalMemberType === "staff" ? ["membre"] : ["joueur"];

      updateData.roles = parseRoles(roles, defaultRoles);
    }

    if (team !== undefined || teamName !== undefined) {
      const resolvedTeamId = await resolveTeamId(team, teamName);
      updateData.team = resolvedTeamId || null;
    }

    if (birthDate !== undefined) {
      updateData.birthDate = birthDate ? new Date(birthDate) : undefined;
    }

    if (bodyPhoto !== undefined) {
      updateData.photo = bodyPhoto;
    }

    if (req.file) {
      const uploadedPhoto = await uploadImageToCloudinary(req.file);

      if (uploadedPhoto) {
        updateData.photo = uploadedPhoto;
      }
    }

    if (number !== undefined) {
      updateData.number = parseNumber(number);
    }

    if (position !== undefined) {
      updateData.position = cleanOptionalString(position);
    }

    if (displayOrder !== undefined) {
      updateData.displayOrder = parseNumber(displayOrder) ?? 0;
    }

    if (isDisplayed !== undefined) {
      updateData.isDisplayed = parseBoolean(isDisplayed, true);
    }

    if (isActive !== undefined) {
      updateData.isActive = parseBoolean(isActive, true);
    }

    if (isFeaturedTeamPlayer !== undefined) {
      updateData.isFeaturedTeamPlayer = parseBoolean(
        isFeaturedTeamPlayer,
        false
      );
    }

    const updatedPlayer = await Player.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("team", "name slug level group gender")
      .populate("userAccount", "firstName lastName email roles");

    return res.status(200).json(updatedPlayer);
  } catch (error: any) {
    console.error("Erreur updatePlayer :", error);

    return res.status(500).json({
      message: "Erreur lors de la modification du membre.",
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

export const getPublicRosterByTeamSlug = async (
  req: Request,
  res: Response
) => {
  try {
    const { teamSlug } = req.params;

    const team = await Team.findOne({
      slug: teamSlug,
      isActive: true,
    });

    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable.",
      });
    }

    const members = await Player.find({
      team: team._id,
      isActive: true,
      isDisplayed: true,
    })
      .sort({
        memberType: 1,
        displayOrder: 1,
        position: 1,
        number: 1,
        lastName: 1,
        firstName: 1,
      })
      .lean();

    const formattedMembers = members.map((member) =>
      formatPublicMember(req, member)
    );

    const players = formattedMembers.filter(
      (member) => member.memberType !== "staff"
    );

    const staff = formattedMembers.filter(
      (member) => member.memberType === "staff"
    );

    const teamObject = team.toObject() as any;

    return res.status(200).json({
      team: {
        ...teamObject,
        imageUrl: buildUploadUrl(req, teamObject.image, "teams"),
      },
      players,
      staff,
    });
  } catch (err) {
    console.error("Erreur récupération effectif public :", err);

    return res.status(500).json({
      message: "Erreur serveur lors de la récupération de l'effectif.",
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

    const players = await Player.find({ team: teamId,isActive:true })
      .populate("team")
      .sort({  memberType: 1,
        displayOrder: 1,
        position: 1,
        number: 1,
        lastName: 1,
        firstName: 1,});

    return res.status(200).json(players);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des joueurs par équipe.",
      error,
    });
  }
};

export const getPublicPlayersByTeam = async (
  req: Request,
  res: Response
) => {
  try {
    const rawTeamIdentifier = req.params.teamSlug || req.params.teamId;

    const teamIdentifier = Array.isArray(rawTeamIdentifier)
      ? rawTeamIdentifier[0]
      : rawTeamIdentifier;

    if (!teamIdentifier) {
      return res.status(400).json({   
        message: "Identifiant d'équipe manquant.",
      });
    }

    const team = await findTeamBySlugOrId(teamIdentifier);

    if (!team) {
      return res.status(404).json({
        message: "Équipe introuvable.",
      });
    }

    const members = await Player.find({
      team: team._id,
      isDisplayed: true,
      isActive: true,
    })
      .populate("team")
      .sort({
        memberType: 1,
        displayOrder: 1,
        position: 1,
        number: 1,
        lastName: 1,
        firstName: 1,
      })
      .lean();

    const formattedMembers = members.map((member) =>
      formatPublicMember(req, member)
    );

    const players = formattedMembers.filter(
      (member) => member.memberType !== "staff"
    );

    const staff = formattedMembers.filter(
      (member) => member.memberType === "staff"
    );

    return res.status(200).json({
      team,
      players,
      staff,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des joueurs publics par équipe.",
      error,
    });
  }
};