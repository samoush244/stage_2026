import express from "express";
import {
  createPracticeCategory,
  deletePracticeCategory,
  getAdminPracticeCategories,
  getPublicPracticeCategories,
  updatePracticeCategory,
} from "../controllers/practiceCategoryController";
import { uploadPracticeCategoryLogo } from "../middlewares/uploadPracticeCategory";

// À sécuriser ensuite avec ton middleware admin.
// import { protect, requireAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getPublicPracticeCategories);

router.get("/admin", getAdminPracticeCategories);

router.post(
  "/",
  uploadPracticeCategoryLogo,
  createPracticeCategory
);

router.put(
  "/:id",
  uploadPracticeCategoryLogo,
  updatePracticeCategory
);

router.delete("/:id", deletePracticeCategory);

export default router;