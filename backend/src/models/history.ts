import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    text: {
      type: [String],
      default: [],
    },

    details: {
      type: [String],
      default: [],
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

const History = mongoose.model("History", historySchema);

export default History;