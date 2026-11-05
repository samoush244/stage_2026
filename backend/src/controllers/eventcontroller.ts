import { Request, Response } from "express";
import { put, del } from "@vercel/blob";
import Event from "../models/Event";

const cleanString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const eventTypes = ["Match", "Tournoi", "Stage", "Soirée club", "Autre"] as const;
type EventType = (typeof eventTypes)[number];

const cleanEventType = (value: unknown): EventType | undefined => {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim();
  return eventTypes.includes(cleaned as EventType)
    ? (cleaned as EventType)
    : undefined;
};

const createSlug = (title: string) =>
  title.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const generateUniqueSlug = async (title: string, ignoredEventId?: string) => {
  let baseSlug = createSlug(title);
  if (!baseSlug) baseSlug = `evenement-${Date.now()}`;
  let slug = baseSlug;
  let count = 1;
  while (true) {
    const query: any = { slug };
    if (ignoredEventId) query._id = { $ne: ignoredEventId };
    const existingEvent = await Event.findOne(query).select("_id");
    if (!existingEvent) return slug;
    slug = `${baseSlug}-${count}`;
    count++;
  }
};

const getUploadedFile = (req: Request) =>
  (req as Request & { file?: Express.Multer.File }).file;

/** Upload public d'une image. Nécessite Multer memoryStorage() côté routes. */
const uploadImageToVercelBlob = async (
  file?: Express.Multer.File
): Promise<string | undefined> => {
  if (!file) return undefined;

  const mimeToExtension: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = mimeToExtension[file.mimetype];
  if (!extension) {
    throw new Error("Seules les images JPG, PNG ou WebP sont autorisées.");
  }
  if (!file.buffer) {
    throw new Error("Le fichier image doit être reçu en mémoire par Multer.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("L'image ne doit pas dépasser 10 Mo.");
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN est manquant.");

  const blob = await put(`events/${Date.now()}.${extension}`, file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype,
    token,
  });
  return blob.url;
};

/** Ne nettoie que la nouvelle image créée pendant une opération en échec. */
const cleanupFailedUpload = async (url?: string) => {
  if (!url) return;
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) await del(url, { token });
  } catch (error) {
    console.error("Nettoyage de l'upload Blob échoué :", error);
  }
};

const toBoolean = (value: unknown, defaultValue = false) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (["true", "1", "yes", "oui", "on", "visible"].includes(normalizedValue)) return true;
    if (["false", "0", "no", "non", "off", "hidden", "non visible"].includes(normalizedValue)) return false;
  }
  return defaultValue;
};

// PUBLIC — récupérer les événements publiés
export const getPublicEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find({ isPublished: true }).sort({ date: 1, createdAt: -1 });
    res.status(200).json(events);
  } catch (error: any) {
    console.error("Erreur récupération événements publics :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements.", error: error.message });
  }
};

// PUBLIC — récupérer un événement par slug
export const getPublicEventBySlug = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, isPublished: true });
    if (!event) return res.status(404).json({ message: "Événement introuvable." });
    res.status(200).json(event);
  } catch (error: any) {
    console.error("Erreur récupération événement par slug :", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l’événement.", error: error.message });
  }
};

// ADMIN — récupérer tous les événements
export const getAllEventsAdmin = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1, createdAt: -1 });
    res.status(200).json(events);
  } catch (error: any) {
    console.error("Erreur récupération événements admin :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements admin.", error: error.message });
  }
};

