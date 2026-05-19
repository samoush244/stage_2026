import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "nouveau" | "lu" | "traite";
  createdAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
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
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["nouveau", "lu", "traite"],
      default: "nouveau",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContactMessage>(
  "ContactMessage",
  contactMessageSchema
);