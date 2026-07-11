import { useState, useEffect } from "react";
import { X, Upload, Trash2, Plus } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const MATERIALS = ["Gold", "Silver", "Platinum", "Rose Gold", "White Gold", "Diamond", "Other"];

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  discountPrice: "",
  material: "Gold",
  stone: "",
  sizes: "",
  colors: "",
  stock: "",
  sku: "",
  tags: "",
  isNewArrival: false,
  isBestSeller: false,
};

const ProductFormModal = ({ open, onClose, onSaved, product, categories, onCategoryAdded }) => {
  const [form, setForm] = useState(emptyForm);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        category: product.category?._id || product.category || "",
        price: product.price ?? "",
        discountPrice: product.discountPrice ?? "",
        material: product.material || "Gold",
        stone: product.stone || "",
        sizes: (product.sizes || []).join(", "),
        colors: (product.colors || []).join(", "),
        stock: product.stock ?? "",
        sku: product.sku || "",
        tags: (product.tags || []).join(", "),
        isNewArrival: !!product.isNewArrival,
        isBestSeller: !!product.isBestSeller,
      });
      setExistingImages(product.images || []);
    } else {
      setForm(emptyForm);
      setExistingImages([]);
    }
    setNewFiles([]);
    setPreviews([]);
    setError("");
  }, [product, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = async (imageId) => {
    if (!product?._id) return;
    try {
      await axiosInstance.delete(`/products/${product._id}/images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete image");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const res = await axiosInstance.post("/categories", { name: newCategoryName.trim() });
      onCategoryAdded(res.data);
      setForm((f) => ({ ...f, category: res.data._id }));
      setNewCategoryName("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add category");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.category || !form.price || form.stock === "") {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });
      newFiles.forEach((file) => fd.append("images", file));

      if (product) {
        await axiosInstance.put(`/products/${product._id}`, fd);
      } else {
        await axiosInstance.post("/products", fd);
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
      <div className="bg-white rounded-luxury w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-noir/10 sticky top-0 bg-white z-10">
          <h3 className="font-heading text-noir text-xl">{product ? "Edit Product" : "Add Product"}</h3>
          <button onClick={onClose} className="text-noir/50 hover:text-noir transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-[13px] font-body px-4 py-2.5 rounded-luxury">{error}</div>
          )}

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne bg-white"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className="flex gap-2 mt-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 px-3 py-2 rounded-luxury border border-noir/15 text-[12.5px] font-body focus:outline-none focus:border-champagne"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={addingCategory}
                  className="px-3 rounded-luxury bg-noir/5 hover:bg-noir/10 text-noir/70 transition-colors shrink-0"
                >
                  <Plus size={15} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Material</label>
              <select
                name="material"
                value={form.material}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne bg-white"
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Discount Price (₹)</label>
              <input
                type="number"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Stock *</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Stone</label>
              <input
                name="stone"
                value={form.stone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Sizes (comma separated)</label>
              <input
                name="sizes"
                value={form.sizes}
                onChange={handleChange}
                placeholder="e.g. 6, 7, 8"
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[12px] text-noir/60 font-body mb-1.5">Colors (comma separated)</label>
              <input
                name="colors"
                value={form.colors}
                onChange={handleChange}
                placeholder="e.g. Gold, Rose Gold"
                className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Tags (comma separated)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. wedding, everyday, gift"
              className="w-full px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-[13px] font-body text-noir/70">
              <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} />
              New Arrival
            </label>
            <label className="flex items-center gap-2 text-[13px] font-body text-noir/70">
              <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} />
              Best Seller
            </label>
          </div>

          <div>
            <label className="block text-[12px] text-noir/60 font-body mb-1.5">Images</label>

            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {existingImages.map((img) => (
                  <div key={img._id} className="relative w-16 h-16 shrink-0">
                    <img src={img.url} alt="" className="w-full h-full object-cover rounded-luxury" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img._id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <Trash2 size={10} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative w-16 h-16 shrink-0">
                    <img src={src} alt="" className="w-full h-full object-cover rounded-luxury" />
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <Trash2 size={10} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-2 px-4 py-2.5 rounded-luxury border border-dashed border-noir/25 text-[13px] font-body text-noir/60 cursor-pointer hover:border-champagne hover:text-champagne transition-colors w-fit">
              <Upload size={15} strokeWidth={1.5} />
              Upload Images
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
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
              {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;