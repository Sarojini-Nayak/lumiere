import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public_id, for deletion later
      },
    ],
    video: {
      type: String,
      default: "",
    },
    material: {
      type: String,
      enum: ["Gold", "Silver", "Platinum", "Rose Gold", "White Gold", "Diamond", "Other"],
      default: "Gold",
    },
    stone: {
      type: String,
      default: "",
    },
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: "text", description: "text", tags: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
