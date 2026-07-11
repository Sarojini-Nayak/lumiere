import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Gem, Hammer, Sparkles, ShieldCheck } from "lucide-react";
import craftHero from "../assets/craftsmanship-hero.png";
import craftSetting from "../assets/craftsmanship-setting.png";

const process = [
  {
    icon: Gem,
    step: "01",
    title: "Sketch & Design",
    text: "Every piece begins on paper — a single artisan translates an idea into precise line drawings before a single gram of metal is touched.",
  },
  {
    icon: Hammer,
    step: "02",
    title: "Cast & Shape",
    text: "Molten gold and platinum are cast in small batches, then hand-shaped on the bench — never rushed, never mass-produced.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Set & Polish",
    text: "Stones are set by hand under magnification, then the piece is polished in stages until the light behaves exactly as intended.",
  },
  {
    icon: ShieldCheck,
    step: "04",
    title: "Inspect & Certify",
    text: "A final quality pass and certification ensure every piece leaving the atelier meets the same uncompromising standard.",
  },
];

const values = [
  {
    title: "Certified Metals",
    text: "18k gold, platinum, and rose gold sourced through certified, traceable supply chains.",
  },
  {
    title: "Conflict-Free Stones",
    text: "Every diamond and gemstone is ethically sourced and independently verified.",
  },
  {
    title: "Small-Batch Ateliers",
    text: "Pieces are hand-finished in limited runs by a small team of dedicated artisans.",
  },
  {
    title: "Lifetime Guarantee",
    text: "Every Lumière piece is backed by a lifetime craftsmanship guarantee.",
  },
];

const Craftsmanship = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div className="bg-ivory">
      {/* Cinematic hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-noir">
        <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
          <img
            src={craftHero}
            alt="Artisan crafting fine jewelry at the Lumière atelier"
            className="w-full h-full object-cover opacity-70"
          />
        </motion.div>
        <div className="absolute inset-0 bg-noir/40" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body mb-6"
          >
            The Atelier
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
            className="font-heading text-ivory text-4xl md:text-6xl lg:text-7xl leading-[1.1] max-w-3xl"
          >
            Craftsmanship, Uncompromised
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-ivory/80 font-body text-base md:text-lg mt-6 max-w-md"
          >
            Every Lumière piece passes through the hands of a single artisan — sketched, cast, set, and polished, never rushed.
          </motion.p>
        </div>
      </section>

      {/* Intro / story */}
      <section className="max-w-4xl mx-auto px-6 py-14 md:py-20 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body"
        >
          Our Philosophy
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-noir text-3xl md:text-5xl mt-5 leading-tight"
        >
          Slow, Deliberate, Uncompromising
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-noir/60 text-[15px] md:text-base leading-relaxed mt-6 max-w-2xl mx-auto"
        >
          In an industry built for speed, our atelier moves at the pace of the craft itself.
          Founded in Jaipur, Lumière brings together a small circle of master artisans whose
          techniques have been refined over generations — each piece a quiet rebellion against
          mass production.
        </motion.p>
      </section>

      {/* Process steps */}
      <section className="bg-noir py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10 md:mb-14"
          >
            <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
              The Process
            </span>
            <h2 className="font-heading text-ivory text-3xl md:text-5xl mt-5">
              From Sketch to Heirloom
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {process.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="flex flex-col items-start"
                >
                  <span className="font-heading text-champagne/40 text-4xl mb-4">
                    {item.step}
                  </span>
                  <span className="w-11 h-11 rounded-full border border-champagne/40 flex items-center justify-center mb-5">
                    <Icon size={18} strokeWidth={1.5} className="text-champagne" />
                  </span>
                  <h3 className="font-heading text-ivory text-xl mb-3">{item.title}</h3>
                  <p className="font-body text-ivory/55 text-[14px] leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Split image + values — full-bleed left */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-stretch">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative h-[360px] md:h-full"
        >
          <img
            src={craftSetting}
            alt="Close-up of an artisan setting a gemstone by hand"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-12 md:py-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body"
          >
            What We Stand For
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-noir text-3xl md:text-4xl mt-5 max-w-md"
          >
            A Standard We Never Lower
          </motion.h2>

          <div className="mt-10 flex flex-col gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-b border-noir/10 pb-6 last:border-0"
              >
                <h3 className="font-body text-noir text-[15px] tracking-[0.05em] uppercase mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-noir/55 text-[14px] leading-relaxed">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-noir py-16 md:py-20 px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-ivory text-3xl md:text-5xl max-w-xl mx-auto leading-tight">
            Own a Piece of the Atelier
          </h2>
          <p className="font-body text-ivory/60 text-[15px] mt-5 max-w-md mx-auto">
            Explore the full collection, each piece finished by hand in our Jaipur atelier.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-9 bg-champagne text-noir px-9 py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-champagne/90 transition-colors"
          >
            Shop Collection
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Craftsmanship;