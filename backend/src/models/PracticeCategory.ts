import mongoose, { Schema, Document } from "mongoose";

export type ScheduleCell = {
  time?: string;
  location?: string;
};

export type ScheduleRow = {
  day: string;
  cells: ScheduleCell[];
};

export interface IPracticeCategory extends Document {
  title: string;
  birthYearsLabel?: string;
  logoUrl?: string;
  logoPublicId?: string;
  columns: string[];
  rows: ScheduleRow[];
  order: number;
  isActive: boolean;
}

const ScheduleCellSchema = new Schema<ScheduleCell>(
  {
    time: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const ScheduleRowSchema = new Schema<ScheduleRow>(
  {
    day: {
      type: String,
      required: true,
      trim: true,
    },
    cells: {
      type: [ScheduleCellSchema],
      default: [],
    },
  },
  { _id: false }
);

const PracticeCategorySchema = new Schema<IPracticeCategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    birthYearsLabel: {
      type: String,
      default: "",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    logoPublicId: {
      type: String,
      default: "",
      trim: true,
    },
    columns: {
      type: [String],
      required: true,
      default: [],
    },
    rows: {
      type: [ScheduleRowSchema],
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
  { timestamps: true }
);

export default mongoose.model<IPracticeCategory>(
  "PracticeCategory",
  PracticeCategorySchema
);