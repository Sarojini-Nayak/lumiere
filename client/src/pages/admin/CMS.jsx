import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PageHeader from "../../components/admin/PageHeader";
import BannerFormModal from "../../components/admin/BannerFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const TABS = [
  { key: "hero", label: "Hero Banners" },
  { key: "promo-strip", label: "Promo Strip" },
  { key: "announcement", label: "Announcement" },
];

const CMS = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("hero");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/cms/banners");
      setBanners(res.data);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const filtered = useMemo(
    () => banners.filter((b) => b.position === tab).sort((a, b) => a.order - b.order),
    [banners, tab]
  );

  const openAdd = () => {
    setEditingBanner(null);
    setModalOpen(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/cms/banners/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchBanners();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (banner) => {
    setTogglingId(banner._id);
    try {
      await axiosInstance.put(`/cms/banners/${banner._id}`, { isActive: !banner.isActive });
      setBanners((prev) =>
        prev.map((b) => (b._id === banner._id ? { ...b, isActive: !b.isActive } : b))
      );
    } catch {
      // silent
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="CMS / Banners"
        subtitle="Manage homepage banners and promo content"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-luxury bg-noir text-ivory text-[13px] font-body hover:bg-noir/90 transition-colors"
          >
            <Plus size={15} strokeWidth={1.5} />
            Add Banner
          </button>
        }
      />

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-luxury text-[12.5px] font-body transition-colors ${
              tab === t.key ? "bg-noir text-ivory" : "bg-white text-noir/60 hover:bg-noir/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-white rounded-luxury" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-luxury p-12 text-center">
          <ImageIcon size={28} strokeWidth={1.2} className="text-noir/20 mx-auto mb-3" />
          <p className="text-noir/50 text-[13.5px] font-body">No banners in this section yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <div key={b._id} className="bg-white rounded-luxury overflow-hidden">
              <div className="relative h-36">
                <img src={b.image?.url} alt={b.title} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-body uppercase tracking-wide ${
                    b.isActive ? "bg-green-100 text-green-700" : "bg-noir/10 text-noir/50"
                  }`}
                >
                  {b.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="p-5">
                <p className="font-heading text-noir text-[15px] truncate">{b.title}</p>
                {b.subtitle && <p className="text-noir/50 text-[12.5px] font-body mt-0.5 truncate">{b.subtitle}</p>}
                <p className="text-noir/35 text-[11.5px] font-body mt-1.5">Order: {b.order}</p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => toggleActive(b)}
                    disabled={togglingId === b._id}
                    className="flex-1 px-3 py-2 rounded-luxury text-[12.5px] font-body text-noir/60 hover:bg-noir/5 transition-colors disabled:opacity-50"
                  >
                    {b.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => openEdit(b)}
                    className="w-9 h-9 rounded-luxury flex items-center justify-center text-noir/50 hover:bg-noir/5 hover:text-noir transition-colors shrink-0"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(b)}
                    className="w-9 h-9 rounded-luxury flex items-center justify-center text-noir/50 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BannerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchBanners}
        banner={editingBanner}
        defaultPosition={tab}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Banner"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default CMS;
