import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Ticket } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PageHeader from "../../components/admin/PageHeader";
import CouponFormModal from "../../components/admin/CouponFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/coupons");
      setCoupons(res.data);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openAdd = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/coupons/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchCoupons();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle="Manage discount codes"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-luxury bg-noir text-ivory text-[13px] font-body hover:bg-noir/90 transition-colors"
          >
            <Plus size={15} strokeWidth={1.5} />
            Add Coupon
          </button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-white rounded-luxury" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-luxury p-12 text-center">
          <Ticket size={28} strokeWidth={1.2} className="text-noir/20 mx-auto mb-3" />
          <p className="text-noir/50 text-[13.5px] font-body">No coupons yet. Create your first discount code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coupons.map((c) => {
            const expired = isExpired(c.expiresAt);
            return (
              <div key={c._id} className="bg-white rounded-luxury p-6 relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-heading text-noir text-xl tracking-wide">{c.code}</p>
                    <p className="text-champagne text-[13px] font-body mt-0.5">{c.discountPercent}% off</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-body uppercase tracking-wide ${
                      !c.isActive
                        ? "bg-noir/10 text-noir/50"
                        : expired
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {!c.isActive ? "Disabled" : expired ? "Expired" : "Active"}
                  </span>
                </div>

                <div className="space-y-1 text-[12.5px] font-body text-noir/60 mb-5">
                  <p>Min. order: ₹{(c.minOrderValue || 0).toLocaleString("en-IN")}</p>
                  <p>Expires: {new Date(c.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-luxury text-[12.5px] font-body text-noir/60 hover:bg-noir/5 transition-colors"
                  >
                    <Pencil size={13} strokeWidth={1.5} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-luxury text-[12.5px] font-body text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CouponFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchCoupons}
        coupon={editingCoupon}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Coupon"
        message={`Are you sure you want to delete "${deleteTarget?.code}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Coupons;
