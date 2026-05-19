import mongoose, { Document, Schema } from "mongoose";

export type TeamGender = "masculin" | "feminin" | "mixte";

export type TeamType =
  | "premiere"
  | "jeunes"
  | "loisirs"
  | "autre";

export interface ITeam extends Document {
  name: string;
  slug: string;

  gender: TeamGender;
  type: TeamType;

  category?: string;

  image?: string;

  ffhandballUrl?: string;

  scorencoUrl?: string;

  isFirstTeam: boolean;

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

    gender: {
      type: String,
      enum: ["masculin", "feminin", "mixte"],
      required: true,
    },

    type: {
      type: String,
      enum: ["premiere", "jeunes", "loisirs", "autre"],
      required: true,
    },

    category: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    ffhandballUrl: {
      type: String,
      default: "",
    },

    scorencoUrl: {
      type: String,
      default: "",
    },

    isFirstTeam: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITeam>("Team", teamSchema);