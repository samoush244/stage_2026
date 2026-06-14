import { Request, Response } from "express";
import Event from "../models/Event";
import cloudinary from "../config/cloudinary";

const cleanString = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const eventTypes = ["Match", "Tournoi", "Stage", "Soirée club", "Autre"] as const;

type EventType = (typeof eventTypes)[number];

const cleanEventType = (value: unknown): EventType | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const cleaned = value.trim();
  return eventTypes.includes(cleaned as EventType)
    ? (cleaned as EventType)
    : undefined;
};

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const generateUniqueSlug = async (title: string, ignoredEventId?: string) => {
  let baseSlug = createSlug(title);

  if (!baseSlug) {
    baseSlug = `evenement-${Date.now()}`;
  }

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query: any = { slug };

    if (ignoredEventId) {
      query._id = { $ne: ignoredEventId };
    }

    const existingEvent = await Event.findOne(query).select("_id");

    if (!existingEvent) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;
    count++;
  }
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
        folder: "stage-handball/events",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Aucune URL Cloudinary retournée."));
          return;
        }

        resolve(result.secure_url);
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

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (["true", "1", "yes", "oui", "on", "visible"].includes(normalizedValue)) {
      return true;
    }

    if (
      ["false", "0", "no", "non", "off", "hidden", "non visible"].includes(
        normalizedValue
      )
    ) {
      return false;
    }
  }

  return defaultValue;
};

// PUBLIC — récupérer les événements publiés
export const getPublicEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ isPublished: true }).sort({
      date: 1,
      createdAt: -1,
    });

    res.status(200).json(events);
  } catch (error: any) {
    console.error("Erreur récupération événements publics :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération des événements.",
      error: error.message,
    });
  }
};

// PUBLIC — récupérer un événement par slug
export const getPublicEventBySlug = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!event) {
      return res.status(404).json({
        message: "Événement introuvable.",
      });
    }

    res.status(200).json(event);
  } catch (error: any) {
    console.error("Erreur récupération événement par slug :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération de l’événement.",
      error: error.message,
    });
  }
};

// ADMIN — récupérer tous les événements
export const getAllEventsAdmin = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({
      date: 1,
      createdAt: -1,
    });

    res.status(200).json(events);
  } catch (error: any) {
    console.error("Erreur récupération événements admin :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération des événements admin.",
      error: error.message,
    });
  }
};

// ADMIN — créer un événement
export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      title,
      type,
      description,
      date,
      time,
      location,
      ticketUrl,
      ticketLabel,
      isTicketingEnabled,
      isPublished,
    } = req.body;

    const cleanTitle = cleanString(title);
    const cleanDescription = cleanString(description);
    const cleanDate = cleanString(date);
    const cleanType = cleanEventType(type);
    const cleanTime = cleanString(time);
    const cleanLocation = cleanString(location);
    const cleanTicketUrl = cleanString(ticketUrl);
    const cleanTicketLabel = cleanString(ticketLabel);

    if (type !== undefined && cleanType === undefined) {
      return res.status(400).json({
        message: "Le type de l'événement n'est pas valide.",
      });
    }

    if (!cleanTitle) {
      return res.status(400).json({
        message: "Le titre de l'événement est obligatoire.",
      });
    }

    if (!cleanDescription) {
      return res.status(400).json({
        message: "La description de l'événement est obligatoire.",
      });
    }

    if (!cleanDate) {
      return res.status(400).json({
        message: "La date de l'événement est obligatoire.",
      });
    }

    const slug = await generateUniqueSlug(cleanTitle);

    const file = getUploadedFile(req);
    const imageUrl = await uploadImageToCloudinary(file);

    const event = await Event.create({
      title: cleanTitle,
      type: cleanType,
      slug,
      description: cleanDescription,
      date: new Date(cleanDate),
      time: cleanTime,
      location: cleanLocation,
      image: imageUrl || "",
      ticketUrl: cleanTicketUrl,
      ticketLabel: cleanTicketLabel,
      isTicketingEnabled: toBoolean(
        isTicketingEnabled,
        Boolean(cleanTicketUrl)
      ),
      isPublished: toBoolean(isPublished, true),
    });

    res.status(201).json(event);
  } catch (error: any) {
    console.error("Erreur création événement :", error);

    const statusCode = error.name === "ValidationError" ? 400 : 500;

    res.status(statusCode).json({
      message: "Erreur lors de la création de l’événement.",
      error: error.message,
    });
  }
};

