import express from "express";
import cors from "cors";
import authRoutes from "./routes/authroutes";
import playerRoutes from "./routes/playerRoutes";
import newsletterRoutes from "./routes/NewsletterSubscriber";
import contactRoutes from "./routes/ContactRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "Backend OK" });
});
app.use ("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
export default app;