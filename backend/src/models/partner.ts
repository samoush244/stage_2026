import mongoose, { Schema, Document } from "mongoose";

export interface IPartner extends Document {
  name: string;
  logo: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new Schema<IPartner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
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

export default mongoose.model<IPartner>("Partner", partnerSchema);