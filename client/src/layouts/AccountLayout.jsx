import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { User, Package, MapPin, Lock } from "lucide-react";

const tabs = [
  { to: "/account", label: "Profile", icon: User, end: true },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/settings", label: "Settings", icon: Lock },
];

const AccountLayout = () => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-24 min-h-screen">
      <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">My Account</span>
      <h1 className="font-heading text-noir text-3xl md:text-4xl mt-3 mb-10">Welcome, {user.name?.split(" ")[0]}</h1>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-luxury text-[13.5px] font-body whitespace-nowrap transition-colors ${
                  isActive ? "bg-noir text-ivory" : "text-noir/60 hover:bg-noir/5"
                }`
              }
            >
              <tab.icon size={16} strokeWidth={1.5} />
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
