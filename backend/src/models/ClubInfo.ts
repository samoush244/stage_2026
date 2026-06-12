import mongoose, { Schema, Document } from "mongoose";

export type HeroMediaType = "none" | "image" | "video";

export interface IClubInfo extends Document {
  address: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  tiktok: string;

  heroText: string;
  heroMediaType: HeroMediaType;
  heroMediaUrl: string;
  heroMediaPublicId: string;
}

const clubInfoSchema = new Schema<IClubInfo>(
  {
    address: {
      type: String,
      default: "Gymnase du club",
      trim: true,
    },

    email: {
      type: String,
      default: "contact@club-handball.fr",
      trim: true,
    },

    phone: {
      type: String,
      default: "00 00 00 00 00",
      trim: true,
    },

    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    tiktok: {
      type: String,
      default: "",
      trim: true,
    },

    heroText: {
      type: String,
      default:
        "Un club, une équipe, une famille. Retrouvez les matchs, les équipes, les actualités et toute la vie du club.",
      trim: true,
    },

    heroMediaType: {
      type: String,
      enum: ["none", "image", "video"],
      default: "none",
    },

    heroMediaUrl: {
      type: String,
      default: "",
    },

    heroMediaPublicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IClubInfo>("ClubInfo", clubInfoSchema);