// src/models/team.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  slug: string;
  teamType: "premiere" | "autre";
  gender: "masculin" | "feminin" | "mixte";
  category?: string;
  level?: string;
  image?: string;
  ffhandballUrl?: string;
  scorencoUrl?: string;
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
    },

    level: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
    },

    ffhandballUrl: {
      type: String,
      trim: true,
    },

    scorencoUrl: {
      type: String,
      trim: true,
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