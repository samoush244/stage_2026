import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import RegistrationInfo from "../models/RegistrationInfo";

const getUploadedFile = (req: Request) => {
  return (req as Request & { file?: Express.Multer.File }).file;
};

const getOrCreateRegistrationInfo = async () => {
  let registrationInfo = await RegistrationInfo.findOne();

  if (!registrationInfo) {
    registrationInfo = await RegistrationInfo.create({
      season: "2025/2026",
      documents: [],
      paymentMethodsText:
        "Le règlement de la licence peut être effectué par chèque, espèces, virement bancaire ou autre moyen accepté par le club.",
      reductionsText:
        "Certaines réductions peuvent être appliquées selon la situation : réduction famille, Pass Sport, Coupon Sport, Carte Sortir ou autres aides acceptées par le club.",
      isActive: true,
    });
  }

  return registrationInfo;
};

const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string
): Promise<{
  secureUrl: string;
  publicId: string;
  resourceType: string;
}> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Erreur upload Cloudinary"));
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

const deleteFromCloudinary = async (
  publicId?: string,
  resourceType: string = "image"
) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Erreur suppression Cloudinary :", error);
  }
};

export const getPublicRegistrationInfo = async (_req: Request, res: Response) => {
  try {
    const registrationInfo = await RegistrationInfo.findOne({
      isActive: true,
    });

    if (!registrationInfo) {
      return res.status(200).json(null);
    }

    const activeDocuments = registrationInfo.documents
      .filter((document) => document.isActive)
      .sort((a, b) => a.order - b.order);

    return res.status(200).json({
      _id: registrationInfo._id,
      season: registrationInfo.season,
      documents: activeDocuments,
      paymentMethodsText: registrationInfo.paymentMethodsText,
      reductionsText: registrationInfo.reductionsText,
      pricingImageUrl: registrationInfo.pricingImageUrl,
      isActive: registrationInfo.isActive,
    });
  } catch (error) {
    console.error("Erreur récupération inscription publique :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des inscriptions.",
    });
  }
};

export const getAdminRegistrationInfo = async (_req: Request, res: Response) => {
  try {
    const registrationInfo = await getOrCreateRegistrationInfo();

    registrationInfo.documents.sort((a, b) => a.order - b.order);

    return res.status(200).json(registrationInfo);
  } catch (error) {
    console.error("Erreur récupération inscription admin :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de la récupération admin.",
    });
  }
};

export const updateRegistrationInfo = async (req: Request, res: Response) => {
  try {
    const {
      season,
      paymentMethodsText,
      reductionsText,
      isActive,
    } = req.body;

    const registrationInfo = await getOrCreateRegistrationInfo();

    if (season !== undefined) {
      registrationInfo.season = season;
    }

    if (paymentMethodsText !== undefined) {
      registrationInfo.paymentMethodsText = paymentMethodsText;
    }

    if (reductionsText !== undefined) {
      registrationInfo.reductionsText = reductionsText;
    }

    if (isActive !== undefined) {
      registrationInfo.isActive = isActive === true || isActive === "true";
    }

    await registrationInfo.save();

    return res.status(200).json({
      message: "Informations d’inscription mises à jour.",
      registrationInfo,
    });
  } catch (error) {
    console.error("Erreur mise à jour inscription :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour.",
    });
  }
};

export const addRegistrationDocument = async (req: Request, res: Response) => {
  try {
    const file = getUploadedFile(req);
    const { title, order, isActive } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Le nom du document est obligatoire.",
      });
    }

    if (!file) {
      return res.status(400).json({
        message: "Le fichier est obligatoire.",
      });
    }

    const uploadedFile = await uploadToCloudinary(
      file,
      "stage-handball/registration-documents"
    );

    const registrationInfo = await getOrCreateRegistrationInfo();

    registrationInfo.documents.push({
      title,
      fileUrl: uploadedFile.secureUrl,
      publicId: uploadedFile.publicId,
      resourceType: uploadedFile.resourceType,
      order: Number(order) || registrationInfo.documents.length + 1,
      isActive: isActive === undefined ? true : isActive === "true",
    });

    await registrationInfo.save();

    return res.status(201).json({
      message: "Document ajouté avec succès.",
      registrationInfo,
    });
  } catch (error) {
    console.error("Erreur ajout document inscription :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de l’ajout du document.",
    });
  }
};

