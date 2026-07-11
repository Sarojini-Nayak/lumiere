import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin, Truck, CreditCard, ClipboardCheck, Banknote } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { clearCartState } from "../redux/slices/cartSlice";

const steps = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Shipping", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Review", icon: ClipboardCheck },
];

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart);

  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (cart.items.length === 0) {
      navigate("/cart");
    }
  }, [user, cart.items.length, navigate]);

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = cart.coupon?.discountPercent ? (subtotal * cart.coupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const giftWrapFee = cart.giftWrap ? 99 : 0;
  const codFee = paymentMethod === "cod" ? 49 : 0;
  const total = subtotal - discount + shipping + giftWrapFee + codFee;

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const isAddressValid =
    address.fullName && address.phone && address.addressLine1 && address.city && address.state && address.postalCode;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setError("");
    try {
      const orderRes = await axiosInstance.post("/orders", {
        shippingAddress: address,
        paymentMethod,
      });
      const order = orderRes.data;

      if (paymentMethod === "cod") {
        await axiosInstance.post("/orders/cod-confirm", { orderId: order._id });
        dispatch(clearCartState());
        navigate(`/order-success?orderId=${order._id}`);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Unable to load payment gateway. Please check your connection.");
        setProcessing(false);
        return;
      }

      const rpOrderRes = await axiosInstance.post("/orders/razorpay-order", { orderId: order._id });
      const { razorpayOrderId, amount, currency, keyId } = rpOrderRes.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Lumière",
        description: "Fine Jewelry Purchase",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await axiosInstance.post("/orders/razorpay-verify", {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(clearCartState());
            navigate(`/order-success?orderId=${order._id}`);
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: user.email,
        },
        theme: { color: "#C8A96A" },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  if (!user || cart.items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-24 min-h-screen">
      <h1 className="font-heading text-noir text-3xl md:text-4xl mb-10">Checkout</h1>

      <div className="flex items-center justify-between max-w-xl mb-14">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                  step > s.id
                    ? "bg-champagne border-champagne text-noir"
                    : step === s.id
                    ? "border-noir text-noir"
                    : "border-noir/20 text-noir/30"
                }`}
              >
                {step > s.id ? <Check size={16} strokeWidth={2} /> : <s.icon size={16} strokeWidth={1.5} />}
              </div>
              <span className={`text-[11px] font-body uppercase tracking-wide ${step >= s.id ? "text-noir" : "text-noir/30"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mx-2 mb-5 ${step > s.id ? "bg-champagne" : "bg-noir/15"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
        <div>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-heading text-noir text-xl mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleAddressChange} className="border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne" />
                  <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleAddressChange} className="border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne" />
                  <input name="addressLine1" placeholder="Address Line 1" value={address.addressLine1} onChange={handleAddressChange} className="md:col-span-2 border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne" />
                  <input name="addressLine2" placeholder="Address Line 2 (optional)" value={address.addressLine2} onChange={handleAddressChange} className="md:col-span-2 border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne" />
                  <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} className="border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne" />
                  <input name="state" placeholder="State" value={address.state} onChange={handleAddressChange} className="border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne" />
                  <input name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleAddressChange} className="border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne" />
                  <input name="country" value={address.country} disabled className="border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body bg-noir/5 text-noir/50" />
                </div>
                <button
                  onClick={goNext}
                  disabled={!isAddressValid}
                  className="mt-8 bg-noir text-ivory px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors disabled:opacity-40"
                >
                  Continue to Shipping
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-heading text-noir text-xl mb-6">Shipping Method</h2>
                <div className="border border-champagne bg-champagne/5 rounded-luxury p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Truck size={20} strokeWidth={1.5} className="text-champagne" />
                    <div>
                      <p className="font-body text-noir text-[14px]">Standard Shipping</p>
                      <p className="font-body text-noir/50 text-[12px]">3-5 business days</p>
                    </div>
                  </div>
                  <span className="font-body text-noir text-[14px]">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={goBack} className="border border-noir/20 text-noir px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:border-noir/50 transition-colors">
                    Back
                  </button>
                  <button onClick={goNext} className="bg-noir text-ivory px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors">
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-heading text-noir text-xl mb-6">Payment Method</h2>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`text-left border rounded-luxury p-5 flex items-center gap-4 transition-colors ${
                      paymentMethod === "razorpay" ? "border-champagne bg-champagne/5" : "border-noir/15"
                    }`}
                  >
                    <CreditCard size={20} strokeWidth={1.5} className={paymentMethod === "razorpay" ? "text-champagne" : "text-noir/40"} />
                    <div className="flex-1">
                      <p className="font-body text-noir text-[14px]">Online Payment</p>
                      <p className="font-body text-noir/50 text-[12px]">Cards, UPI, Netbanking & Wallets — Secured by Razorpay</p>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === "razorpay" ? "border-champagne" : "border-noir/25"
                      }`}
                    >
                      {paymentMethod === "razorpay" && <span className="w-2.5 h-2.5 bg-champagne rounded-full" />}
                    </span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`text-left border rounded-luxury p-5 flex items-center gap-4 transition-colors ${
                      paymentMethod === "cod" ? "border-champagne bg-champagne/5" : "border-noir/15"
                    }`}
                  >
                    <Banknote size={20} strokeWidth={1.5} className={paymentMethod === "cod" ? "text-champagne" : "text-noir/40"} />
                    <div className="flex-1">
                      <p className="font-body text-noir text-[14px]">Cash on Delivery</p>
                      <p className="font-body text-noir/50 text-[12px]">Pay in cash when your order arrives — ₹49 handling fee</p>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === "cod" ? "border-champagne" : "border-noir/25"
                      }`}
                    >
                      {paymentMethod === "cod" && <span className="w-2.5 h-2.5 bg-champagne rounded-full" />}
                    </span>
                  </button>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={goBack} className="border border-noir/20 text-noir px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:border-noir/50 transition-colors">
                    Back
                  </button>
                  <button onClick={goNext} className="bg-noir text-ivory px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors">
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-heading text-noir text-xl mb-6">Review Your Order</h2>

                <div className="bg-white rounded-luxury p-5 mb-5">
                  <p className="font-body text-noir/40 text-[11px] uppercase tracking-wide mb-2">Shipping To</p>
                  <p className="font-body text-noir text-[14px]">{address.fullName}</p>
                  <p className="font-body text-noir/60 text-[13px]">
                    {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="font-body text-noir/60 text-[13px] mt-1">{address.phone}</p>
                </div>

                <div className="bg-white rounded-luxury p-5 mb-5 flex items-center gap-3">
                  {paymentMethod === "cod" ? (
                    <Banknote size={18} strokeWidth={1.5} className="text-champagne" />
                  ) : (
                    <CreditCard size={18} strokeWidth={1.5} className="text-champagne" />
                  )}
                  <span className="font-body text-noir text-[13.5px]">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment via Razorpay"}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex gap-4 bg-white rounded-luxury p-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-luxury object-cover" />
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-body text-noir text-[13.5px]">{item.name}</p>
                        <p className="font-body text-noir/40 text-[12px]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-body text-noir text-[14px] self-center">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {error && <p className="text-red-500 text-[13px] font-body mt-5">{error}</p>}

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={goBack}
                    disabled={processing}
                    className="border border-noir/20 text-noir px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:border-noir/50 transition-colors disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="flex-1 bg-champagne text-noir px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-champagne/90 transition-colors disabled:opacity-60"
                  >
                    {processing
                      ? "Processing..."
                      : paymentMethod === "cod"
                      ? `Place Order — ₹${total.toLocaleString("en-IN")}`
                      : `Pay ₹${total.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white rounded-luxury p-6 h-fit sticky top-28">
          <h3 className="font-heading text-noir text-lg mb-5">Order Summary</h3>
          <div className="flex flex-col gap-2.5 text-[13.5px] font-body text-noir/60">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-champagne">
                <span>Discount</span>
                <span>-₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            {giftWrapFee > 0 && (
              <div className="flex justify-between">
                <span>Gift Wrap</span>
                <span>₹{giftWrapFee}</span>
              </div>
            )}
            {codFee > 0 && (
              <div className="flex justify-between">
                <span>COD Handling Fee</span>
                <span>₹{codFee}</span>
              </div>
            )}
          </div>
          <div className="border-t border-noir/10 mt-4 pt-4 flex justify-between">
            <span className="font-body text-noir text-[14px]">Total</span>
            <span className="font-heading text-noir text-xl">₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
