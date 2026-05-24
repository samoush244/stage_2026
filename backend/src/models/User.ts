import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "coach" | "joueur" | "membre";

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
      enum: ["admin", "coach", "joueur","membre"],
      default: ["membre"],
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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }
const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);;
});
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};
export default mongoose.model<IUser>("User", userSchema);