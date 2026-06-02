import mongoose, { Document, Schema } from "mongoose";

export interface ITeam extends Document {
  name: string;
  slug: string;

  group: "premiere" | "masculine" | "feminine" | "loisirs";
  gender?: "masculin" | "feminin" | "mixte";

  level?: string;
  season?: string;

  image?: string;
  description?: string;

  ffhandballUrl?: string;
  scorencoUrl?: string;

  hasRosterPage: boolean;
  hasResultsPage: boolean;

  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
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

    gender: {
      type: String,
      enum: ["masculin", "feminin", "mixte"],
      required: true,
    },

    group: {
      type: String,
      enum: ["premiere", "masculine", "feminine", "loisirs"],
      required: true,
    },

    level: {
      type: String,
      required: false,
      trim: true,
    },

    season: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      required: false,
    },

    description: {
      type: String,
      required: false,
    },
    
    ffhandballUrl: {
      type: String,
      default: "",
    },

    scorencoUrl: {
      type: String,
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
  { timestamps: true }
);

export default mongoose.model<ITeam>("Team", teamSchema);