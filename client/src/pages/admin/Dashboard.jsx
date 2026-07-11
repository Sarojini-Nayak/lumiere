import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { IndianRupee, ShoppingBag, Package, Users, AlertTriangle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PageHeader from "../../components/admin/PageHeader";
import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/admin/StatusBadge";

const PIE_COLORS = {
  Processing: "#0F0F0F",
  Confirmed: "#C8A96A",
  Shipped: "#8C8577",
  Delivered: "#4B7B5A",
  Cancelled: "#B94A3D",
};

const formatDateTick = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-noir text-ivory rounded-luxury px-4 py-2.5 text-[12px] font-body shadow-lg">
      <p className="text-ivory/50 mb-1">{formatDateTick(label)}</p>
      <p className="text-champagne">₹{payload[0].value.toLocaleString("en-IN")}</p>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Unable to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Sales overview and store performance" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-luxury" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-luxury mt-6 animate-pulse" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Sales overview and store performance" />
        <p className="text-red-500 text-sm font-body">{error || "Something went wrong."}</p>
      </div>
    );
  }

  const {
    totalRevenue, totalOrders, totalProducts, totalUsers,
    ordersByStatus, revenueByDay, topProducts, lowStockProducts, recentOrders,
  } = stats;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Sales overview and store performance" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} icon={IndianRupee} />
        <StatCard label="Total Orders" value={totalOrders} icon={ShoppingBag} />
        <StatCard label="Total Products" value={totalProducts} icon={Package} />
        <StatCard label="Total Customers" value={totalUsers} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-6">
        <div className="bg-white rounded-luxury p-6">
          <h3 className="font-heading text-noir text-lg mb-1">Revenue — Last 30 Days</h3>
          <p className="text-noir/40 text-[12px] font-body mb-5">Paid orders only</p>
          {revenueByDay.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-noir/40 text-[13px] font-body">
              No revenue recorded in the last 30 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueByDay} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8A96A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C8A96A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#0F0F0F" strokeOpacity={0.06} />
                <XAxis
                  dataKey="_id"
                  tickFormatter={formatDateTick}
                  tick={{ fontSize: 11, fill: "#0F0F0F99" }}
                  axisLine={{ stroke: "#0F0F0F1A" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#0F0F0F99" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C8A96A"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-luxury p-6">
          <h3 className="font-heading text-noir text-lg mb-5">Order Status</h3>
          {ordersByStatus.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-noir/40 text-[13px] font-body">
              No orders yet.
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    dataKey="count"
                    nameKey="_id"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {ordersByStatus.map((entry) => (
                      <Cell key={entry._id} fill={PIE_COLORS[entry._id] || "#0F0F0F33"} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} orders`, name]}
                    contentStyle={{
                      background: "#0F0F0F",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 12,
                      fontFamily: "inherit",
                    }}
                    itemStyle={{ color: "#F8F7F4" }}
                    labelStyle={{ color: "#C8A96A" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-4">
                {ordersByStatus.map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between text-[12.5px] font-body">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[entry._id] || "#0F0F0F33" }}
                      />
                      <span className="text-noir/70">{entry._id}</span>
                    </div>
                    <span className="text-noir/50">{entry.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-luxury p-6">
          <h3 className="font-heading text-noir text-lg mb-5">Top Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-noir/40 text-[13px] font-body">No sales data yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {topProducts.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=100&auto=format&fit=crop"}
                    alt={p.name}
                    className="w-10 h-10 rounded-luxury object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-noir text-[13px] font-body truncate">{p.name}</p>
                    <p className="text-noir/40 text-[11.5px] font-body">{p.totalSold} sold</p>
                  </div>
                  <span className="text-noir text-[13px] font-body shrink-0">
                    ₹{p.revenue.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-luxury p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={16} strokeWidth={1.5} className="text-champagne" />
            <h3 className="font-heading text-noir text-lg">Low Stock</h3>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-noir/40 text-[13px] font-body">All products are well stocked.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=100&auto=format&fit=crop"}
                    alt={p.name}
                    className="w-10 h-10 rounded-luxury object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-noir text-[13px] font-body truncate">{p.name}</p>
                    <p className="text-noir/40 text-[11.5px] font-body">{p.sku || "No SKU"}</p>
                  </div>
                  <span
                    className={`text-[11px] font-body px-2 py-1 rounded-full shrink-0 ${
                      p.stock === 0 ? "bg-red-100 text-red-600" : "bg-champagne/20 text-champagne"
                    }`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-luxury p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-noir text-lg">Recent Orders</h3>
            <Link to="/admin/orders" className="text-champagne text-[11.5px] font-body hover:underline underline-offset-4">
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-noir/40 text-[13px] font-body">No orders yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-noir text-[13px] font-body truncate">
                      {order.user?.name || "Guest"}
                    </p>
                    <p className="text-noir/40 text-[11.5px] font-body">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
