const statusStyles = {
  Processing: "bg-noir/10 text-noir/70",
  Confirmed: "bg-champagne/20 text-champagne",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-[11px] font-body uppercase tracking-wide whitespace-nowrap ${
      statusStyles[status] || "bg-noir/10 text-noir/60"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;
