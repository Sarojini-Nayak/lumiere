import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ComingSoon from "./components/ComingSoon";
import ErrorBoundary from "./components/ErrorBoundary";
import AccountLayout from "./layouts/AccountLayout";
const Home = lazy(() => import("./pages/Home"));
const ProductListing = lazy(() => import("./pages/ProductListing"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Profile = lazy(() => import("./pages/account/Profile"));
const Orders = lazy(() => import("./pages/account/Orders"));
const Addresses = lazy(() => import("./pages/account/Addresses"));
const Settings = lazy(() => import("./pages/account/Settings"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Coupons = lazy(() => import("./pages/admin/Coupons"));
const CMS = lazy(() => import("./pages/admin/CMS"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const Craftsmanship = lazy(() => import("./pages/Craftsmanship"));
import axiosInstance from "./utils/axiosInstance";
import { setWishlistIds, clearWishlistState } from "./redux/slices/wishlistSlice";
import { setCart, clearCartState } from "./redux/slices/cartSlice";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      axiosInstance
        .get("/wishlist")
        .then((res) => {
          dispatch(setWishlistIds(res.data.map((p) => p._id)));
        })
        .catch(() => {});

      axiosInstance
        .get("/cart")
        .then((res) => {
          dispatch(setCart(res.data));
        })
        .catch(() => {});
    } else {
      dispatch(clearWishlistState());
      dispatch(clearCartState());
    }
  }, [user, dispatch]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-ivory">
      {!isAdminRoute && <Navbar />}
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductListing />} />
          <Route path="/category/:categorySlug" element={<ProductListing />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="cms" element={<CMS />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route path="/craftsmanship" element={<Craftsmanship />} />
          <Route path="*" element={<ComingSoon title="Page Not Found" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
