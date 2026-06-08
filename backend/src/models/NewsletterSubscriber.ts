import mongoose, { Schema, Document } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  isActive: boolean;

  consentGiven: boolean;
  consentDate: Date;
  consentText: string;

  unsubscribeToken: string;

  welcomeEmailSent: boolean;
  welcomeEmailSentAt?: Date;

  unsubscribedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const newsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    consentGiven: {
      type: Boolean,
      required: true,
      default: false,
    },

    consentDate: {
      type: Date,
      required: true,
    },

    consentText: {
      type: String,
      required: true,
    },

    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
    },

    welcomeEmailSent: {
      type: Boolean,
      default: false,
    },

    welcomeEmailSentAt: {
      type: Date,
    },

    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INewsletterSubscriber>(
  "NewsletterSubscriber",
  newsletterSubscriberSchema
);