
import { Request, Response } from "express";
import EngagementPage from "../models/EngagementPage";
import cloudinary from "../config/cloudinary";

const DEFAULT_INTRO_TEXT =
  "Grâce au soutien de notre partenaire, le Valenciennes Handball Club met en place des actions durables et citoyennes tout au long de l’année. Ensemble, nous réalisons des activités de sensibilisation, de solidarité et de protection de l’environnement afin de transmettre aux jeunes licenciés les valeurs de respect, d’engagement et de responsabilité.";

const getUploadedFile = (req: Request) => {
  return (req as Request & { file?: Express.Multer.File }).file;
};

const toBoolean = (value: unknown, defaultValue = true) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalizedValue = String(value).trim().toLowerCase();

  return (
    normalizedValue === "true" ||
    normalizedValue === "1" ||
    normalizedValue === "visible" ||
    normalizedValue === "on" ||
    normalizedValue === "oui"
  );
};

const toNumber = (value: unknown, defaultValue = 0) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? defaultValue : numberValue;
};

const parseDate = (value: unknown) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

const uploadImageToCloudinary = async (
  file: Express.Multer.File | undefined,
  folder: string
): Promise<string | undefined> => {
  if (!file) {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
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

const getOrCreateEngagementPage = async () => {
  let engagementPage = await EngagementPage.findOne();

  if (!engagementPage) {
    engagementPage = await EngagementPage.create({
      introText: DEFAULT_INTRO_TEXT,
      labels: [],
      gallery: [],
    });
  }

  return engagementPage;
};

/* -------------------- PAGE PUBLIQUE -------------------- */

export const getPublicEngagementPage = async (
  _req: Request,
  res: Response
) => {
  try {
    const engagementPage = await getOrCreateEngagementPage();

    const activeLabels = (engagementPage.labels as any[])
      .filter((label) => label.isActive !== false)
      .sort((a, b) => a.order - b.order);

    const activeGallery = (engagementPage.gallery as any[])
      .filter((item) => item.isActive !== false)
      .sort((a, b) => a.order - b.order);

    return res.status(200).json({
      partnerName: engagementPage.partnerName,
      partnerLogo: engagementPage.partnerLogo,
      partnerWebsite: engagementPage.partnerWebsite,
      introText: engagementPage.introText,
      labels: activeLabels,
      gallery: activeGallery,
    });
  } catch (error) {
    console.error("Erreur récupération page engagement :", error);

    return res.status(500).json({
      message:
        "Erreur lors de la récupération de la page engagement durable et citoyen.",
    });
  }
};

/* -------------------- ADMIN : PAGE PRINCIPALE -------------------- */

export const getEngagementPageAdmin = async (
  _req: Request,
  res: Response
) => {
  try {
    const engagementPage = await getOrCreateEngagementPage();

    return res.status(200).json(engagementPage);
  } catch (error) {
    console.error("Erreur récupération admin engagement :", error);

    return res.status(500).json({
      message: "Erreur lors de la récupération des données administrateur.",
    });
  }
};

export const updateEngagementSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const { partnerName, partnerWebsite, introText } = req.body;

    const engagementPage = await getOrCreateEngagementPage();

    if (partnerName !== undefined) {
      engagementPage.partnerName = String(partnerName).trim();
    }

    if (partnerWebsite !== undefined) {
      engagementPage.partnerWebsite = String(partnerWebsite).trim();
    }

    if (introText !== undefined) {
      engagementPage.introText = String(introText).trim();
    }

    const file = getUploadedFile(req);

    const partnerLogoUrl = await uploadImageToCloudinary(
      file,
      "stage-handball/engagement/partner"
    );

    if (partnerLogoUrl) {
      engagementPage.partnerLogo = partnerLogoUrl;
    }

    await engagementPage.save();

    return res.status(200).json({
      message: "Informations de la page mises à jour.",
      engagementPage,
    });
  } catch (error) {
    console.error("Erreur modification paramètres engagement :", error);

    return res.status(500).json({
      message: "Erreur lors de la modification des informations.",
    });
  }
};

/* -------------------- ADMIN : LABELS -------------------- */

export const createEngagementLabel = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description, year, order, isActive } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        message: "Le nom du label est obligatoire.",
      });
    }

    const file = getUploadedFile(req);

    if (!file) {
      return res.status(400).json({
        message: "Le logo du label est obligatoire.",
      });
    }

    const logoUrl = await uploadImageToCloudinary(
      file,
      "stage-handball/engagement/labels"
    );

    if (!logoUrl) {
      return res.status(400).json({
        message: "Erreur lors de l'envoi du logo.",
      });
    }

    const engagementPage = await getOrCreateEngagementPage();

    const labels = engagementPage.labels as any[];

    labels.push({
      name: String(name).trim(),
      logo: logoUrl,
      description: description ? String(description).trim() : "",
      year: year ? String(year).trim() : "",
      order: toNumber(order, labels.length),
      isActive: toBoolean(isActive, true),
    });

    engagementPage.markModified("labels");
    await engagementPage.save();

    return res.status(201).json({
      message: "Label ajouté avec succès.",
      label: labels[labels.length - 1],
    });
  } catch (error) {
    console.error("Erreur création label engagement :", error);

    return res.status(500).json({
      message: "Erreur lors de l'ajout du label.",
    });
  }
};

