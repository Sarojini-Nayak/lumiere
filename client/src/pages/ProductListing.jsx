import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { LayoutGrid, List, SlidersHorizontal, X, ChevronDown, Star, Heart } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { setWishlistIds } from "../redux/slices/wishlistSlice";

const materialOptions = ["Gold", "Silver", "Platinum", "Rose Gold", "White Gold", "Diamond"];

const sortOptions = [
  { value: "", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop";

const FilterPanel = ({
  categories,
  categorySlug,
  selectedMaterials,
  toggleMaterial,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}) => (
  <div className="flex flex-col gap-9">
    <div>
      <h4 className="font-body text-noir text-[13px] tracking-[0.15em] uppercase mb-4">Category</h4>
      <ul className="flex flex-col gap-2.5">
        <li>
          <Link
            to="/shop"
            className={`text-[14px] font-body transition-colors ${
              !categorySlug ? "text-champagne" : "text-noir/60 hover:text-noir"
            }`}
          >
            All Jewelry
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat._id}>
            <Link
              to={`/category/${cat.slug}`}
              className={`text-[14px] font-body transition-colors ${
                categorySlug === cat.slug ? "text-champagne" : "text-noir/60 hover:text-noir"
              }`}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className="font-body text-noir text-[13px] tracking-[0.15em] uppercase mb-4">Price (₹)</h4>
      <div className="flex items-center gap-3">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full bg-transparent border border-noir/15 rounded-luxury px-3 py-2 text-[13px] font-body focus:outline-none focus:border-champagne"
        />
        <span className="text-noir/30">—</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full bg-transparent border border-noir/15 rounded-luxury px-3 py-2 text-[13px] font-body focus:outline-none focus:border-champagne"
        />
      </div>
    </div>

    <div>
      <h4 className="font-body text-noir text-[13px] tracking-[0.15em] uppercase mb-4">Material</h4>
      <ul className="flex flex-col gap-3">
        {materialOptions.map((mat) => (
          <li key={mat} className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id={mat}
              checked={selectedMaterials.includes(mat)}
              onChange={() => toggleMaterial(mat)}
              className="w-4 h-4 accent-champagne cursor-pointer"
            />
            <label htmlFor={mat} className="text-[14px] font-body text-noir/70 cursor-pointer">
              {mat}
            </label>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const useWishlistToggle = (productId) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlistIds = useSelector((state) => state.wishlist.items);
  const wishlisted = productId ? wishlistIds.includes(productId) : false;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId) return;
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = wishlisted
        ? await axiosInstance.delete(`/wishlist/${productId}`)
        : await axiosInstance.post("/wishlist", { productId });
      dispatch(setWishlistIds(res.data.wishlist));
    } catch (err) {
      // card-level action fails silently; user can retry
    }
  };

  return { wishlisted, toggleWishlist };
};

const ProductGridItem = ({ product }) => {
  const image = product.images?.[0]?.url || FALLBACK_IMAGE;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const { wishlisted, toggleWishlist } = useWishlistToggle(product._id);

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-luxury bg-white aspect-[4/5]">
        <img loading="lazy"
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/90 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-ivory"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={wishlisted ? "fill-champagne text-champagne" : "text-noir"}
          />
        </button>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              strokeWidth={1}
              className={i < Math.round(product.ratings || 0) ? "fill-champagne text-champagne" : "text-noir/20"}
            />
          ))}
        </div>
        <p className="font-heading text-noir text-[16px] mt-1.5 group-hover:text-champagne transition-colors">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-body text-noir text-[14px]">
            ₹{(hasDiscount ? product.discountPrice : product.price).toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="font-body text-noir/40 text-[12px] line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const ProductListRow = ({ product }) => {
  const image = product.images?.[0]?.url || FALLBACK_IMAGE;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const { wishlisted, toggleWishlist } = useWishlistToggle(product._id);

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative flex gap-5 items-center bg-white rounded-luxury p-4 hover:shadow-[0_2px_20px_rgba(15,15,15,0.06)] transition-shadow"
    >
      <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 overflow-hidden rounded-luxury">
        <img loading="lazy"
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              strokeWidth={1}
              className={i < Math.round(product.ratings || 0) ? "fill-champagne text-champagne" : "text-noir/20"}
            />
          ))}
          <span className="text-noir/40 text-[11px] font-body ml-1">({product.numReviews || 0})</span>
        </div>
        <p className="font-heading text-noir text-lg md:text-xl group-hover:text-champagne transition-colors">
          {product.name}
        </p>
        <p className="font-body text-noir/50 text-[13px] mt-1 line-clamp-2 max-w-md hidden md:block">
          {product.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-body text-noir text-[15px]">
            ₹{(hasDiscount ? product.discountPrice : product.price).toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="font-body text-noir/40 text-[13px] line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={toggleWishlist}
        aria-label="Add to wishlist"
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-noir/5 transition-colors"
      >
        <Heart
          size={17}
          strokeWidth={1.5}
          className={wishlisted ? "fill-champagne text-champagne" : "text-noir/40"}
        />
      </button>
    </Link>
  );
};

