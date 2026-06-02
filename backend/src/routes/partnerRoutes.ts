import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  getPartners,
  getAllPartnersAdmin,
  createPartner,
  updatePartner,
  deletePartner,
} from "../controllers/partnerController";

import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = express.Router();

const uploadDir = path.join(__dirname,"../../uploads/partners");

if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir,{recursive:true});
}

const storage= multer.diskStorage({
  destination :(req, file, cb) =>{
    cb(null,"uploads/partners");
  },
  filename :(req,file,cb) =>{
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload =multer ({storage});

/**
 * Routes publiques
 */
router.get("/", getPartners);

/**
 * Routes admin
 */
router.get("/admin/all", protect, requireRole(["admin"]), getAllPartnersAdmin);
router.post("/", protect, requireRole(["admin"]),upload.single("logo"), createPartner);
router.put("/:id", protect, requireRole(["admin"]),upload.single("logo"), updatePartner);
router.delete("/:id", protect, requireRole(["admin"]), deletePartner);

export default router;