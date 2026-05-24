import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User";

dotenv.config();

const createAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI manquant dans le fichier .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({
      email: "admin@club.fr",
    });

    if (existingAdmin) {
      console.log("Admin existe déjà");
      process.exit(0);
    }

    const admin = await User.create({
      firstName: "Administrateur",
      lastName: "Du Club",
      email: "admin@club.fr",
      password: "admin123",
      roles: ["admin"],
    });

    console.log("Admin créé avec succès :", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Erreur création admin :", error);
    process.exit(1);
  }
};

createAdmin();