const ProductListing = () => {
  const { categorySlug } = useParams();
  const [urlSearchParams] = useSearchParams();
  const searchQuery = urlSearchParams.get("search") || "";
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setCategoriesLoaded(true));
  }, []);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  useEffect(() => {
    setPage(1);
  }, [categorySlug, selectedMaterials, minPrice, maxPrice, sort, searchQuery]);

  useEffect(() => {
    if (!categoriesLoaded) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (searchQuery) params.search = searchQuery;

        if (categorySlug === "new-arrivals") {
          params.isNewArrival = true;
        } else if (categorySlug && activeCategory) {
          params.category = activeCategory._id;
        } else if (categorySlug && !activeCategory) {
          // slug present but didn't match any known category — show nothing rather than everything
          setProducts([]);
          setTotal(0);
          setPages(1);
          setLoading(false);
          return;
        }

        if (selectedMaterials.length === 1) params.material = selectedMaterials[0];
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sort) params.sort = sort;

        const res = await axiosInstance.get("/products", { params, signal: controller.signal });
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [
    categoriesLoaded,
    activeCategory,
    categorySlug,
    selectedMaterials,
    minPrice,
    maxPrice,
    sort,
    page,
    searchQuery,
  ]);

  const toggleMaterial = (mat) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : activeCategory
    ? activeCategory.name
    : categorySlug
    ? categorySlug.replace(/-/g, " ")
    : "All Jewelry";

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24 min-h-screen">
      <div className="mb-10 md:mb-14">
        <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">Shop</span>
        <h1 className="font-heading text-noir text-3xl md:text-5xl mt-3 capitalize">{pageTitle}</h1>
        {activeCategory?.description && (
          <p className="font-body text-noir/50 text-[14px] mt-3 max-w-lg">
            {activeCategory.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden md:block">
          <FilterPanel
            categories={categories}
            categorySlug={categorySlug}
            selectedMaterials={selectedMaterials}
            toggleMaterial={toggleMaterial}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
        </aside>

        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-noir/10">
            <button
              onClick={() => setFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 text-noir text-[13px] font-body"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              Filters
            </button>

            <p className="font-body text-noir/50 text-[13px] hidden md:block">
              {total} {total === 1 ? "piece" : "pieces"}
            </p>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-transparent border border-noir/15 rounded-luxury pl-4 pr-9 py-2 text-[13px] font-body text-noir focus:outline-none focus:border-champagne cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-noir/50"
                />
              </div>

              <div className="hidden md:flex items-center gap-1 border border-noir/15 rounded-luxury p-1">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-md transition-colors ${
                    view === "grid" ? "bg-noir text-ivory" : "text-noir/50"
                  }`}
                >
                  <LayoutGrid size={15} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`p-1.5 rounded-md transition-colors ${
                    view === "list" ? "bg-noir text-ivory" : "text-noir/50"
                  }`}
                >
                  <List size={15} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "flex flex-col gap-5"}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={view === "grid" ? "animate-pulse" : "animate-pulse flex gap-5"}>
                  <div
                    className={
                      view === "grid"
                        ? "aspect-[4/5] bg-noir/10 rounded-luxury"
                        : "w-40 h-40 bg-noir/10 rounded-luxury shrink-0"
                    }
                  />
                  {view === "list" && (
                    <div className="flex-1 flex flex-col gap-3 py-2">
                      <div className="h-4 bg-noir/10 rounded w-1/3" />
                      <div className="h-5 bg-noir/10 rounded w-2/3" />
                      <div className="h-4 bg-noir/10 rounded w-1/4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-heading text-noir/60 text-xl">No pieces found</p>
              <p className="font-body text-noir/40 text-sm mt-2">Try adjusting your filters.</p>
            </div>
          ) : view === "grid" ? (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-7">
              {products.map((p) => (
                <ProductGridItem key={p._id} product={p} />
              ))}
            </motion.div>
          ) : (
            <motion.div layout className="flex flex-col gap-5">
              {products.map((p) => (
                <ProductListRow key={p._id} product={p} />
              ))}
            </motion.div>
          )}

          {!loading && pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-[13px] font-body transition-colors ${
                    page === i + 1 ? "bg-noir text-ivory" : "text-noir/60 hover:bg-noir/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-noir/50 md:hidden"
            onClick={() => setFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-ivory p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="font-heading text-noir text-xl">Filters</span>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} strokeWidth={1.5} className="text-noir" />
                </button>
              </div>
              <FilterPanel
                categories={categories}
                categorySlug={categorySlug}
                selectedMaterials={selectedMaterials}
                toggleMaterial={toggleMaterial}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductListing;