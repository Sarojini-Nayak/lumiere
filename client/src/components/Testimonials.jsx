import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ananya R.",
    location: "Mumbai",
    rating: 5,
    quote:
      "The Aurea ring exceeded every expectation — the setting is flawless and it photographs even better than it looks online.",
  },
  {
    name: "Priya K.",
    location: "Bengaluru",
    rating: 5,
    quote:
      "Ordered the Liora necklace for my anniversary. The packaging alone felt like a gift, and the piece itself is stunning.",
  },
  {
    name: "Meera S.",
    location: "Delhi",
    rating: 5,
    quote:
      "Customer care helped me resize a ring within days. Rare to see this level of care from an online jeweler.",
  },
];

const Testimonials = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-xl mx-auto mb-16"
      >
        <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
          In Their Words
        </span>
        <h2 className="font-heading text-noir text-3xl md:text-5xl mt-4 leading-tight">
          Loved, Cherished, Worn
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white rounded-luxury p-8 md:p-9 flex flex-col shadow-[0_2px_24px_rgba(15,15,15,0.05)]"
          >
            <Quote size={26} strokeWidth={1} className="text-champagne mb-5" />
            <p className="font-heading text-noir text-[17px] leading-relaxed italic mb-6">
              "{t.quote}"
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div>
                <p className="font-body text-noir text-[14px]">{t.name}</p>
                <p className="font-body text-noir/40 text-[12px]">{t.location}</p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={12} strokeWidth={1} className="fill-champagne text-champagne" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