export const updateRegistrationDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const { documentId } = req.params;
    const { title, order, isActive } = req.body;

    const registrationInfo = await getOrCreateRegistrationInfo();

    const registrationDocument = registrationInfo.documents.find(
      (doc) => doc._id?.toString() === documentId
    );

    if (!registrationDocument) {
      return res.status(404).json({
        message: "Document introuvable.",
      });
    }

    if (title !== undefined) {
      registrationDocument.title = title;
    }

    if (order !== undefined) {
      registrationDocument.order = Number(order) || 0;
    }

    if (isActive !== undefined) {
      registrationDocument.isActive =
        isActive === true || isActive === "true";
    }

    await registrationInfo.save();

    return res.status(200).json({
      message: "Document mis à jour.",
      registrationInfo,
    });
  } catch (error) {
    console.error("Erreur modification document inscription :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de la modification du document.",
    });
  }
};

export const deleteRegistrationDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const { documentId } = req.params;

    const registrationInfo = await getOrCreateRegistrationInfo();

    const registrationDocument = registrationInfo.documents.find(
      (doc) => doc._id?.toString() === documentId
    );

    if (!registrationDocument) {
      return res.status(404).json({
        message: "Document introuvable.",
      });
    }

    await deleteFromCloudinary(
      registrationDocument.publicId,
      registrationDocument.resourceType
    );

    registrationInfo.documents = registrationInfo.documents.filter(
      (doc) => doc._id?.toString() !== documentId
    );

    await registrationInfo.save();

    return res.status(200).json({
      message: "Document supprimé.",
      registrationInfo,
    });
  } catch (error) {
    console.error("Erreur suppression document inscription :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de la suppression du document.",
    });
  }
};

export const updatePricingImage = async (req: Request, res: Response) => {
  try {
    const file = getUploadedFile(req);

    if (!file) {
      return res.status(400).json({
        message: "L’image des tarifs est obligatoire.",
      });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        message: "Le fichier des tarifs doit être une image.",
      });
    }

    const registrationInfo = await getOrCreateRegistrationInfo();

    await deleteFromCloudinary(
      registrationInfo.pricingImagePublicId,
      registrationInfo.pricingImageResourceType || "image"
    );

    const uploadedImage = await uploadToCloudinary(
      file,
      "stage-handball/registration-pricing"
    );

    registrationInfo.pricingImageUrl = uploadedImage.secureUrl;
    registrationInfo.pricingImagePublicId = uploadedImage.publicId;
    registrationInfo.pricingImageResourceType = uploadedImage.resourceType;

    await registrationInfo.save();

    return res.status(200).json({
      message: "Image des tarifs mise à jour.",
      registrationInfo,
    });
  } catch (error) {
    console.error("Erreur upload image tarifs :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de l’upload de l’image des tarifs.",
    });
  }
};

export const deletePricingImage = async (_req: Request, res: Response) => {
  try {
    const registrationInfo = await getOrCreateRegistrationInfo();

    await deleteFromCloudinary(
      registrationInfo.pricingImagePublicId,
      registrationInfo.pricingImageResourceType || "image"
    );

    registrationInfo.pricingImageUrl = "";
    registrationInfo.pricingImagePublicId = "";
    registrationInfo.pricingImageResourceType = "image";

    await registrationInfo.save();

    return res.status(200).json({
      message: "Image des tarifs supprimée.",
      registrationInfo,
    });
  } catch (error) {
    console.error("Erreur suppression image tarifs :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de la suppression de l’image des tarifs.",
    });
  }
};