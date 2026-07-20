import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import ringImg from "../assets/ring.webp";
import necklaceImg from "../assets/neclace.webp";
import earringImg from "../assets/earing.webp";
import braceletImg from "../assets/bracelet.webp";
import weddingImg from "../assets/wedding.webp";
import newArrivalImg from "../assets/newarrival.webp";

const collections = [
  {
    name: "Rings",
    path: "/category/rings",
    image: ringImg,
    blob: "40% 60% 65% 35% / 45% 40% 60% 55%",
  },
  {
    name: "Necklaces",
    path: "/category/necklaces",
    image: necklaceImg,
    blob: "48% 52% 62% 38% / 40% 60% 40% 60%",
  },
  {
    name: "Earrings",
    path: "/category/earrings",
    image: earringImg,
    blob: "63% 37% 54% 46% / 55% 48% 52% 45%",
  },
  {
    name: "Bracelets",
    path: "/category/bracelets",
    image: braceletImg,
    blob: "55% 45% 40% 60% / 60% 55% 45% 40%",
  },
  {
    name: "Wedding Collection",
    path: "/category/wedding-collection",
    image: weddingImg,
    blob: "60% 40% 45% 55% / 50% 60% 40% 50%",
  },
  {
    name: "New Arrivals",
    path: "/category/new-arrivals",
    image: newArrivalImg,
    blob: "45% 55% 55% 45% / 55% 45% 55% 45%",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-4 md:pt-6 pb-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-xl mb-4 md:mb-6"
      >
        <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
          The Collections
        </span>
        <h2 className="font-heading text-noir text-2xl md:text-4xl mt-2 leading-tight">
          Six Expressions of Light
        </h2>
        <p className="font-body text-noir/60 mt-2 text-[15px] leading-relaxed">
          From the first ring to the newest arrival — the full house, in one view.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-5 md:gap-x-6 md:gap-y-8">
        {collections.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex flex-col items-center"
          >
            <div className={i >= 3 ? "transform translate-y-4 md:translate-y-6 flex flex-col items-center w-full" : "flex flex-col items-center w-full"}>
              <Link to={item.path} className="group relative block w-full">
                <div
                  className="w-full aspect-square overflow-hidden"
                  style={{ borderRadius: item.blob }}
                >
                  <img
                    loading="lazy"
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-3 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-ivory border border-noir/10 text-noir shadow-md transition-all duration-300 group-hover:bg-champagne group-hover:text-noir">
                  <ArrowUpRight size={15} strokeWidth={1.5} />
                </span>
              </Link>
              <h3 className="font-body text-noir text-[10px] md:text-[12px] tracking-[0.12em] uppercase mt-3 text-center">
                {item.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollections;