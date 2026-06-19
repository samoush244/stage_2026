import mongoose, { Document, Schema, Types } from "mongoose";

export type RegistrationDocument = {
    _id?: Types.ObjectId;
  title: string;
  fileUrl: string;
  publicId: string;
  resourceType: string;
  order: number;
  isActive: boolean;
};

export interface IRegistrationInfo extends Document {
  season: string;
  documents: RegistrationDocument[];
  paymentMethodsText: string;
  reductionsText: string;
  pricingImageUrl?: string;
  pricingImagePublicId?: string;
  pricingImageResourceType?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationDocumentSchema = new Schema<RegistrationDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      required: true,
      default: "raw",
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

const RegistrationInfoSchema = new Schema<IRegistrationInfo>(
  {
    season: {
      type: String,
      default: "2025/2026",
      trim: true,
    },

    documents: {
      type: [RegistrationDocumentSchema],
      default: [],
    },

    paymentMethodsText: {
      type: String,
      default: "",
    },

    reductionsText: {
      type: String,
      default: "",
    },

    pricingImageUrl: {
      type: String,
      default: "",
    },

    pricingImagePublicId: {
      type: String,
      default: "",
    },

    pricingImageResourceType: {
      type: String,
      default: "image",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRegistrationInfo>(
  "RegistrationInfo",
  RegistrationInfoSchema
);