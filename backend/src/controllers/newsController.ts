import { Request, Response } from "express";
import News from "../models/News";

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const getPublishedNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find({ isPublished: true }).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des actualités",
    });
  }
};

export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const news = await News.findOne({
      slug,
      isPublished: true,
    });

    if (!news) {
      return res.status(404).json({
        message: "Actualité introuvable",
      });
    }

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'actualité",
    });
  }
};

export const getAllNewsAdmin = async (req: Request, res: Response) => {
  try {
    const news = await News.find().sort({
      createdAt: -1,
    });

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération admin des actualités",
    });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const {
      title,
      image,
      content,
      summary,
      type,
      source,
      externalUrl,
      publishedAt,
      isPublished,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Le titre est obligatoire",
      });
    }

    if (type === "internal" && !content) {
      return res.status(400).json({
        message: "Le contenu est obligatoire pour une actualité interne",
      });
    }

    if (type === "external" && (!summary || !externalUrl || !source)) {
      return res.status(400).json({
        message:
          "La source, le résumé et le lien externe sont obligatoires pour un article externe",
      });
    }

    let slug = createSlug(title);

    const existingNews = await News.findOne({ slug });

    if (existingNews) {
      slug = `${slug}-${Date.now()}`;
    }

    const published = isPublished === true || isPublished === "true";

    const imagePath = req.file
      ? `/uploads/news/${req.file.filename}`
      : image || "";

    const news = await News.create({
      title,
      slug,
      image: imagePath,
      content,
      summary,
      type: type || "internal",
      source,
      externalUrl,
      publishedAt: published ? publishedAt || new Date() : undefined,
      isPublished: published,
    });

    res.status(201).json(news);
  } catch (error) {
    console.error("Erreur createNews :", error);

    res.status(500).json({
      message: "Erreur lors de la création de l'actualité",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updateData: any = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/news/${req.file.filename}`;
    }

    if (req.body.title) {
      updateData.slug = createSlug(req.body.title);

      const existingNews = await News.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });

      if (existingNews) {
        updateData.slug = `${updateData.slug}-${Date.now()}`;
      }
    }

    if (req.body.isPublished !== undefined) {
      updateData.isPublished =
        req.body.isPublished === true || req.body.isPublished === "true";
    }

    if (updateData.isPublished === true && !req.body.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const news = await News.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!news) {
      return res.status(404).json({
        message: "Actualité introuvable",
      });
    }

    res.status(200).json(news);
  } catch (error) {
    console.error("Erreur updateNews :", error);

    res.status(500).json({
      message: "Erreur lors de la modification de l'actualité",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        message: "Actualité introuvable",
      });
    }

    res.status(200).json({
      message: "Actualité supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'actualité",
    });
  }
};

export const togglePublishNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        message: "Actualité introuvable",
      });
    }

    news.isPublished = !news.isPublished;

    if (news.isPublished && !news.publishedAt) {
      news.publishedAt = new Date();
    }

    await news.save();

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du changement de statut de publication",
    });
  }
};