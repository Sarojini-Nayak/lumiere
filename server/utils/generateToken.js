import jwt from "jsonwebtoken";

// Parses simple "Nd" / "Nh" / "Nm" expiry strings (e.g. "7d") into
// milliseconds for the cookie's maxAge. Falls back to 7 days if the format
// is ever something jsonwebtoken supports but this parser doesn't.
const parseExpiryToMs = (expiry) => {
  const match = /^(\d+)([smhd])$/.exec(expiry || "");
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const value = Number(match[1]);
  const unit = match[2];
  const unitMs = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return value * unitMs[unit];
};

// Signs a JWT and sets it as an httpOnly cookie on the response. The cookie
// is invisible to JS (mitigates XSS token theft) and is sent automatically
// by the browser on same-site or credentialed cross-site requests.
//
// sameSite: "none" + secure: true is required because the frontend
// (Vercel) and backend (Render) are on different domains - this only
// works over HTTPS, so it's gated behind NODE_ENV=production. In local
// dev, frontend and backend are both on localhost (different ports, but
// the same "site"), where sameSite: "lax" + secure: false works fine.
const generateToken = (res, id, role) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: parseExpiryToMs(process.env.JWT_EXPIRE),
  });
};

export default generateToken;
