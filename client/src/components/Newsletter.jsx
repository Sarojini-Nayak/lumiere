import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="bg-noir py-24 md:py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-lg mx-auto text-center"
      >
        <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
          Stay Connected
        </span>
        <h2 className="font-heading text-ivory text-3xl md:text-4xl mt-4 leading-tight">
          Join the House
        </h2>
        <p className="font-body text-ivory/60 text-[14px] mt-4">
          New arrivals, private previews, and stories from the atelier — occasionally, never spam.
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-champagne font-body text-sm">
            <Check size={16} strokeWidth={1.5} />
            You're on the list. Welcome to Lumière.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex items-center gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-b border-ivory/30 text-ivory placeholder:text-ivory/40 font-body text-sm py-2.5 focus:outline-none focus:border-champagne transition-colors"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="w-10 h-10 shrink-0 rounded-full bg-champagne flex items-center justify-center hover:bg-champagne/90 transition-colors"
            >
              <ArrowRight size={16} strokeWidth={1.5} className="text-noir" />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
};

export default Newsletter;
