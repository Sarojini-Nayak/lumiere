# Lumière — Fine Jewelry E-Commerce

A full-stack luxury jewelry e-commerce platform built on the MERN stack, with a premium editorial design, admin dashboard, and end-to-end shopping flow.

**Live demo:** _add your deployed link here_

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS 4
- Framer Motion
- React Router
- Redux Toolkit
- Axios
- React Hook Form + Zod

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication + Google OAuth
- Cloudinary (image storage)
- Stripe + Razorpay (payments)
- Nodemailer (OTP / transactional email)

## Features

- Product catalog with filters (category, material, price), sorting, grid/list view, and pagination
- Product detail page with image zoom, 360° toggle, size/quantity selection, reviews, and FAQ accordion
- Cart with coupon codes, gift wrap, and shipping calculation
- Multi-step checkout with Razorpay, Stripe, and Cash on Delivery
- JWT auth with email OTP verification, Google login, and password reset
- User account dashboard — profile, orders, addresses, settings
- Admin dashboard — sales analytics, orders, products, inventory, coupons, CMS, and user management
- Wishlist synced to the logged-in user's account

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or Atlas)
- Cloudinary, Stripe, and Razorpay accounts for full functionality (optional for local browsing)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd lumiere

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env` with the following:

### 3. Seed the database

```bash
cd server
node seedCategories.js
node seedProducts.js
```

### 4. Run the app

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

The client runs at `http://localhost:5173`, the API at `http://localhost:5000/api`.

### Build for production

```bash
cd client
npm run build
```

## Project Structure
## Author

Built by Sarojini — [GitHub](#) · [LinkedIn](#)
