import { Request, Response } from "express";
import Event from "../models/Event";
import cloudinary from "../config/cloudinary";

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

// PUBLIC — récupérer les événements publiés
export const getPublicEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ isPublished: true }).sort({
      date: 1,
      createdAt: -1,
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des événements.",
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
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l’événement.",
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
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des événements admin.",
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

    if (!title || !description || !date) {
      return res.status(400).json({
        message: "Le titre, la description et la date sont obligatoires.",
      });
    }

    let slug = createSlug(title);

    const existingEvent = await Event.findOne({ slug });

    if (existingEvent) {
      slug = `${slug}-${Date.now()}`;
    }

    const file = getUploadedFile(req);
    const imageUrl = await uploadImageToCloudinary(file);

    const event = await Event.create({
      title,
      type,
      slug,
      description,
      date,
      time,
      location,
      image: imageUrl || "",
      ticketUrl,
      ticketLabel,
      isTicketingEnabled: toBoolean(isTicketingEnabled, Boolean(ticketUrl)),
      isPublished: toBoolean(isPublished, true),
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Erreur création événement :", error);

    res.status(500).json({
      message: "Erreur lors de la création de l’événement.",
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

    if (title && title !== event.title) {
      let newSlug = createSlug(title);

      const existingEvent = await Event.findOne({
        slug: newSlug,
        _id: { $ne: event._id },
      });

      if (existingEvent) {
        newSlug = `${newSlug}-${Date.now()}`;
      }

      event.slug = newSlug;
    }

    const file = getUploadedFile(req);
    const imageUrl = await uploadImageToCloudinary(file);

    event.title = title ?? event.title;
    event.type = type ?? event.type;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.time = time ?? event.time;
    event.location = location ?? event.location;

    if (imageUrl) {
      event.image = imageUrl;
    }

    event.ticketUrl = ticketUrl ?? event.ticketUrl;
    event.ticketLabel = ticketLabel ?? event.ticketLabel;

    if (isTicketingEnabled !== undefined) {
      event.isTicketingEnabled = toBoolean(
        isTicketingEnabled,
        event.isTicketingEnabled
      );
    }

    if (isPublished !== undefined) {
      event.isPublished = toBoolean(isPublished, event.isPublished);
    }

    const updatedEvent = await event.save();

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Erreur modification événement :", error);

    res.status(500).json({
      message: "Erreur lors de la modification de l’événement.",
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
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l’événement.",
    });
  }
};