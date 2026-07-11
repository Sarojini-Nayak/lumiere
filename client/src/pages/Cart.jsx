import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, Gift, Tag, ShoppingBag } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { setCart, clearCartState } from "../redux/slices/cartSlice";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      dispatch(setCart(res.data));
    } catch (err) {
      // not logged in or no cart yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    setUpdating(true);
    try {
      const res = await axiosInstance.put(`/cart/item/${itemId}`, { quantity });
      dispatch(setCart(res.data));
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(true);
    try {
      const res = await axiosInstance.delete(`/cart/item/${itemId}`);
      dispatch(setCart(res.data));
    } finally {
      setUpdating(false);
    }
  };

  const toggleGiftWrap = async () => {
    setUpdating(true);
    try {
      const res = await axiosInstance.post("/cart/gift-wrap");
      dispatch(setCart(res.data));
    } finally {
      setUpdating(false);
    }
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    setCouponMsg(null);
    try {
      const res = await axiosInstance.post("/cart/coupon", { code: couponCode });
      dispatch(setCart(res.data));
      setCouponMsg({ type: "success", text: `Coupon "${res.data.coupon.code}" applied.` });
    } catch (err) {
      setCouponMsg({ type: "error", text: err.response?.data?.message || "Invalid coupon." });
    }
  };

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = cart.coupon?.discountPercent ? (subtotal * cart.coupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const giftWrapFee = cart.giftWrap ? 99 : 0;
  const total = subtotal - discount + shipping + giftWrapFee;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center">
        <ShoppingBag size={40} strokeWidth={1} className="text-champagne mb-6" />
        <h1 className="font-heading text-noir text-3xl">Your Bag Awaits</h1>
        <p className="font-body text-noir/50 text-sm mt-3 max-w-sm">
          Sign in to view your bag and continue shopping.
        </p>
        <Link
          to="/login"
          className="mt-8 bg-noir text-ivory px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 min-h-screen animate-pulse">
        <div className="h-8 bg-noir/10 rounded w-1/4 mb-10" />
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-noir/10 rounded-luxury" />
          ))}
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center">
        <ShoppingBag size={40} strokeWidth={1} className="text-champagne mb-6" />
        <h1 className="font-heading text-noir text-3xl">Your Bag is Empty</h1>
        <p className="font-body text-noir/50 text-sm mt-3 max-w-sm">
          Discover pieces crafted to be worn, cherished, and passed down.
        </p>
        <Link
          to="/shop"
          className="mt-8 bg-noir text-ivory px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-24 min-h-screen">
      <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">Your Bag</span>
      <h1 className="font-heading text-noir text-3xl md:text-4xl mt-3 mb-10">
        {cart.items.length} {cart.items.length === 1 ? "Piece" : "Pieces"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
        <div className="flex flex-col gap-5">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-5 bg-white rounded-luxury p-4"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-luxury overflow-hidden">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-heading text-noir text-[16px] md:text-[17px]">{item.name}</p>
                      <p className="font-body text-noir/40 text-[12px] mt-1">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " • "}
                        {item.color}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      aria-label="Remove item"
                      className="text-noir/30 hover:text-noir transition-colors shrink-0"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 border border-noir/15 rounded-luxury">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={updating}
                        className="w-8 h-8 flex items-center justify-center text-noir/60 hover:text-noir"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} strokeWidth={1.5} />
                      </button>
                      <span className="font-body text-noir text-[13px] w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={updating}
                        className="w-8 h-8 flex items-center justify-center text-noir/60 hover:text-noir"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                    <span className="font-body text-noir text-[15px]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={toggleGiftWrap}
            className={`flex items-center gap-3 border rounded-luxury p-4 mt-2 transition-colors ${
              cart.giftWrap ? "border-champagne bg-champagne/5" : "border-noir/15"
            }`}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                cart.giftWrap ? "bg-champagne text-noir" : "bg-noir/5 text-noir/50"
              }`}
            >
              <Gift size={16} strokeWidth={1.5} />
            </span>
            <div className="text-left">
              <p className="font-body text-noir text-[13px]">Add Gift Wrap</p>
              <p className="font-body text-noir/40 text-[12px]">Signature Lumière box & ribbon — ₹99</p>
            </div>
            <span
              className={`ml-auto w-5 h-5 rounded border flex items-center justify-center ${
                cart.giftWrap ? "bg-champagne border-champagne" : "border-noir/25"
              }`}
            >
              {cart.giftWrap && <span className="w-2 h-2 bg-noir rounded-sm" />}
            </span>
          </button>
        </div>

        <div className="bg-white rounded-luxury p-6 md:p-7 h-fit sticky top-28">
          <h2 className="font-heading text-noir text-xl mb-6">Order Summary</h2>

          <form onSubmit={applyCoupon} className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Tag size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-noir/30" />
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-noir/15 rounded-luxury text-[13px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-noir text-ivory rounded-luxury text-[12px] tracking-wide uppercase font-body hover:bg-noir/90 transition-colors"
            >
              Apply
            </button>
          </form>
          {couponMsg && (
            <p className={`text-[12px] font-body mb-5 -mt-3 ${couponMsg.type === "success" ? "text-champagne" : "text-red-500"}`}>
              {couponMsg.text}
            </p>
          )}

          <div className="flex flex-col gap-3 text-[13.5px] font-body">
            <div className="flex justify-between text-noir/60">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-champagne">
                <span>Discount ({cart.coupon.discountPercent}%)</span>
                <span>-₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-noir/60">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            {giftWrapFee > 0 && (
              <div className="flex justify-between text-noir/60">
                <span>Gift Wrap</span>
                <span>₹{giftWrapFee}</span>
              </div>
            )}
          </div>

          <div className="border-t border-noir/10 mt-5 pt-5 flex justify-between items-center">
            <span className="font-body text-noir text-[15px]">Total</span>
            <span className="font-heading text-noir text-xl">₹{total.toLocaleString("en-IN")}</span>
          </div>

          {subtotal < 5000 && (
            <p className="text-noir/40 text-[11.5px] font-body mt-3">
              Add ₹{(5000 - subtotal).toLocaleString("en-IN")} more for free shipping.
            </p>
          )}

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 bg-champagne text-noir py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-champagne/90 transition-colors"
          >
            Proceed to Checkout
          </button>
          <Link
            to="/shop"
            className="block text-center text-noir/50 text-[13px] font-body mt-4 hover:text-noir underline underline-offset-4"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
