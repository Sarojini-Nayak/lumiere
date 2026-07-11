import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  image: String,
  price: Number,
  size: String,
  color: String,
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    coupon: {
      code: { type: String, default: null },
      discountPercent: { type: Number, default: 0 },
    },
    giftWrap: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
