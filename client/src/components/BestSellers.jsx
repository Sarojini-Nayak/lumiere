import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import ProductCard from "./ProductCard";

const BestSellers = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/products", { params: { isBestSeller: true, limit: 4 } })
      .then((res) => {
        const mapped = (res.data.products || []).map((p) => ({
          ...p,
          image: p.images?.[0]?.url,
          rating: p.ratings,
        }));
        setProducts(mapped);
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 md:mb-16 gap-4"
      >
        <div className="max-w-xl">
          <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
            Most Loved
          </span>
          <h2 className="font-heading text-noir text-3xl md:text-5xl mt-4 leading-tight">
            Best Sellers
          </h2>
        </div>
        <Link
          to="/category/best-sellers"
          className="text-noir/70 text-[13px] tracking-[0.1em] uppercase font-body underline underline-offset-4 hover:text-noir whitespace-nowrap"
        >
          View All
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
        {products.map((product, i) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;