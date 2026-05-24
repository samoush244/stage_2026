import { Request, Response } from "express";
import Partner from "../models/Partner";

export const getPartners = async (req: Request, res: Response) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des partenaires",
    });
  }
};

export const getAllPartnersAdmin = async (req: Request, res: Response) => {
  try {
    const partners = await Partner.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération admin des partenaires",
    });
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    const { name, logo, url, order, isActive } = req.body;

    if (!name || !logo || !url) {
      return res.status(400).json({
        message: "Le nom, le logo et l'URL sont obligatoires",
      });
    }

    const partner = await Partner.create({
      name,
      logo,
      url,
      order: order ?? 0,
      isActive: isActive ?? true,
    });

    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du partenaire",
    });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!partner) {
      return res.status(404).json({
        message: "Partenaire introuvable",
      });
    }

    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification du partenaire",
    });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByIdAndDelete(id);

    if (!partner) {
      return res.status(404).json({
        message: "Partenaire introuvable",
      });
    }

    res.status(200).json({
      message: "Partenaire supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du partenaire",
    });
  }
};