// ADMIN — créer un événement
export const createEvent = async (req: Request, res: Response) => {
  let newlyUploadedImage: string | undefined;
  try {
    const {
      title, type, description, date, time, location, ticketUrl,
      ticketLabel, isTicketingEnabled, isPublished,
    } = req.body;

    const cleanTitle = cleanString(title);
    const cleanDescription = cleanString(description);
    const cleanDate = cleanString(date);
    const cleanType = cleanEventType(type);
    const cleanTime = cleanString(time);
    const cleanLocation = cleanString(location);
    const cleanTicketUrl = cleanString(ticketUrl);
    const cleanTicketLabel = cleanString(ticketLabel);

    if (type !== undefined && cleanType === undefined)
      return res.status(400).json({ message: "Le type de l'événement n'est pas valide." });
    if (!cleanTitle)
      return res.status(400).json({ message: "Le titre de l'événement est obligatoire." });
    if (!cleanDescription)
      return res.status(400).json({ message: "La description de l'événement est obligatoire." });
    if (!cleanDate)
      return res.status(400).json({ message: "La date de l'événement est obligatoire." });
    if (Number.isNaN(new Date(cleanDate).getTime()))
      return res.status(400).json({ message: "La date de l'événement n'est pas valide." });

    const slug = await generateUniqueSlug(cleanTitle);
    newlyUploadedImage = await uploadImageToVercelBlob(getUploadedFile(req));

    const event = await Event.create({
      title: cleanTitle,
      type: cleanType,
      slug,
      description: cleanDescription,
      date: new Date(cleanDate),
      time: cleanTime,
      location: cleanLocation,
      image: newlyUploadedImage || "",
      ticketUrl: cleanTicketUrl,
      ticketLabel: cleanTicketLabel,
      isTicketingEnabled: toBoolean(isTicketingEnabled, Boolean(cleanTicketUrl)),
      isPublished: toBoolean(isPublished, true),
    });
    newlyUploadedImage = undefined; // image désormais référencée en base
    res.status(201).json(event);
  } catch (error: any) {
    await cleanupFailedUpload(newlyUploadedImage);
    console.error("Erreur création événement :", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ message: "Erreur lors de la création de l’événement.", error: error.message });
  }
};

// ADMIN — modifier un événement
export const updateEvent = async (req: Request, res: Response) => {
  let newlyUploadedImage: string | undefined;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Événement introuvable." });

    const {
      title, type, description, date, time, location, ticketUrl,
      ticketLabel, isTicketingEnabled, isPublished,
    } = req.body;

    const cleanTitle = cleanString(title);
    const cleanDescription = cleanString(description);
    const cleanDate = cleanString(date);
    const cleanType = cleanEventType(type);
    const cleanTime = cleanString(time);
    const cleanLocation = cleanString(location);
    const cleanTicketUrl = cleanString(ticketUrl);
    const cleanTicketLabel = cleanString(ticketLabel);

    if (type !== undefined && cleanType === undefined)
      return res.status(400).json({ message: "Le type de l'événement n'est pas valide." });
    if (title !== undefined && !cleanTitle)
      return res.status(400).json({ message: "Le titre de l'événement ne peut pas être vide." });
    if (description !== undefined && !cleanDescription)
      return res.status(400).json({ message: "La description de l'événement ne peut pas être vide." });
    if (date !== undefined && !cleanDate)
      return res.status(400).json({ message: "La date de l'événement ne peut pas être vide." });
    if (date !== undefined && Number.isNaN(new Date(cleanDate).getTime()))
      return res.status(400).json({ message: "La date de l'événement n'est pas valide." });

    if (cleanTitle && (cleanTitle !== event.title || !event.slug))
      event.slug = await generateUniqueSlug(cleanTitle, event._id.toString());

    // L'ancienne image est conservée même si le nouvel upload ou la sauvegarde échoue.
    newlyUploadedImage = await uploadImageToVercelBlob(getUploadedFile(req));

    if (title !== undefined) event.title = cleanTitle;
    if (type !== undefined && cleanType !== undefined) event.type = cleanType;
    if (description !== undefined) event.description = cleanDescription;
    if (date !== undefined) event.date = new Date(cleanDate);
    if (time !== undefined) event.time = cleanTime;
    if (location !== undefined) event.location = cleanLocation;
    if (newlyUploadedImage) event.image = newlyUploadedImage;
    if (ticketUrl !== undefined) event.ticketUrl = cleanTicketUrl;
    if (ticketLabel !== undefined) event.ticketLabel = cleanTicketLabel;
    if (isTicketingEnabled !== undefined)
      event.isTicketingEnabled = toBoolean(isTicketingEnabled, event.isTicketingEnabled);
    if (isPublished !== undefined)
      event.isPublished = toBoolean(isPublished, event.isPublished);
    if (!event.slug)
      event.slug = await generateUniqueSlug(event.title, event._id.toString());

    const updatedEvent = await event.save();
    newlyUploadedImage = undefined;
    res.status(200).json(updatedEvent);
  } catch (error: any) {
    await cleanupFailedUpload(newlyUploadedImage);
    console.error("Erreur modification événement :", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ message: "Erreur lors de la modification de l’événement.", error: error.message });
  }
};

// ADMIN — supprimer un événement
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Événement introuvable." });
    await event.deleteOne();
    // Nettoyage du stockage reporté : ne pas supprimer de média potentiellement partagé.
    res.status(200).json({ message: "Événement supprimé avec succès." });
  } catch (error: any) {
    console.error("Erreur suppression événement :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l’événement.", error: error.message });
  }
};
