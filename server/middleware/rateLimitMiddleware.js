import rateLimit from "express-rate-limit";

// Throttles login, registration, and other auth attempts per IP — these are
// the endpoints an attacker would brute-force to guess a password or spam
// account creation.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});
