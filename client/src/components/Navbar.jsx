import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X, User, LogOut, Package } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import axiosInstance from "../utils/axiosInstance";
import SearchOverlay from "./SearchOverlay";

const navLinks = [
  { name: "Rings", path: "/category/rings" },
  { name: "Necklaces", path: "/category/necklaces" },
  { name: "Earrings", path: "/category/earrings" },
  { name: "Bracelets", path: "/category/bracelets" },
  { name: "Wedding", path: "/category/wedding-collection" },
  { name: "New Arrivals", path: "/category/new-arrivals" },
];

const wordmark = "LUMIÈRE".split("");

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart.items.length);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const accountRef = useRef(null);

  const transparentHeroRoutes = ["/", "/craftsmanship"];
  const isTransparentRoute = transparentHeroRoutes.includes(location.pathname);
  const solid = !isTransparentRoute || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Even if the request fails, still clear local state below.
    }
    dispatch(logout());
    setAccountOpen(false);
    navigate("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          solid
            ? "bg-ivory/90 backdrop-blur-md shadow-[0_1px_0_rgba(15,15,15,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-20">
          {/* Left: mobile menu button + logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className={`lg:hidden ${solid ? "text-noir" : "text-ivory"}`}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <Link to="/" className="flex flex-col items-start group">
              <span className="flex font-heading text-xl md:text-2xl tracking-[0.28em]">
                {wordmark.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                    className={solid ? "text-noir" : "text-ivory"}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                className="h-px w-16 bg-champagne mt-1 origin-left"
              />
            </Link>
          </div>

          {/* Center: nav links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[13px] tracking-[0.12em] uppercase font-body transition-colors ${
                  solid ? "text-noir/80 hover:text-noir" : "text-ivory/90 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: icons */}
          <div className={`hidden lg:flex items-center gap-5 ${solid ? "text-noir" : "text-ivory"}`}>
            <button onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={19} strokeWidth={1.5} />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative">
              <Heart size={19} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-champagne text-noir text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative">
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-champagne text-noir text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={accountRef}>
              {user ? (
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  aria-label="Account menu"
                  className="w-7 h-7 rounded-full bg-champagne text-noir flex items-center justify-center text-[12px] font-body uppercase"
                >
                  {user.name?.charAt(0) || "U"}
                </button>
              ) : (
                <Link to="/login" aria-label="Sign in">
                  <User size={19} strokeWidth={1.5} />
                </Link>
              )}

              <AnimatePresence>
                {accountOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-10 bg-ivory shadow-[0_4px_24px_rgba(15,15,15,0.12)] rounded-luxury py-2 w-48 text-noir"
                  >
                    <p className="px-4 py-2 text-[13px] font-body text-noir/50 border-b border-noir/10 truncate">
                      {user.email}
                    </p>
                    <Link
                      to="/account"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-body hover:bg-noir/5"
                    >
                      <User size={14} strokeWidth={1.5} /> My Profile
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-body hover:bg-noir/5"
                    >
                      <Package size={14} strokeWidth={1.5} /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-body hover:bg-noir/5 text-left"
                    >
                      <LogOut size={14} strokeWidth={1.5} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: search, wishlist, cart, account */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className={solid ? "text-noir" : "text-ivory"}>
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/wishlist" className={`relative ${solid ? "text-noir" : "text-ivory"}`} aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-champagne text-noir text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className={`relative ${solid ? "text-noir" : "text-ivory"}`} aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-champagne text-noir text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                to="/account"
                aria-label="My account"
                className="w-7 h-7 rounded-full bg-champagne text-noir flex items-center justify-center text-[12px] font-body uppercase"
              >
                {user.name?.charAt(0) || "U"}
              </Link>
            ) : (
              <Link to="/login" className={solid ? "text-noir" : "text-ivory"} aria-label="Sign in">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-noir text-ivory flex flex-col"
          >
            <div className="flex justify-between items-center px-6 h-20">
              <span className="font-heading tracking-[0.28em] text-lg">LUMIÈRE</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-heading tracking-wide"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-8 border-t border-ivory/15 w-full flex flex-col items-center gap-6"
              >
                {user ? (
                  <button onClick={handleLogout} className="text-champagne text-[14px] tracking-[0.1em] uppercase font-body">
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="text-ivory text-[14px] tracking-[0.1em] uppercase font-body">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="text-champagne text-[14px] tracking-[0.1em] uppercase font-body">
                      Create Account
                    </Link>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
