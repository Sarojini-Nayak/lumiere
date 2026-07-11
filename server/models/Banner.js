import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String },
    },
    ctaText: {
      type: String,
      default: "",
    },
    ctaLink: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      enum: ["hero", "promo-strip", "announcement"],
      default: "hero",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;