import express from "express";
import {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  addProductReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.get("/:slug/related", getRelatedProducts);

router.post("/", protect, admin, upload.array("images", 6), createProduct);
router.put("/:id", protect, admin, upload.array("images", 6), updateProduct);
router.delete("/:id/images/:imageId", protect, admin, deleteProductImage);
router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, addProductReview);

export default router;
