import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authroutes";
import playerRoutes from "./routes/playerRoutes";
import newsletterRoutes from "./routes/NewsletterRoutes";
import contactRoutes from "./routes/ContactRoutes";
import partnerRoutes from "./routes/partnerRoutes";
import newsRoutes from "./routes/newsRoutes";
import teamRoutes from "./routes/teamRoutes";
import organizationMemberRoutes from "./routes/organizationMemberRoutes";
import eventRoutes from "./routes/eventRoutes";
import historyRoutes from "./routes/historyRoutes";
import clubInfoRoutes from "./routes/clubInfoRoutes";
import practiceCategoryRoutes from "./routes/praticeCategoryRoutes";
import registrationInfoRoutes from "./routes/registrationInfoRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// dossier uploads visible depuis le navigateur
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/upload", express.static(path.join(__dirname, "../upload")));

app.get("/api/health", (_req, res) => {
  res.json({ message: "Backend OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/organization-members", organizationMemberRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/histories", historyRoutes);
app.use("/api/club-info", clubInfoRoutes);
app.use("/api/practice-categories", practiceCategoryRoutes);
app.use("/api/registration-info", registrationInfoRoutes);

export default app;