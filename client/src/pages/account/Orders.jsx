import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const statusColors = {
  Processing: "bg-noir/10 text-noir/70",
  Confirmed: "bg-champagne/20 text-champagne",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-luxury" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-luxury p-10 text-center">
        <Package size={32} strokeWidth={1} className="text-champagne mx-auto mb-4" />
        <p className="font-heading text-noir text-lg">No orders yet</p>
        <p className="font-body text-noir/50 text-[13px] mt-2">Your order history will appear here.</p>
        <Link to="/shop" className="inline-block mt-5 text-champagne text-[13px] font-body underline underline-offset-4">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order._id} className="bg-white rounded-luxury p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="font-body text-noir text-[13.5px]">Order #{order._id.slice(-8)}</p>
              <p className="font-body text-noir/40 text-[12px] mt-0.5">
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-body uppercase tracking-wide ${statusColors[order.orderStatus] || "bg-noir/10 text-noir/60"}`}>
              {order.orderStatus}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {order.items.map((item, i) => (
              <img
                key={i}
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-luxury object-cover shrink-0"
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-noir/10">
            <span className="font-body text-noir/50 text-[12px]">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </span>
            <span className="font-heading text-noir text-lg">₹{order.totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
