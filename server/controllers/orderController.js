import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper: calculate order totals from cart
const calculateTotals = (cart) => {
  const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 150;
  const discountAmount = cart.coupon?.discountPercent
    ? (itemsPrice * cart.coupon.discountPercent) / 100
    : 0;
  const giftWrapFee = cart.giftWrap ? 99 : 0;
  const totalPrice = itemsPrice + shippingPrice + giftWrapFee - discountAmount;

  return { itemsPrice, shippingPrice, discountAmount, giftWrapFee, totalPrice };
};

// @desc Create a new order (before payment confirmation)
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totals = calculateTotals(cart);

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      couponCode: cart.coupon?.code || null,
      giftWrap: cart.giftWrap,
      ...totals,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create Stripe checkout session
export const createStripeSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/order-success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: { orderId: order._id.toString() },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify Razorpay payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = "Confirmed";
    order.paymentResult = {
      id: razorpay_payment_id,
      status: "success",
      updateTime: new Date().toISOString(),
    };

    await order.save();

    // Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear the user's cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: {}, giftWrap: false });

    res.status(200).json({ message: "Payment verified", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Confirm Stripe payment (called from success page after redirect)
export const confirmStripePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.orderStatus = "Confirmed";
      order.paymentResult = {
        status: "success",
        updateTime: new Date().toISOString(),
      };
      await order.save();

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }

      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], coupon: {}, giftWrap: false }
      );
    }

    res.status(200).json({ message: "Payment confirmed", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Confirm Cash on Delivery order
export const confirmCodOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = "Confirmed";
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    await Cart.findOneAndUpdate(
      { user: order.user },
      { items: [], coupon: {}, giftWrap: false }
    );

    res.status(200).json({ message: "Order confirmed via Cash on Delivery", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
