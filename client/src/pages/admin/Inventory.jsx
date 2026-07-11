import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Check } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PageHeader from "../../components/admin/PageHeader";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=100&auto=format&fit=crop";
const LOW_STOCK_THRESHOLD = 5;

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | low | out
  const [edits, setEdits] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/products", { params: { limit: 1000, sort: "" } });
      setProducts(res.data.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    return products
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => {
        if (filter === "low") return p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
        if (filter === "out") return p.stock === 0;
        return true;
      })
      .sort((a, b) => a.stock - b.stock);
  }, [products, search, filter]);

  const handleStockChange = (id, value) => {
    setEdits((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (product) => {
    const newStock = edits[product._id];
    if (newStock === undefined || newStock === "" || Number(newStock) === product.stock) return;

    setSavingId(product._id);
    try {
      await axiosInstance.put(`/products/${product._id}`, { stock: Number(newStock) });
      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, stock: Number(newStock) } : p)));
      setEdits((prev) => {
        const next = { ...prev };
        delete next[product._id];
        return next;
      });
      setSavedId(product._id);
      setTimeout(() => setSavedId(null), 1500);
    } catch {
      // silent
    } finally {
      setSavingId(null);
    }
  };

  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
  const outCount = products.filter((p) => p.stock === 0).length;

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Stock levels across products" />

      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-luxury p-5">
          <p className="text-noir/50 text-[12px] uppercase tracking-wide font-body">Total Products</p>
          <p className="font-heading text-noir text-2xl mt-1.5">{products.length}</p>
        </div>
        <div className="bg-white rounded-luxury p-5">
          <p className="text-champagne text-[12px] uppercase tracking-wide font-body">Low Stock</p>
          <p className="font-heading text-noir text-2xl mt-1.5">{lowCount}</p>
        </div>
        <div className="bg-white rounded-luxury p-5">
          <p className="text-red-500 text-[12px] uppercase tracking-wide font-body">Out of Stock</p>
          <p className="font-heading text-noir text-2xl mt-1.5">{outCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noir/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body bg-white focus:outline-none focus:border-champagne"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "low", label: "Low Stock" },
            { key: "out", label: "Out of Stock" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2.5 rounded-luxury text-[13px] font-body transition-colors ${
                filter === f.key ? "bg-noir text-ivory" : "bg-white text-noir/60 hover:bg-noir/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-luxury overflow-x-auto">
        <table className="w-full min-w-[780px] text-left">
          <thead>
            <tr className="border-b border-noir/10">
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Product</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">SKU</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Status</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Stock</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body text-right">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-noir/40 text-[13px] font-body">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-noir/40 text-[13px] font-body">No products found.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} className="border-b border-noir/5 last:border-0 hover:bg-noir/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || FALLBACK_IMG} alt={p.name} className="w-11 h-11 rounded-luxury object-cover shrink-0" />
                      <p className="text-noir text-[13.5px] font-body truncate max-w-[220px]">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-noir/60 text-[13px] font-body">{p.sku || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-body uppercase tracking-wide ${
                        p.stock === 0
                          ? "bg-red-100 text-red-600"
                          : p.stock <= LOW_STOCK_THRESHOLD
                          ? "bg-champagne/20 text-champagne"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.stock === 0 ? "Out of Stock" : p.stock <= LOW_STOCK_THRESHOLD ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <input
                      type="number"
                      min="0"
                      value={edits[p._id] ?? p.stock}
                      onChange={(e) => handleStockChange(p._id, e.target.value)}
                      className="w-20 px-3 py-1.5 rounded-luxury border border-noir/15 text-[13px] font-body focus:outline-none focus:border-champagne"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleSave(p)}
                      disabled={savingId === p._id || edits[p._id] === undefined || Number(edits[p._id]) === p.stock}
                      className="px-4 py-1.5 rounded-luxury text-[12.5px] font-body bg-noir text-ivory hover:bg-noir/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                    >
                      {savedId === p._id ? <Check size={13} strokeWidth={2} /> : savingId === p._id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
