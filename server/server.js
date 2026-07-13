import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import sanitizeMiddleware from "./middleware/sanitizeMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";

// Render's outbound network can't route IPv6, but Gmail's SMTP host has both
// A and AAAA records — without this, Node sometimes picks the IPv6 address
// and every SMTP connection fails with ENETUNREACH. This forces IPv4 for
// every DNS lookup in the process (not just nodemailer's), which is the
// actual documented fix — nodemailer doesn't reliably honor a `family`
// option passed directly to it.
dns.setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// Render sits in front of the app as a reverse proxy — trust its single hop
// so express-rate-limit (and req.ip generally) sees the real client IP from
// X-Forwarded-For instead of Render's internal proxy IP.
app.set("trust proxy", 1);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeMiddleware);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Serve locally-stored product images (Cloudinary handles admin-uploaded
// images, but seeded/local images are read straight from this folder)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: "7d",
    immutable: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/cms", cmsRoutes);

app.get("/", (req, res) => {
  res.send("Lumiere API is running...");
});

// 404 handler — must come after every real route above
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler — catches anything thrown or passed to next(err)
// anywhere in the app, so the client always gets a clean JSON response
// instead of an unhandled crash or a raw stack trace.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on our end. Please try again.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
