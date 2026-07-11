import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const emptyForm = {
  code: "",
  discountPercent: "",
  expiresAt: "",
  minOrderValue: "",
  isActive: true,
};

const toDateInputValue = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 10);
};

const CouponFormModal = ({ open, onClose, onSaved, coupon }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code || "",
        discountPercent: coupon.discountPercent ?? "",
        expiresAt: toDateInputValue(coupon.expiresAt),
        minOrderValue: coupon.minOrderValue ?? "",
        isActive: coupon.isActive ?? true,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [coupon, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.code || !form.discountPercent || !form.expiresAt) {
      setError("Please fill in code, discount and expiry date.");
      return;
    }
    if (Number(form.discountPercent) < 1 || Number(form.discountPercent) > 100) {
      setError("Discount must be between 1 and 100.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discountPercent: Number(form.discountPercent),
        expiresAt: form.expiresAt,
        minOrderValue: Number(form.minOrderValue) || 0,
        isActive: form.isActive,
      };

      if (coupon) {
        await axiosInstance.put(`/coupons/${coupon._id}`, payload);
      } else {
        await axiosInstance.post("/coupons", payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-noir/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-luxury w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-noir/10">
          <h3 className="font-heading text-noir text-xl">{coupon ? "Edit Coupon" : "Add Coupon"}</h3>
          <button onClick={onClose} className="text-noir/50 hover:text-noir transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-[13px] font-body px-4 py-2.5 rounded-luxury">{error}</div>
          )}

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Coupon Code *</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. LUMIERE20"
              className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body uppercase focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Discount (%) *</label>
              <input
                type="number"
                name="discountPercent"
                value={form.discountPercent}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Min. Order (₹)</label>
              <input
                type="number"
                name="minOrderValue"
                value={form.minOrderValue}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Expires On *</label>
            <input
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
            />
          </div>

          <label className="flex items-center gap-2 text-[13px] font-body text-noir/70">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            Active
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-luxury text-[13px] font-body text-noir/60 hover:bg-noir/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-luxury text-[13px] font-body bg-noir text-ivory hover:bg-noir/90 transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : coupon ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal;
