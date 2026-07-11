import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import craftHero from "../assets/home-craft.jpeg";

const features = [
  "Certified 18k gold & platinum",
  "Ethically sourced, conflict-free stones",
  "Hand-finished in small batches",
  "Lifetime craftsmanship guarantee",
];

const Craftsmanship = () => {
  return (
    <section className="bg-noir">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 md:px-16 py-24 md:py-0 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
              The Atelier
            </span>
            <h2 className="font-heading text-ivory text-3xl md:text-5xl mt-5 leading-tight max-w-md">
              Every Piece Begins as a Sketch
            </h2>
            <p className="font-body text-ivory/60 text-[15px] leading-relaxed mt-6 max-w-md">
              Before it becomes a ring or a pendant, every Lumière piece
              passes through the hands of a single artisan — sketched, cast,
              set, and polished, never rushed.
            </p>

            <ul className="mt-10 flex flex-col gap-4">
              {features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-5 h-5 rounded-full border border-champagne/50 flex items-center justify-center shrink-0">
                    <Check size={11} strokeWidth={2} className="text-champagne" />
                  </span>
                  <span className="font-body text-ivory/80 text-[14px]">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              to="/craftsmanship"
              className="inline-block mt-10 text-ivory text-[13px] tracking-[0.15em] uppercase font-body border-b border-champagne pb-1 hover:text-champagne transition-colors"
            >
              Discover Our Ateliers
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative h-[400px] md:h-[640px] order-1 md:order-2"
        >
          <img
            src={craftHero}
            alt="Artisan hand-finishing a Lumière piece"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <p className="text-ivory/90 font-heading text-lg italic">
              "Handcrafted in small ateliers, one piece at a time."
            </p>
            <span className="text-champagne/80 text-[11px] tracking-[0.2em] uppercase font-body mt-2 block">
              Jaipur — Est. 2024
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Craftsmanship;
