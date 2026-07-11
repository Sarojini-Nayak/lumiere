import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

// Admin: user management
router.get("/", protect, admin, getAllUsers);
router.put("/:id/role", protect, admin, updateUserRole);
router.put("/:id/block", protect, admin, toggleBlockUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;