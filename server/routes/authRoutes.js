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

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

export default router;
