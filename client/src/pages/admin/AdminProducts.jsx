import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Sparkles, Award } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PageHeader from "../../components/admin/PageHeader";
import ProductFormModal from "../../components/admin/ProductFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=100&auto=format&fit=crop";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data);
    } catch {
      // silent
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const res = await axiosInstance.get("/products", { params });
      setProducts(res.data.products);
      setPages(res.data.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/products/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      // silent, could add toast
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your catalog"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-luxury bg-noir text-ivory text-[13px] font-body hover:bg-noir/90 transition-colors"
          >
            <Plus size={15} strokeWidth={1.5} />
            Add Product
          </button>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noir/40" />
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body bg-white focus:outline-none focus:border-champagne"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setPage(1); setCategoryFilter(e.target.value); }}
          className="px-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body bg-white focus:outline-none focus:border-champagne"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-luxury overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-noir/10">
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Product</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Category</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Price</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Stock</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Flags</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-noir/40 text-[13px] font-body">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-noir/40 text-[13px] font-body">No products found.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b border-noir/5 last:border-0 hover:bg-noir/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || FALLBACK_IMG} alt={p.name} className="w-11 h-11 rounded-luxury object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-noir text-[13.5px] font-body truncate max-w-[220px]">{p.name}</p>
                        <p className="text-noir/40 text-[11.5px] font-body">{p.sku || "No SKU"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-noir/70 text-[13px] font-body">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3.5 text-[13px] font-body">
                    {p.discountPrice > 0 ? (
                      <div>
                        <span className="text-noir">₹{p.discountPrice.toLocaleString("en-IN")}</span>
                        <span className="text-noir/35 line-through ml-1.5 text-[11.5px]">₹{p.price.toLocaleString("en-IN")}</span>
                      </div>
                    ) : (
                      <span className="text-noir">₹{p.price.toLocaleString("en-IN")}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-body">
                    <span className={p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-champagne" : "text-noir/70"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {p.isNewArrival && <Sparkles size={13} strokeWidth={1.5} className="text-blue-400" />}
                      {p.isBestSeller && <Award size={13} strokeWidth={1.5} className="text-green-500" />}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-luxury flex items-center justify-center text-noir/50 hover:bg-noir/5 hover:text-noir transition-colors">
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 rounded-luxury flex items-center justify-center text-noir/50 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 rounded-luxury text-[12.5px] font-body transition-colors ${
                n === page ? "bg-noir text-ivory" : "bg-white text-noir/60 hover:bg-noir/5"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchProducts}
        product={editingProduct}
        categories={categories}
        onCategoryAdded={(cat) => setCategories((prev) => [...prev, cat])}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminProducts;