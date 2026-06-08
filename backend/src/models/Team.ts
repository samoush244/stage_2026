import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  slug: string;
  teamType: "premiere" | "autre";
  gender: "masculin" | "feminin" | "mixte";
  category?: string;
  level?: string;
  season?: string;
  description?: string;
  image?: string;
  ffhandballUrl?: string;
  scorencoUrl?: string;
  hasRosterPage: boolean;
  hasResultsPage: boolean;
  order: number;
  isActive: boolean;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
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

    teamType: {
      type: String,
      enum: ["premiere", "autre"],
      required: true,
      default: "autre",
    },

    gender: {
      type: String,
      enum: ["masculin", "feminin", "mixte"],
      required: true,
      default: "mixte",
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    level: {
      type: String,
      trim: true,
      default: "",
    },

    season: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    ffhandballUrl: {
      type: String,
      trim: true,
      default: "",
    },

    scorencoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    hasRosterPage: {
      type: Boolean,
      default: false,
    },

    hasResultsPage: {
      type: Boolean,
      default: false,
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
    timestamps: true,
  }
);

export default mongoose.model<ITeam>("Team", teamSchema);