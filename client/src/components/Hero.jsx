import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpeg"; // adjust relative path if Hero.jsx lives elsewhere

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.65]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-noir">
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <img
          src={heroImage}
          alt="Lumière fine jewelry editorial"
          className="w-full h-full object-cover"
        />
      </motion.div>


      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-noir" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-ivory/70 text-[12px] tracking-[0.3em] uppercase font-body mb-6"
        >
          Maison Lumière
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
          className="font-heading text-ivory text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-4xl"
        >
          Where Light Finds Form
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-ivory/80 font-body text-base md:text-lg mt-6 max-w-md"
        >
          Fine jewelry cast in gold, worn like quiet confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <Link
            to="/shop"
            className="bg-champagne text-noir px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-champagne/90 transition-colors"
          >
            Shop Collection
          </Link>
          <Link
            to="/craftsmanship"
            className="border border-ivory/60 text-ivory px-8 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-ivory/10 transition-colors"
          >
            Discover Craftsmanship
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-ivory/50 text-[10px] tracking-[0.2em] uppercase font-body">
          Scroll
        </span>
        <span className="w-px h-8 bg-ivory/40" />
      </motion.div>
    </section>
  );
};

export default Hero;