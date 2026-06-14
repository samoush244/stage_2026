import express from "express";
import cors from "cors";
import helmet from "helmet";
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

const app = express();

// ─── Sécurité : Headers HTTP ─────────────────────────────────────────────────
app.use(helmet());

// ─── Sécurité : CORS — uniquement ton domaine frontend ───────────────────────
const allowedOrigins = [
  "http://localhost:5173",         // dev local
  "https://stage-2026-samoush244s-projects.vercel.app", // 🔴 remplace par ton vrai domaine
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise les requêtes sans origin (Postman, mobile) en dev
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqué pour l'origine : ${origin}`));
      }
    },
    credentials: true,
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Fichiers statiques ───────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/upload", express.static(path.join(__dirname, "../upload")));

// ─── Santé du serveur ─────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ message: "Backend OK" });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
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

export default app;