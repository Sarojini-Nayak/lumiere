import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.status(200).json({
      message: "Profile updated",
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google Sign-In and has no password to change." });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(user.addresses);
};

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const newAddress = req.body;

    if (newAddress.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    if (user.addresses.length === 0) newAddress.isDefault = true;

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    Object.assign(address, req.body);
    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===== Admin: User Management =====

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (user._id.toString() === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({ message: "You cannot remove your own admin access" });
    }

    user.role = role;
    await user.save();
    res.status(200).json({ message: "Role updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.status(200).json({ message: user.isBlocked ? "User blocked" : "User unblocked", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};