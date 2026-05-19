import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "admin" | "coach" | "joueur" | "dirigeant";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: UserRole[];
  playerId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: ["admin", "coach", "joueur", "dirigeant"],
      default: ["joueur"],
    },
    playerId: {
      type: mongoose.Types.ObjectId,
      ref: "Player",
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

export default mongoose.model<IUser>("User", userSchema);