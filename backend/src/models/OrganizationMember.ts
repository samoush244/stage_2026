import mongoose, { Schema, Document } from "mongoose";

export interface IOrganizationMember extends Document {
  firstName: string;
  lastName: string;
  role: string;
  group: "bureau" | "ca";
  email?: string;
  photo?: string;
  order: number;
  isActive: boolean;
}

const organizationMemberSchema = new Schema<IOrganizationMember>(
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

    role: {
      type: String,
      required: true,
      trim: true,
    },

    group: {
      type: String,
      enum: ["bureau", "ca"],
      required: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    photo: {
      type: String,
      default: "",
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

export default mongoose.model<IOrganizationMember>(
  "OrganizationMember",
  organizationMemberSchema
);