// ADMIN — modifier un événement
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Événement introuvable.",
      });
    }

    const {
      title,
      type,
      description,
      date,
      time,
      location,
      ticketUrl,
      ticketLabel,
      isTicketingEnabled,
      isPublished,
    } = req.body;

    const cleanTitle = cleanString(title);
    const cleanDescription = cleanString(description);
    const cleanDate = cleanString(date);
    const cleanType = cleanEventType(type);
    const cleanTime = cleanString(time);
    const cleanLocation = cleanString(location);
    const cleanTicketUrl = cleanString(ticketUrl);
    const cleanTicketLabel = cleanString(ticketLabel);

    if (type !== undefined && cleanType === undefined) {
      return res.status(400).json({
        message: "Le type de l'événement n'est pas valide.",
      });
    }

    if (title !== undefined && !cleanTitle) {
      return res.status(400).json({
        message: "Le titre de l'événement ne peut pas être vide.",
      });
    }

    if (description !== undefined && !cleanDescription) {
      return res.status(400).json({
        message: "La description de l'événement ne peut pas être vide.",
      });
    }

    if (date !== undefined && !cleanDate) {
      return res.status(400).json({
        message: "La date de l'événement ne peut pas être vide.",
      });
    }

    if (cleanTitle && (cleanTitle !== event.title || !event.slug)) {
      event.slug = await generateUniqueSlug(cleanTitle, event._id.toString());
    }

    const file = getUploadedFile(req);
    const imageUrl = await uploadImageToCloudinary(file);

    if (title !== undefined) {
      event.title = cleanTitle;
    }

    if (type !== undefined && cleanType !== undefined) {
      event.type = cleanType;
    }

    if (description !== undefined) {
      event.description = cleanDescription;
    }

    if (date !== undefined) {
      event.date = new Date(cleanDate);
    }

    if (time !== undefined) {
      event.time = cleanTime;
    }

    if (location !== undefined) {
      event.location = cleanLocation;
    }

    if (imageUrl) {
      event.image = imageUrl;
    }

    if (ticketUrl !== undefined) {
      event.ticketUrl = cleanTicketUrl;
    }

    if (ticketLabel !== undefined) {
      event.ticketLabel = cleanTicketLabel;
    }

    if (isTicketingEnabled !== undefined) {
      event.isTicketingEnabled = toBoolean(
        isTicketingEnabled,
        event.isTicketingEnabled
      );
    }

    if (isPublished !== undefined) {
      event.isPublished = toBoolean(isPublished, event.isPublished);
    }

    if (!event.slug) {
      event.slug = await generateUniqueSlug(event.title, event._id.toString());
    }

    const updatedEvent = await event.save();

    res.status(200).json(updatedEvent);
  } catch (error: any) {
    console.error("Erreur modification événement :", error);

    const statusCode = error.name === "ValidationError" ? 400 : 500;

    res.status(statusCode).json({
      message: "Erreur lors de la modification de l’événement.",
      error: error.message,
    });
  }
};

// ADMIN — supprimer un événement
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Événement introuvable.",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      message: "Événement supprimé avec succès.",
    });
  } catch (error: any) {
    console.error("Erreur suppression événement :", error);

    res.status(500).json({
      message: "Erreur lors de la suppression de l’événement.",
      error: error.message,
    });
  }
};