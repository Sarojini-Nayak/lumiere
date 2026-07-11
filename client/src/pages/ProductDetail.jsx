import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Heart, Star, Minus, Plus, Truck, ShieldCheck, RefreshCw, ChevronRight } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import ImageGallery from "../components/ImageGallery";
import ProductAccordion from "../components/ProductAccordion";
import ProductCard from "../components/ProductCard";
import { setCart } from "../redux/slices/cartSlice";
import { setWishlistIds } from "../redux/slices/wishlistSlice";

const faqs = [
  { q: "What is your return policy?", a: "We accept returns within 14 days of delivery for unworn pieces in original packaging. Custom and engraved items are final sale." },
  { q: "How do I find my ring size?", a: "Use our downloadable size guide, or visit any Lumière atelier for a complimentary sizing. Most orders can be resized once, free of charge." },
  { q: "Is the jewelry hypoallergenic?", a: "Yes — all Lumière pieces are crafted in nickel-free 18k gold, platinum, or sterling silver, safe for sensitive skin." },
  { q: "Do you offer engraving?", a: "Select pieces support complimentary engraving at checkout. Engraved items typically add 2-3 business days to processing." },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistIds = useSelector((state) => state.wishlist.items);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);

  const wishlisted = product ? wishlistIds.includes(product._id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    axiosInstance
      .get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));

    axiosInstance
      .get(`/products/${slug}/related`)
      .then((res) => setRelated(res.data))
      .catch(() => setRelated([]));
  }, [slug]);

  const handleAddToCart = async (buyNow = false) => {
    try {
      const res = await axiosInstance.post("/cart", {
        productId: product._id,
        quantity,
        size: selectedSize,
      });
      dispatch(setCart(res.data));
      if (buyNow) {
        navigate("/checkout");
        return;
      }
      setMessage({ type: "success", text: "Added to your bag." });
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage({ type: "error", text: "Please sign in to add items to your bag." });
      } else {
        setMessage({ type: "error", text: "Something went wrong. Please try again." });
      }
    }
  };

  const handleWishlist = async () => {
    try {
      const res = wishlisted
        ? await axiosInstance.delete(`/wishlist/${product._id}`)
        : await axiosInstance.post("/wishlist", { productId: product._id });
      dispatch(setWishlistIds(res.data.wishlist));
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage({ type: "error", text: "Please sign in to save items to your wishlist." });
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24 min-h-screen animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-noir/10 rounded-luxury" />
          <div className="flex flex-col gap-4 pt-4">
            <div className="h-4 bg-noir/10 rounded w-1/4" />
            <div className="h-8 bg-noir/10 rounded w-2/3" />
            <div className="h-5 bg-noir/10 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center">
        <h1 className="font-heading text-noir text-3xl">Piece Not Found</h1>
        <p className="font-body text-noir/50 text-sm mt-3">
          This item may have been moved or is no longer available.
        </p>
        <Link to="/shop" className="mt-6 text-champagne text-[13px] font-body underline underline-offset-4">
          Back to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-24 min-h-screen">
      <div className="flex items-center gap-2 text-[12px] font-body text-noir/40 mb-8 flex-wrap">
        <Link to="/" className="hover:text-noir">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-noir">Shop</Link>
        {product.category?.name && (
          <>
            <ChevronRight size={12} />
            <Link to={`/category/${product.category.slug}`} className="hover:text-noir">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-noir/70">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <ImageGallery images={product.images} video={product.video} />

        <div>
          <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
            {product.material}
          </span>
          <h1 className="font-heading text-noir text-3xl md:text-4xl mt-3">{product.name}</h1>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  strokeWidth={1}
                  className={i < Math.round(product.ratings || 0) ? "fill-champagne text-champagne" : "text-noir/20"}
                />
              ))}
            </div>
            <span className="text-noir/40 text-[12px] font-body">
              {product.numReviews || 0} review{product.numReviews === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <span className="font-body text-noir text-2xl">
              ₹{(hasDiscount ? product.discountPrice : product.price).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="font-body text-noir/40 text-lg line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="font-body text-noir/60 text-[14px] leading-relaxed mt-5 max-w-md">
            {product.description}
          </p>

          {product.sizes?.length > 0 && (
            <div className="mt-8">
              <span className="font-body text-noir text-[13px] tracking-[0.1em] uppercase">Size</span>
              <div className="flex flex-wrap gap-2.5 mt-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-11 px-3 rounded-luxury text-[13px] font-body border transition-colors ${
                      selectedSize === size
                        ? "bg-noir text-ivory border-noir"
                        : "border-noir/20 text-noir/70 hover:border-noir/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <span className="font-body text-noir text-[13px] tracking-[0.1em] uppercase">Quantity</span>
            <div className="flex items-center gap-4 mt-3 border border-noir/15 rounded-luxury w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-noir/60 hover:text-noir"
                aria-label="Decrease quantity"
              >
                <Minus size={14} strokeWidth={1.5} />
              </button>
              <span className="font-body text-noir text-[14px] w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-noir/60 hover:text-noir"
                aria-label="Increase quantity"
              >
                <Plus size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {message && (
            <p className={`mt-5 text-[13px] font-body ${message.type === "success" ? "text-champagne" : "text-red-500"}`}>
              {message.text}
            </p>
          )}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => handleAddToCart(false)}
              className="flex-1 bg-noir text-ivory py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className="w-12 h-12 shrink-0 rounded-luxury border border-noir/15 flex items-center justify-center hover:border-noir/40 transition-colors"
            >
              <Heart size={17} strokeWidth={1.5} className={wishlisted ? "fill-champagne text-champagne" : "text-noir"} />
            </button>
          </div>
          <button
            onClick={() => handleAddToCart(true)}
            className="w-full mt-3 bg-champagne text-noir py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-champagne/90 transition-colors"
          >
            Buy Now
          </button>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-noir/10">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={18} strokeWidth={1.5} className="text-champagne" />
              <span className="text-noir/60 text-[11px] font-body leading-tight">Free shipping over ₹5,000</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={18} strokeWidth={1.5} className="text-champagne" />
              <span className="text-noir/60 text-[11px] font-body leading-tight">Lifetime guarantee</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RefreshCw size={18} strokeWidth={1.5} className="text-champagne" />
              <span className="text-noir/60 text-[11px] font-body leading-tight">14-day returns</span>
            </div>
          </div>

          <div className="mt-8">
            <ProductAccordion title="Product Details" defaultOpen>
              <ul className="flex flex-col gap-1.5">
                <li>Material: {product.material}</li>
                {product.stone && <li>Stone: {product.stone}</li>}
                {product.sku && <li>SKU: {product.sku}</li>}
              </ul>
            </ProductAccordion>
            <ProductAccordion title="Material & Care">
              Store in a dry, padded case away from direct sunlight. Clean with a soft
              polishing cloth — avoid contact with perfume, lotion, and chlorinated water.
            </ProductAccordion>
            <ProductAccordion title="Size Guide">
              Measure an existing ring's inner diameter in millimeters, or visit any
              Lumière atelier for a complimentary professional sizing.
            </ProductAccordion>
            <ProductAccordion title="Delivery & Returns">
              Orders ship within 2-4 business days in signature Lumière packaging.
              Free returns within 14 days of delivery on unworn pieces.
            </ProductAccordion>
          </div>
        </div>
      </div>

      <div className="mt-24 md:mt-32">
        <h2 className="font-heading text-noir text-2xl md:text-3xl mb-10">Customer Reviews</h2>
        {product.reviews?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-luxury p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-noir text-[14px]">{review.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        strokeWidth={1}
                        className={i < review.rating ? "fill-champagne text-champagne" : "text-noir/20"}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-body text-noir/60 text-[13.5px] leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-noir/50 text-sm">
            No reviews yet — be the first to share your experience with this piece.
          </p>
        )}
      </div>

      <div className="mt-24 md:mt-32">
        <h2 className="font-heading text-noir text-2xl md:text-3xl mb-10">Frequently Asked Questions</h2>
        <div className="max-w-2xl">
          {faqs.map((faq) => (
            <ProductAccordion key={faq.q} title={faq.q}>
              {faq.a}
            </ProductAccordion>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24 md:mt-32">
          <h2 className="font-heading text-noir text-2xl md:text-3xl mb-10">You May Also Love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-7">
            {related.map((p) => (
              <ProductCard
                key={p._id}
                product={{
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
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
