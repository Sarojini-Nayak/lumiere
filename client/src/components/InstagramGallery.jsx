import { motion } from "framer-motion";
import { InstagramIcon } from "./SocialIcons";

import insta1 from "../assets/insta1.png";
import insta2 from "../assets/insta2.png";
import insta3 from "../assets/insta3.png";
import insta4 from "../assets/insta4.png";
import insta5 from "../assets/insta5.png";
import insta6 from "../assets/insta6.png";
import insta7 from "../assets/insta7.jpeg";

const posts = [
  { image: insta1, span: "row-span-2" },
  { image: insta2, span: "" },
  { image: insta3, span: "" },
  { image: insta4, span: "row-span-2" },
  { image: insta5, span: "" },
  { image: insta6, span: "" },
  { image: insta7, span: "", mobileOnly: true },
];

const InstagramGallery = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-xl mx-auto mb-14"
      >
        <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
          Follow The House
        </span>
        <h2 className="font-heading text-noir text-3xl md:text-5xl mt-4 leading-tight">
          @lumiere
        </h2>
      </motion.div>

      <div className="grid grid-cols-3 md:grid-cols-4 auto-rows-[130px] md:auto-rows-[180px] gap-3 md:gap-4 grid-flow-dense">
        {posts.map((post, i) => (
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={`relative overflow-hidden rounded-luxury group ${post.span} ${
              post.mobileOnly ? "md:hidden" : ""
            }`}
          >
            <img loading="lazy"
              src={post.image}
              alt="Lumière on Instagram"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/40 transition-colors duration-300 flex items-center justify-center">
              <InstagramIcon
                size={22}
                strokeWidth={1.5}
                className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default InstagramGallery;