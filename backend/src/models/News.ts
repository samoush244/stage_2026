import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  slug: string;
  image?: string;
  content?: string;
  summary?: string;
  type: "internal" | "external";
  source?: string;
  externalUrl?: string;
  publishedAt?: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    image: {
      type: String,
      required: false,
    },

    content: {
      type: String,
      required: false,
    },

    summary: {
      type: String,
      required: false,
    },

    type: {
      type: String,
      enum: ["internal", "external"],
      default: "internal",
    },

    source: {
      type: String,
      required: false,
    },

    externalUrl: {
      type: String,
      required: false,
    },

    publishedAt: {
      type: Date,
      required: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INews>("News", newsSchema);