import mongoose, { Document, Schema } from "mongoose";

export type PlayerRole = "coach" | "joueur" | "membre";

export interface IPlayer extends Document {
  licenseNumber: string;
  firstName: string;
  lastName: string;
  roles: PlayerRole[];
  team?: mongoose.Types.ObjectId;
  birthDate?: Date;
  photo?: string;
  number?: number;
  position?: string;
  isDisplayed: boolean;
  isActive: boolean;
  isFeaturedTeamPlayer :boolean;
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
      enum: [ "coach", "joueur","membre"],
      default: ["joueur"],
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    birthDate: {
      type: Date,
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
    isFeaturedTeamPlayer:{
     type:Boolean,
     default:false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    userAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPlayer>("Player", playerSchema);