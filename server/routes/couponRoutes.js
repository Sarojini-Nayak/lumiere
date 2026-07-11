import express from "express";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getCoupons);
router.post("/", protect, admin, createCoupon);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

export default router;