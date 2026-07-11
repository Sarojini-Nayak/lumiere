import express from "express";
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/cmsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/banners/active", getActiveBanners);
router.get("/banners", protect, admin, getAllBanners);
router.post("/banners", protect, admin, upload.single("image"), createBanner);
router.put("/banners/:id", protect, admin, upload.single("image"), updateBanner);
router.delete("/banners/:id", protect, admin, deleteBanner);

export default router;