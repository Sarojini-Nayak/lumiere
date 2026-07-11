import { useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const PAYMENT_LABELS = {
  stripe: "Card (Stripe)",
  razorpay: "Razorpay",
  cod: "Cash on Delivery",
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=100&auto=format&fit=crop";

const OrderDetailModal = ({ order, onClose, onUpdated }) => {
  const [status, setStatus] = useState(order?.orderStatus || "Processing");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!order) return null;

  const handleSave = async () => {
    if (status === order.orderStatus) return;
    setSaving(true);
    setError("");
    try {
      const res = await axiosInstance.put(`/orders/${order._id}/status`, { status });
      onUpdated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    } finally {
      setSaving(false);
    }
  };

  const addr = order.shippingAddress || {};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-noir/50 backdrop-blur-sm px-4 py-8">
      <div className="bg-white rounded-luxury w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-noir/10 sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-heading text-noir text-xl">Order #{order._id.slice(-8).toUpperCase()}</h3>
            <p className="text-noir/40 text-[12px] font-body mt-0.5">
              {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
          <button onClick={onClose} className="text-noir/50 hover:text-noir transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-[13px] font-body px-4 py-2.5 rounded-luxury">{error}</div>
          )}

          {/* Customer & Payment */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-noir/40 font-body mb-1.5">Customer</p>
              <p className="text-noir text-[13.5px] font-body">{order.user?.name || "Guest"}</p>
              <p className="text-noir/50 text-[12.5px] font-body">{order.user?.email}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-noir/40 font-body mb-1.5">Payment</p>
              <p className="text-noir text-[13.5px] font-body">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-body ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <p className="text-[11px] uppercase tracking-wide text-noir/40 font-body mb-1.5">Shipping Address</p>
            <p className="text-noir/70 text-[13px] font-body leading-relaxed">
              {addr.fullName}<br />
              {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}<br />
              {addr.city}, {addr.state} {addr.postalCode}<br />
              {addr.country} · {addr.phone}
            </p>
          </div>

          {/* Items */}
          <div>
            <p className="text-[11px] uppercase tracking-wide text-noir/40 font-body mb-2.5">Items ({order.items.length})</p>
            <div className="flex flex-col gap-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img src={item.image || FALLBACK_IMG} alt={item.name} className="w-12 h-12 rounded-luxury object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-noir text-[13px] font-body truncate">{item.name}</p>
                    <p className="text-noir/40 text-[11.5px] font-body">
                      {[item.size, item.color].filter(Boolean).join(" · ") || "—"} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-noir text-[13px] font-body shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-noir/10 pt-4 space-y-1.5">
            <div className="flex justify-between text-[13px] font-body text-noir/60">
              <span>Items</span>
              <span>₹{order.itemsPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[13px] font-body text-noir/60">
              <span>Shipping</span>
              <span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice.toLocaleString("en-IN")}`}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[13px] font-body text-champagne">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>-₹{order.discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            {order.giftWrap && (
              <div className="flex justify-between text-[13px] font-body text-noir/60">
                <span>Gift Wrap</span>
                <span>₹{order.giftWrapFee.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-[15px] font-heading text-noir pt-2 border-t border-noir/10 mt-2">
              <span>Total</span>
              <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t border-noir/10 pt-5">
            <p className="text-[11px] uppercase tracking-wide text-noir/40 font-body mb-2.5">Order Status</p>
            <div className="flex items-center gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body bg-white focus:outline-none focus:border-champagne"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <StatusBadge status={order.orderStatus} />
            </div>
            <button
              onClick={handleSave}
              disabled={saving || status === order.orderStatus}
              className="w-full mt-4 px-5 py-2.5 rounded-luxury text-[13px] font-body bg-noir text-ivory hover:bg-noir/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
