import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Package } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      axiosInstance.get(`/orders/${orderId}`).then((res) => setOrder(res.data)).catch(() => {});
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-full bg-champagne flex items-center justify-center mb-6"
      >
        <Check size={28} strokeWidth={2} className="text-noir" />
      </motion.div>

      <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">Order Confirmed</span>
      <h1 className="font-heading text-noir text-3xl md:text-4xl mt-4">Thank You{order ? `, ${order.shippingAddress?.fullName?.split(" ")[0]}` : ""}</h1>
      <p className="font-body text-noir/60 text-[14px] mt-4 max-w-md">
        Your order has been placed and a confirmation has been sent to your email.
        Every Lumière piece is inspected by hand before it leaves our atelier.
      </p>

      {order && (
        <div className="bg-white rounded-luxury p-6 mt-8 max-w-sm w-full text-left">
          <div className="flex items-center gap-2 mb-4 text-noir/50">
            <Package size={16} strokeWidth={1.5} />
            <span className="font-body text-[12px] uppercase tracking-wide">Order #{order._id.slice(-8)}</span>
          </div>
          <div className="flex justify-between font-body text-[14px] text-noir">
            <span>Total Paid</span>
            <span>₹{order.totalPrice?.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-10">
        <Link to="/account/orders" className="border border-noir/20 text-noir px-7 py-3 rounded-luxury text-[13px] tracking-[0.1em] uppercase font-body hover:border-noir/50 transition-colors">
          View Orders
        </Link>
        <Link to="/shop" className="bg-noir text-ivory px-7 py-3 rounded-luxury text-[13px] tracking-[0.1em] uppercase font-body hover:bg-noir/90 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
