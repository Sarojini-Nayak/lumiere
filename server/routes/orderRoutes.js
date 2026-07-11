import express from "express";
import {
  createOrder,
  createStripeSession,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  confirmStripePayment,
  confirmCodOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/stripe-session", protect, createStripeSession);
router.post("/razorpay-order", protect, createRazorpayOrder);
router.post("/razorpay-verify", protect, verifyRazorpayPayment);
router.get("/my-orders", protect, getMyOrders);
router.get("/all", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.post("/stripe-confirm", protect, confirmStripePayment);
router.post("/cod-confirm", protect, confirmCodOrder);

export default router;
