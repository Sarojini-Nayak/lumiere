import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop";

const SearchOverlay = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      axiosInstance
        .get("/products", { params: { search: query, limit: 6 } })
        .then((res) => setResults(res.data.products || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleViewAll = () => {
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleViewAll();
  };

  const goToProduct = (slug) => {
    navigate(`/product/${slug}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-noir/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-[71] bg-ivory shadow-lg"
          >
            <div className="max-w-2xl mx-auto px-6 pt-8 pb-6">
              <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-noir/15 pb-4">
                <Search size={19} strokeWidth={1.5} className="text-noir/40 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search rings, necklaces, earrings..."
                  className="flex-1 bg-transparent font-heading text-noir text-xl placeholder:text-noir/30 focus:outline-none"
                />
                <button type="button" onClick={onClose} aria-label="Close search" className="text-noir/40 hover:text-noir transition-colors shrink-0">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </form>

              <div className="mt-4 min-h-[80px]">
                {loading ? (
                  <div className="flex flex-col gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 bg-noir/10 rounded-luxury shrink-0" />
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="h-3 bg-noir/10 rounded w-1/3" />
                          <div className="h-3 bg-noir/10 rounded w-1/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : query.trim() && results.length === 0 ? (
                  <p className="font-body text-noir/50 text-[13.5px] py-4">
                    No pieces found for "{query}".
                  </p>
                ) : results.length > 0 ? (
                  <div className="flex flex-col">
                    {results.map((p) => {
                      const hasDiscount = p.discountPrice && p.discountPrice < p.price;
                      return (
                        <button
                          key={p._id}
                          onClick={() => goToProduct(p.slug)}
                          className="flex items-center gap-4 py-2.5 hover:bg-noir/[0.03] rounded-luxury px-2 -mx-2 transition-colors text-left"
                        >
                          <img
                            src={p.images?.[0]?.url || FALLBACK_IMAGE}
                            alt={p.name}
                            className="w-12 h-12 rounded-luxury object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-noir text-[14px] truncate">{p.name}</p>
                            <p className="font-body text-noir/40 text-[12px]">
                              ₹{(hasDiscount ? p.discountPrice : p.price).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                    <button
                      onClick={handleViewAll}
                      className="flex items-center justify-between mt-2 pt-3 border-t border-noir/10 text-champagne text-[13px] font-body"
                    >
                      View all results for "{query}"
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                ) : (
                  <p className="font-body text-noir/40 text-[13px] py-4">
                    Start typing to search the full collection.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
