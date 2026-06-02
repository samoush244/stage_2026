import express from "express";
import cors from "cors";
import path from "path"
import authRoutes from "./routes/authroutes";
import playerRoutes from "./routes/playerRoutes";
import newsletterRoutes from "./routes/NewsletterSubscriber";
import contactRoutes from "./routes/ContactRoutes";
import partnerRoutes from "./routes/partnerRoutes";
import newsRoutes from "./routes/newsRoutes";
import teamRoutes from "./routes/teamRoutes";
import organizationMemberRoutes from "./routes/organizationMemberRoutes";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// dossier uploads visile depuis le navigateur
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/api/health", (_req, res) => {
  res.json({ message: "Backend OK" });
});
app.use ("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/organization-members", organizationMemberRoutes);
export default app;