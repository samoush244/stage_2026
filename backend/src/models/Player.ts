import mongoose, { Document, Schema } from "mongoose";

export type PlayerRole = "admin" | "coach" | "joueur" | "membre";

export interface IPlayer extends Document {
  licenseNumber: string;
  firstName: string;
  lastName: string;
  roles: PlayerRole[];
  team?: mongoose.Types.ObjectId;
  photo?: string;
  number?: number;
  position?: string;
  isDisplayed: boolean;
  userAccount?: mongoose.Types.ObjectId;
}

const playerSchema = new Schema<IPlayer>(
  {
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    roles: {
      type: [String],
      enum: ["admin", "coach", "joueur","membre"],
      default: ["membre"],
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    photo: {
      type: String,
      default: "",
    },

    number: {
      type: Number,
    },

    position: {
      type: String,
      trim: true,
    },

    isDisplayed: {
      type: Boolean,
      default: false,
    },

    userAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPlayer>("Player", playerSchema);