import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop"
          alt="Lumière"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-noir/40" />
        <Link
          to="/"
          className="absolute top-10 left-10 font-heading text-ivory text-xl tracking-[0.28em]"
        >
          LUMIÈRE
        </Link>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-16 bg-ivory">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="md:hidden font-heading text-noir text-lg tracking-[0.28em] block mb-10 text-center">
            LUMIÈRE
          </Link>
          <h1 className="font-heading text-noir text-3xl">{title}</h1>
          {subtitle && <p className="font-body text-noir/50 text-[14px] mt-2">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
