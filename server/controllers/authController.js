import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires,
    });

    try {
      await sendEmail(
        email,
        "Verify your Lumière account",
        `<h2>Welcome to Lumière</h2><p>Your OTP is: <b>${otp}</b></p><p>This code expires in 10 minutes.</p>`
      );
    } catch (emailErr) {
      console.log("Email sending failed:", emailErr.message);
    }

    res.status(201).json({
      message: "Registered successfully. Please verify OTP sent to your email.",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Account verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please login using Google" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account via OTP first" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Contact support." });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user profile
export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

// @desc Forgot Password - send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail(
        email,
        "Reset your Lumière password",
        `<h2>Password Reset</h2><p>Your OTP is: <b>${otp}</b></p><p>This code expires in 10 minutes.</p>`
      );
    } catch (emailErr) {
      console.log("Email sending failed:", emailErr.message);
    }

    res.status(200).json({
      message: "OTP sent to your email",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reset Password using OTP
export const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful. Please login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Google Login/Register
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        isVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.isVerified = true;
      if (!user.avatar) user.avatar = picture;
      await user.save();
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Contact support." });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
};
