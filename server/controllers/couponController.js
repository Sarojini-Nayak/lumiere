import Coupon from "../models/Coupon.js";

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expiresAt, minOrderValue, isActive } = req.body;

    const exists = await Coupon.findOne({ code: code?.toUpperCase() });
    if (exists) return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code,
      discountPercent,
      expiresAt,
      minOrderValue,
      isActive,
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    const { code, discountPercent, expiresAt, minOrderValue, isActive } = req.body;
    if (code) coupon.code = code;
    if (discountPercent !== undefined) coupon.discountPercent = discountPercent;
    if (expiresAt) coupon.expiresAt = expiresAt;
    if (minOrderValue !== undefined) coupon.minOrderValue = minOrderValue;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    await coupon.deleteOne();
    res.status(200).json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};