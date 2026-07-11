import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Eye } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PageHeader from "../../components/admin/PageHeader";
import StatusBadge from "../../components/admin/StatusBadge";
import OrderDetailModal from "../../components/admin/OrderDetailModal";

const STATUS_TABS = ["All", "Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/orders/all");
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    return orders
      .filter((o) => (statusTab === "All" ? true : o.orderStatus === statusTab))
      .filter((o) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          o._id.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q)
        );
      });
  }, [orders, search, statusTab]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleUpdated = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o)));
  };

  return (
    <div>
      <PageHeader title="Orders" subtitle="Manage customer orders" />

      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setStatusTab(tab); setPage(1); }}
            className={`px-4 py-2 rounded-luxury text-[12.5px] font-body transition-colors ${
              statusTab === tab ? "bg-noir text-ivory" : "bg-white text-noir/60 hover:bg-noir/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noir/40" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by order ID, customer name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body bg-white focus:outline-none focus:border-champagne"
        />
      </div>

      <div className="bg-white rounded-luxury overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-noir/10">
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Order ID</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Customer</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Date</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Items</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Total</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Payment</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Status</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-noir/40 text-[13px] font-body">Loading...</td></tr>
            ) : pageItems.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-noir/40 text-[13px] font-body">No orders found.</td></tr>
            ) : (
              pageItems.map((o) => (
                <tr key={o._id} className="border-b border-noir/5 last:border-0 hover:bg-noir/[0.02] cursor-pointer" onClick={() => setSelectedOrder(o)}>
                  <td className="px-5 py-3.5 text-noir text-[13px] font-body">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-noir text-[13px] font-body">{o.user?.name || "Guest"}</p>
                    <p className="text-noir/40 text-[11.5px] font-body">{o.user?.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-noir/60 text-[12.5px] font-body">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-noir/60 text-[13px] font-body">{o.items.length}</td>
                  <td className="px-5 py-3.5 text-noir text-[13px] font-body">₹{o.totalPrice.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-body ${o.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {o.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={o.orderStatus} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="w-8 h-8 rounded-luxury inline-flex items-center justify-center text-noir/50 hover:bg-noir/5 hover:text-noir transition-colors">
                      <Eye size={14} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 rounded-luxury text-[12.5px] font-body transition-colors ${
                n === page ? "bg-noir text-ivory" : "bg-white text-noir/60 hover:bg-noir/5"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
};

export default AdminOrders;
