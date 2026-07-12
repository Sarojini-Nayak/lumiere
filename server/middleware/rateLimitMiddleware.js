import rateLimit from "express-rate-limit";

// Throttles login, OTP verification, and password-reset attempts per IP —
// these are the endpoints an attacker would brute-force to guess a
// password or a 6-digit OTP.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

// Throttles endpoints that trigger sending an OTP email (register, forgot
// password), so the same IP can't spam someone's inbox or run up email costs.
export const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again in a few minutes." },
});
