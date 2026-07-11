import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Heart, Eye, Star, X } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { setWishlistIds } from "../redux/slices/wishlistSlice";
import { setCart } from "../redux/slices/cartSlice";

const ProductCard = ({ product }) => {
  const [quickView, setQuickView] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlistIds = useSelector((state) => state.wishlist.items);

  const { _id, name, slug, price, discountPrice, image, rating, numReviews } = product;
  const hasDiscount = discountPrice && discountPrice < price;
  const wishlisted = _id ? wishlistIds.includes(_id) : false;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!_id) return;
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = wishlisted
        ? await axiosInstance.delete(`/wishlist/${_id}`)
        : await axiosInstance.post("/wishlist", { productId: _id });
      dispatch(setWishlistIds(res.data.wishlist));
    } catch (err) {
      // card-level action fails silently; user can retry
    }
  };

  const handleAddToCart = async () => {
    if (!_id || addingToCart) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    try {
      const res = await axiosInstance.post("/cart", { productId: _id, quantity: 1 });
      dispatch(setCart(res.data));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1800);
    } catch (err) {
      // card-level action fails silently; user can retry
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <>
      <div className="group relative">
        <div className="relative overflow-hidden rounded-luxury bg-white aspect-[4/5]">
          <Link to={`/product/${slug}`}>
            <img loading="lazy"
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          <button
            onClick={toggleWishlist}
            aria-label="Add to wishlist"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ivory/90 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-ivory"
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              className={wishlisted ? "fill-champagne text-champagne" : "text-noir"}
            />
          </button>

          <div className="absolute left-0 right-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              onClick={() => setQuickView(true)}
              className="w-full bg-noir/90 backdrop-blur-sm text-ivory text-[12px] tracking-[0.15em] uppercase font-body py-3 rounded-luxury flex items-center justify-center gap-2 hover:bg-noir"
            >
              <Eye size={14} strokeWidth={1.5} />
              Quick View
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-start gap-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                strokeWidth={1}
                className={i < Math.round(rating) ? "fill-champagne text-champagne" : "text-noir/20"}
              />
            ))}
            <span className="text-noir/40 text-[11px] font-body ml-1">({numReviews})</span>
          </div>

          <Link
            to={`/product/${slug}`}
            className="font-heading text-noir text-[17px] hover:text-champagne transition-colors"
          >
            {name}
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-body text-noir text-[15px]">
              ₹{(hasDiscount ? discountPrice : price).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="font-body text-noir/40 text-[13px] line-through">
                ₹{price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-noir/60 backdrop-blur-sm flex items-center justify-center px-6"
            onClick={() => setQuickView(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory rounded-luxury max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden relative"
            >
              <button
                onClick={() => setQuickView(false)}
                aria-label="Close quick view"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ivory/90 flex items-center justify-center"
              >
                <X size={18} strokeWidth={1.5} className="text-noir" />
              </button>

              <div className="aspect-square md:aspect-auto md:h-full">
                <img loading="lazy" src={image} alt={name} className="w-full h-full object-cover" />
              </div>

              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-champagne text-[11px] tracking-[0.25em] uppercase font-body mb-3">
                  Lumière
                </span>
                <h3 className="font-heading text-noir text-2xl md:text-3xl mb-3">{name}</h3>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      strokeWidth={1}
                      className={i < Math.round(rating) ? "fill-champagne text-champagne" : "text-noir/20"}
                    />
                  ))}
                  <span className="text-noir/40 text-[12px] font-body ml-1">
                    ({numReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="font-body text-noir text-xl">
                    ₹{(hasDiscount ? discountPrice : price).toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <span className="font-body text-noir/40 text-base line-through">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-noir text-ivory py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors mb-3 disabled:opacity-60"
                >
                  {addedToCart ? "Added ✓" : addingToCart ? "Adding..." : "Add to Cart"}
                </button>
                <Link
                  to={`/product/${slug}`}
                  onClick={() => setQuickView(false)}
                  className="text-center text-noir/60 text-[13px] font-body underline underline-offset-4 hover:text-noir"
                >
                  View full details
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