export const updateEngagementLabel = async (
  req: Request,
  res: Response
) => {
  try {
    const { labelId } = req.params;
    const { name, description, year, order, isActive } = req.body;

    const engagementPage = await getOrCreateEngagementPage();

    const labels = engagementPage.labels as any[];

    const label = labels.find(
      (item) => String(item._id) === String(labelId)
    );

    if (!label) {
      return res.status(404).json({
        message: "Label introuvable.",
      });
    }

    if (name !== undefined) {
      label.name = String(name).trim();
    }

    if (description !== undefined) {
      label.description = String(description).trim();
    }

    if (year !== undefined) {
      label.year = String(year).trim();
    }

    if (order !== undefined && order !== "") {
      label.order = toNumber(order, 0);
    }

    if (isActive !== undefined) {
      label.isActive = toBoolean(isActive, true);
    }

    const file = getUploadedFile(req);

    const logoUrl = await uploadImageToCloudinary(
      file,
      "stage-handball/engagement/labels"
    );

    if (logoUrl) {
      label.logo = logoUrl;
    }

    engagementPage.markModified("labels");
    await engagementPage.save();

    return res.status(200).json({
      message: "Label modifié avec succès.",
      label,
    });
  } catch (error) {
    console.error("Erreur modification label engagement :", error);

    return res.status(500).json({
      message: "Erreur lors de la modification du label.",
    });
  }
};

export const deleteEngagementLabel = async (
  req: Request,
  res: Response
) => {
  try {
    const { labelId } = req.params;

    const engagementPage = await getOrCreateEngagementPage();

    const labels = engagementPage.labels as any[];

    const labelExists = labels.some(
      (item) => String(item._id) === String(labelId)
    );

    if (!labelExists) {
      return res.status(404).json({
        message: "Label introuvable.",
      });
    }

    engagementPage.labels = labels.filter(
      (item) => String(item._id) !== String(labelId)
    ) as any;

    engagementPage.markModified("labels");
    await engagementPage.save();

    return res.status(200).json({
      message: "Label supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression label engagement :", error);

    return res.status(500).json({
      message: "Erreur lors de la suppression du label.",
    });
  }
};

/* -------------------- ADMIN : GALERIE -------------------- */

export const createEngagementGalleryItem = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description, actionDate, order, isActive } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        message: "Le titre de la photo est obligatoire.",
      });
    }

    if (!description || !String(description).trim()) {
      return res.status(400).json({
        message: "La description de la photo est obligatoire.",
      });
    }

    const file = getUploadedFile(req);

    if (!file) {
      return res.status(400).json({
        message: "Une image est obligatoire.",
      });
    }

    const imageUrl = await uploadImageToCloudinary(
      file,
      "stage-handball/engagement/gallery"
    );

    if (!imageUrl) {
      return res.status(400).json({
        message: "Erreur lors de l'envoi de l'image.",
      });
    }

    const engagementPage = await getOrCreateEngagementPage();

    const gallery = engagementPage.gallery as any[];

    gallery.push({
      image: imageUrl,
      title: String(title).trim(),
      description: String(description).trim(),
      actionDate: parseDate(actionDate),
      order: toNumber(order, gallery.length),
      isActive: toBoolean(isActive, true),
    });

    engagementPage.markModified("gallery");
    await engagementPage.save();

    return res.status(201).json({
      message: "Photo ajoutée à la galerie.",
      galleryItem: gallery[gallery.length - 1],
    });
  } catch (error) {
    console.error("Erreur ajout photo galerie engagement :", error);

    return res.status(500).json({
      message: "Erreur lors de l'ajout de la photo.",
    });
  }
};

export const updateEngagementGalleryItem = async (
  req: Request,
  res: Response
) => {
  try {
    const { galleryId } = req.params;
    const { title, description, actionDate, order, isActive } = req.body;

    const engagementPage = await getOrCreateEngagementPage();

    const gallery = engagementPage.gallery as any[];

    const galleryItem = gallery.find(
      (item) => String(item._id) === String(galleryId)
    );

    if (!galleryItem) {
      return res.status(404).json({
        message: "Photo introuvable.",
      });
    }

    if (title !== undefined) {
      galleryItem.title = String(title).trim();
    }

    if (description !== undefined) {
      galleryItem.description = String(description).trim();
    }

    if (actionDate !== undefined) {
      galleryItem.actionDate = parseDate(actionDate);
    }

    if (order !== undefined && order !== "") {
      galleryItem.order = toNumber(order, 0);
    }

    if (isActive !== undefined) {
      galleryItem.isActive = toBoolean(isActive, true);
    }

    const file = getUploadedFile(req);

    const imageUrl = await uploadImageToCloudinary(
      file,
      "stage-handball/engagement/gallery"
    );

    if (imageUrl) {
      galleryItem.image = imageUrl;
    }

    engagementPage.markModified("gallery");
    await engagementPage.save();

    return res.status(200).json({
      message: "Photo modifiée avec succès.",
      galleryItem,
    });
  } catch (error) {
    console.error("Erreur modification photo galerie engagement :", error);

    return res.status(500).json({
      message: "Erreur lors de la modification de la photo.",
    });
  }
};

export const deleteEngagementGalleryItem = async (
  req: Request,
  res: Response
) => {
  try {
    const { galleryId } = req.params;

    const engagementPage = await getOrCreateEngagementPage();

    const gallery = engagementPage.gallery as any[];

    const galleryItemExists = gallery.some(
      (item) => String(item._id) === String(galleryId)
    );

    if (!galleryItemExists) {
      return res.status(404).json({
        message: "Photo introuvable.",
      });
    }

    engagementPage.gallery = gallery.filter(
      (item) => String(item._id) !== String(galleryId)
    ) as any;

    engagementPage.markModified("gallery");
    await engagementPage.save();

    return res.status(200).json({
      message: "Photo supprimée avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression photo galerie engagement :", error);

    return res.status(500).json({
      message: "Erreur lors de la suppression de la photo.",
    });
  }
};

