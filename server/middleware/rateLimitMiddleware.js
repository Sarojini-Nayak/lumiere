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

// Generous general-purpose limiter for all other API routes - just enough to
// blunt bot/scraper traffic without affecting normal browsing.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
