import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Heart, ShoppingBag } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";
import { setWishlistIds } from "../redux/slices/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlistIds = useSelector((state) => state.wishlist.items);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axiosInstance
      .get("/wishlist")
      .then((res) => {
        setItems(res.data || []);
        dispatch(setWishlistIds((res.data || []).map((p) => p._id)));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user, dispatch]);

  // Filter against Redux so un-hearting a card anywhere (including on this
  // page, via ProductCard's own heart button) removes it here instantly.
  const visibleItems = items.filter((p) => wishlistIds.includes(p._id));

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center">
        <Heart size={28} strokeWidth={1.2} className="text-champagne mb-4" />
        <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body mb-3">
          Wishlist
        </span>
        <h1 className="font-heading text-noir text-3xl md:text-4xl">Sign in to view your wishlist</h1>
        <p className="font-body text-noir/50 text-sm mt-4 max-w-sm">
          Save your favorite pieces and pick up right where you left off.
        </p>
        <Link
          to="/login"
          className="mt-8 bg-noir text-ivory px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24 min-h-screen">
      <div className="mb-10 md:mb-14">
        <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
          Saved
        </span>
        <h1 className="font-heading text-noir text-3xl md:text-5xl mt-3">Your Wishlist</h1>
        {!loading && visibleItems.length > 0 && (
          <p className="font-body text-noir/50 text-[14px] mt-3">
            {visibleItems.length} {visibleItems.length === 1 ? "piece" : "pieces"} saved
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-noir/10 rounded-luxury" />
              <div className="mt-4 flex flex-col gap-2">
                <div className="h-3 bg-noir/10 rounded w-1/3" />
                <div className="h-4 bg-noir/10 rounded w-2/3" />
                <div className="h-3 bg-noir/10 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="flex flex-col items-center text-center py-24">
          <Heart size={28} strokeWidth={1.2} className="text-noir/20 mb-4" />
          <p className="font-heading text-noir/60 text-xl">Your wishlist is empty</p>
          <p className="font-body text-noir/40 text-sm mt-2 max-w-sm">
            Tap the heart on any piece to save it here for later.
          </p>
          <Link
            to="/shop"
            className="mt-8 flex items-center gap-2 bg-noir text-ivory px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors"
          >
            <ShoppingBag size={15} strokeWidth={1.5} />
            Browse the Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7">
          {visibleItems.map((p) => (
            <ProductCard
              key={p._id}
              product={{
                _id: p._id,
                slug: p.slug,
                name: p.name,
                price: p.price,
                discountPrice: p.discountPrice,
                image: p.images?.[0]?.url,
                rating: p.ratings,
                numReviews: p.numReviews,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
