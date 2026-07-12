import express from "express";
import {
  registerUser,
  verifyOtp,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter, otpRequestLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", otpRequestLimiter, registerUser);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/login", authLimiter, loginUser);
router.get("/me", protect, getMe);
router.post("/forgot-password", otpRequestLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/google", googleLogin);

export default router;
