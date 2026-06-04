import { Request, Response } from "express";
import News from "../models/News";
import cloudinary from "../config/cloudinary";

const createSlug = (title: string) => {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || `actualite-${Date.now()}`;
};

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
        folder: "stage-handball/news",
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

const toBoolean = (value: unknown, defaultValue = false) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "Visible";
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

    const cleanTitle = typeof title === "string" ? title.trim() : "";
    const newsType = type === "external" ? "external" : "internal";

    if (!cleanTitle) {
      return res.status(400).json({
        message: "Le titre est obligatoire",
      });
    }

    if (newsType === "internal" && !content) {
      return res.status(400).json({
        message: "Le contenu est obligatoire pour une actualité interne",
      });
    }

    if (newsType === "external" && (!summary || !externalUrl || !source)) {
      return res.status(400).json({
        message:
          "La source, le résumé et le lien externe sont obligatoires pour un article externe",
      });
    }

    let slug = createSlug(cleanTitle);

    const existingNews = await News.findOne({ slug });

    if (existingNews) {
      slug = `${slug}-${Date.now()}`;
    }

    const file = getUploadedFile(req);
    const uploadedImageUrl = await uploadImageToCloudinary(file);

    const published = toBoolean(isPublished, false);

    const news = await News.create({
      title: cleanTitle,
      slug,
      image: uploadedImageUrl || image || "",
      content,
      summary,
      type: newsType,
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

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        message: "Actualité introuvable",
      });
    }

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

    if (title !== undefined) {
      const cleanTitle = typeof title === "string" ? title.trim() : "";

      if (!cleanTitle) {
        return res.status(400).json({
          message: "Le titre est obligatoire",
        });
      }

      if (cleanTitle !== news.title) {
        let slug = createSlug(cleanTitle);

        const existingNews = await News.findOne({
          slug,
          _id: { $ne: news._id },
        });

        if (existingNews) {
          slug = `${slug}-${Date.now()}`;
        }

        news.slug = slug;
      }

      news.title = cleanTitle;
    }

    const nextType = type === "external" ? "external" : "internal";

    if (type !== undefined) {
      news.type = nextType;
    }

    if (summary !== undefined) {
      news.summary = summary;
    }

    if (content !== undefined) {
      news.content = content;
    }

    if (source !== undefined) {
      news.source = source;
    }

    if (externalUrl !== undefined) {
      news.externalUrl = externalUrl;
    }

    if (publishedAt !== undefined && publishedAt !== "") {
      news.publishedAt = new Date(publishedAt);
    }

    const file = getUploadedFile(req);
    const uploadedImageUrl = await uploadImageToCloudinary(file);

    if (uploadedImageUrl) {
      news.image = uploadedImageUrl;
    } else if (image !== undefined && image !== "") {
      news.image = image;
    }

    if (isPublished !== undefined) {
      const published = toBoolean(isPublished, news.isPublished);

      news.isPublished = published;

      if (published && !news.publishedAt) {
        news.publishedAt = new Date();
      }
    }

    if (news.type === "internal" && !news.content) {
      return res.status(400).json({
        message: "Le contenu est obligatoire pour une actualité interne",
      });
    }

    if (
      news.type === "external" &&
      (!news.summary || !news.externalUrl || !news.source)
    ) {
      return res.status(400).json({
        message:
          "La source, le résumé et le lien externe sont obligatoires pour un article externe",
      });
    }

    const updatedNews = await news.save();

    res.status(200).json(updatedNews);
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
