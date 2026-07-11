const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <span className="text-champagne text-[11px] tracking-[0.25em] uppercase font-body">
          Admin
        </span>
        <h1 className="font-heading text-noir text-2xl md:text-3xl mt-1">{title}</h1>
        {subtitle && <p className="text-noir/50 text-[13.5px] mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
