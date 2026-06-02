import { Request, Response } from "express";
import OrganizationMember from "../models/OrganizationMember";

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

export const getOrganizationMemberById = async (
  req: Request,
  res: Response
) => {
  try {
    const member = await OrganizationMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Membre introuvable.",
      });
    }

    return res.status(200).json(member);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération du membre.",
    });
  }
};

export const createOrganizationMember = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      firstName,
      lastName,
      role,
      group,
      email,
      photo,
      order,
      isActive,
    } = req.body;

    if (!firstName || !lastName || !role || !group) {
      return res.status(400).json({
        message: "Le prénom, le nom, la fonction et le groupe sont obligatoires.",
      });
    }

    if (!["bureau", "ca"].includes(group)) {
      return res.status(400).json({
        message: "Le groupe doit être 'bureau' ou 'ca'.",
      });
    }

    const member = await OrganizationMember.create({
      firstName,
      lastName,
      role,
      group,
      email,
      photo,
      order,
      isActive,
    });

    return res.status(201).json({
      message: "Membre ajouté à l'organigramme avec succès.",
      member,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la création du membre.",
    });
  }
};

export const updateOrganizationMember = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      firstName,
      lastName,
      role,
      group,
      email,
      photo,
      order,
      isActive,
    } = req.body;

    if (group && !["bureau", "ca"].includes(group)) {
      return res.status(400).json({
        message: "Le groupe doit être 'bureau' ou 'ca'.",
      });
    }

    const member = await OrganizationMember.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        role,
        group,
        email,
        photo,
        order,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        message: "Membre introuvable.",
      });
    }

    return res.status(200).json({
      message: "Membre modifié avec succès.",
      member,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la modification du membre.",
    });
  }
};

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