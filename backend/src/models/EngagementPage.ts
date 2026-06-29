import { Document, model, Schema } from "mongoose";

export interface EngagementLabel {
  name: string;
  logo: string;
  description?: string;
  year?: string;
  order: number;
  isActive: boolean;
}

export interface EngagementGalleryItem {
  image: string;
  title: string;
  description: string;
  actionDate?: Date;
  order: number;
  isActive: boolean;
}

export interface EngagementPageDocument extends Document {
  partnerName: string;
  partnerLogo: string;
  partnerWebsite?: string;
  introText: string;
  labels: EngagementLabel[];
  gallery: EngagementGalleryItem[];
}

const engagementLabelSchema = new Schema<EngagementLabel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: String,
      default: "",
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
  { _id: true }
);

const engagementGalleryItemSchema = new Schema<EngagementGalleryItem>(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    actionDate: {
      type: Date,
      default: null,
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
  { _id: true }
);

const engagementPageSchema = new Schema<EngagementPageDocument>(
  {
    partnerName: {
      type: String,
      default: "",
      trim: true,
    },
    partnerLogo: {
      type: String,
      default: "",
      trim: true,
    },
    partnerWebsite: {
      type: String,
      default: "",
      trim: true,
    },
    introText: {
      type: String,
      default:
        "Grâce au soutien de notre partenaire, le Valenciennes Handball Club met en place des actions durables et citoyennes tout au long de l’année. Ensemble, nous réalisons des activités de sensibilisation, de solidarité et de protection de l’environnement afin de transmettre aux jeunes licenciés les valeurs de respect, d’engagement et de responsabilité.",
      trim: true,
    },
    labels: {
      type: [engagementLabelSchema],
      default: [],
    },
    gallery: {
      type: [engagementGalleryItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const EngagementPage = model<EngagementPageDocument>(
  "EngagementPage",
  engagementPageSchema
);

export default EngagementPage;

