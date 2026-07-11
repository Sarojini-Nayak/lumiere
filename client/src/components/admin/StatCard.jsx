const StatCard = ({ label, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white rounded-luxury p-6 flex items-start justify-between">
      <div>
        <p className="text-noir/50 text-[12px] tracking-wide uppercase font-body">{label}</p>
        <p className="font-heading text-noir text-2xl md:text-3xl mt-2">{value}</p>
        {trend && <p className="text-champagne text-[12px] font-body mt-1">{trend}</p>}
      </div>
      <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center shrink-0">
        <Icon size={18} strokeWidth={1.5} className="text-champagne" />
      </div>
    </div>
  );
};

export default StatCard;
