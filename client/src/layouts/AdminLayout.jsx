import { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  TicketPercent,
  Image,
  Users,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../redux/slices/authSlice";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { to: "/admin/cms", label: "CMS / Banners", icon: Image },
  { to: "/admin/users", label: "Users", icon: Users },
];

const AdminLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex bg-[#F5F4F1] font-body">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-16 bg-noir text-ivory">
        <span className="font-heading text-lg tracking-wide">Lumière</span>
        <button onClick={() => setMenuOpen(true)} aria-label="Open admin menu">
          <Menu size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-noir/50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`w-[240px] shrink-0 bg-noir text-ivory flex flex-col h-screen fixed md:sticky top-0 z-50 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-7 border-b border-ivory/10">
          <div>
            <span className="font-heading text-xl tracking-wide">Lumière</span>
            <div className="text-[11px] tracking-[0.25em] uppercase text-champagne mt-1">
              Admin Panel
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close admin menu"
            className="md:hidden text-ivory/70 hover:text-ivory"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-luxury text-[13.5px] transition-colors ${
                  isActive
                    ? "bg-champagne text-noir font-medium"
                    : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
                }`
              }
            >
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-5 border-t border-ivory/10 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-luxury text-[13.5px] text-ivory/70 hover:bg-ivory/10 hover:text-ivory transition-colors"
          >
            <Store size={16} strokeWidth={1.5} />
            View Store
          </NavLink>
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-luxury text-[13.5px] text-ivory/70 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-16 md:pt-0">
        <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
