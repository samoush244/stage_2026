import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Match", "Tournoi", "Stage", "Soirée club", "Autre"],
      default:"Match",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    ticketUrl: {
      type: String,
      default: "",
    },

    ticketLabel: {
      type: String,
      default: "Réserver",
    },

    isTicketingEnabled: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);