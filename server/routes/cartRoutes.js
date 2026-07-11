import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  toggleGiftWrap,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/item/:itemId", protect, updateCartItem);
router.delete("/item/:itemId", protect, removeCartItem);
router.post("/coupon", protect, applyCoupon);
router.post("/gift-wrap", protect, toggleGiftWrap);
router.delete("/", protect, clearCart);

export default router;
