import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const POSITIONS = [
  { value: "hero", label: "Hero" },
  { value: "promo-strip", label: "Promo Strip" },
  { value: "announcement", label: "Announcement" },
];

const emptyForm = {
  title: "",
  subtitle: "",
  ctaText: "",
  ctaLink: "",
  position: "hero",
  order: 0,
  isActive: true,
  startDate: "",
  endDate: "",
};

const toDateInputValue = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 10);
};

const BannerFormModal = ({ open, onClose, onSaved, banner, defaultPosition }) => {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        ctaText: banner.ctaText || "",
        ctaLink: banner.ctaLink || "",
        position: banner.position || "hero",
        order: banner.order ?? 0,
        isActive: banner.isActive ?? true,
        startDate: toDateInputValue(banner.startDate),
        endDate: toDateInputValue(banner.endDate),
      });
      setPreview(banner.image?.url || "");
    } else {
      setForm({ ...emptyForm, position: defaultPosition || "hero" });
      setPreview("");
    }
    setFile(null);
    setError("");
  }, [banner, open, defaultPosition]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title) {
      setError("Title is required.");
      return;
    }
    if (!banner && !file) {
      setError("Please upload a banner image.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (file) fd.append("image", file);

      if (banner) {
        await axiosInstance.put(`/cms/banners/${banner._id}`, fd);
      } else {
        await axiosInstance.post("/cms/banners", fd);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-noir/50 backdrop-blur-sm px-4 py-8">
      <div className="bg-white rounded-luxury w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-noir/10 sticky top-0 bg-white z-10">
          <h3 className="font-heading text-noir text-xl">{banner ? "Edit Banner" : "Add Banner"}</h3>
          <button onClick={onClose} className="text-noir/50 hover:text-noir transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-[13px] font-body px-4 py-2.5 rounded-luxury">{error}</div>
          )}

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Subtitle</label>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">CTA Text</label>
              <input
                name="ctaText"
                value={form.ctaText}
                onChange={handleChange}
                placeholder="e.g. Shop Now"
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">CTA Link</label>
              <input
                name="ctaLink"
                value={form.ctaLink}
                onChange={handleChange}
                placeholder="/collections/new"
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Position</label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body bg-white focus:outline-none focus:border-champagne"
              >
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Display Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[13px] font-body text-noir/70">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            Active
          </label>

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Banner Image {!banner && "*"}</label>
            {preview && (
              <img src={preview} alt="" className="w-full h-32 object-cover rounded-luxury mb-3" />
            )}
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-luxury border border-dashed border-noir/25 text-[13px] font-body text-noir/60 cursor-pointer hover:border-champagne hover:text-champagne transition-colors w-fit">
              <Upload size={15} strokeWidth={1.5} />
              {preview ? "Replace Image" : "Upload Image"}
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>

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
              {saving ? "Saving..." : banner ? "Save Changes" : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerFormModal;
