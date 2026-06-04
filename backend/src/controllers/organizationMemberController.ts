import { Request, Response } from "express";
import OrganizationMember from "../models/OrganizationMember";
import cloudinary from "../config/cloudinary";

const getUploadedFile = (req: Request) => {
  return (req as Request & { file?: Express.Multer.File }).file;
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
        folder: "stage-handball/organization",
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

const toBoolean = (value: unknown, defaultValue = true) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "Visible";
};

// PUBLIC - récupérer les membres actifs
export const getPublicOrganizationMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const members = await OrganizationMember.find({ isActive: true }).sort({
      group: 1,
      order: 1,
      lastName: 1,
    });

    return res.status(200).json(members);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'organigramme.",
    });
  }
};

// ADMIN - récupérer tous les membres
export const getAllOrganizationMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const members = await OrganizationMember.find().sort({
      group: 1,
      order: 1,
      lastName: 1,
    });

    return res.status(200).json(members);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des membres.",
    });
  }
};

// ADMIN - créer un membre
export const createOrganizationMember = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, role, group, email, order, isActive } =
      req.body;

    if (!firstName || !lastName || !role || !group) {
      return res.status(400).json({
        message: "Prénom, nom, fonction et groupe sont obligatoires.",
      });
    }

    const file = getUploadedFile(req);
    const photoUrl = await uploadImageToCloudinary(file);

    const member = await OrganizationMember.create({
      firstName,
      lastName,
      role,
      group,
      email: email || "",
      photo: photoUrl || "",
      order: Number(order) || 0,
      isActive: toBoolean(isActive, true),
    });

    return res.status(201).json({
      message: "Membre ajouté avec succès.",
      member,
    });
  } catch (error) {
    console.error("Erreur création membre organigramme :", error);

    return res.status(500).json({
      message: "Erreur lors de la création du membre.",
    });
  }
};

// ADMIN - modifier un membre
export const updateOrganizationMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const member = await OrganizationMember.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Membre introuvable.",
      });
    }

    const { firstName, lastName, role, group, email, order, isActive } =
      req.body;

    const file = getUploadedFile(req);
    const photoUrl = await uploadImageToCloudinary(file);

    member.firstName = firstName ?? member.firstName;
    member.lastName = lastName ?? member.lastName;
    member.role = role ?? member.role;
    member.group = group ?? member.group;
    member.email = email ?? member.email;

    if (order !== undefined) {
      member.order = Number(order) || 0;
    }

    if (isActive !== undefined) {
      member.isActive = toBoolean(isActive, member.isActive);
    }

    if (photoUrl) {
      member.photo = photoUrl;
    }

    const updatedMember = await member.save();

    return res.status(200).json({
      message: "Membre modifié avec succès.",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Erreur modification membre organigramme :", error);

    return res.status(500).json({
      message: "Erreur lors de la modification du membre.",
    });
  }
};

// ADMIN - supprimer un membre
export const deleteOrganizationMember = async (
  req: Request,
  res: Response
) => {
  try {
    const member = await OrganizationMember.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Membre introuvable.",
      });
    }

    return res.status(200).json({
      message: "Membre supprimé avec succès.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression du membre.",
    });
  }
};

// ADMIN - activer / désactiver l'affichage public
export const toggleOrganizationMemberStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const member = await OrganizationMember.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Membre introuvable.",
      });
    }

    member.isActive = !member.isActive;
    await member.save();

    return res.status(200).json({
      message: "Statut du membre modifié avec succès.",
      member,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors du changement de statut.",
    });
  }
};
