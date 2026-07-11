const ComingSoon = ({ title }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
    <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body mb-4">
      Lumière
    </span>
    <h1 className="font-heading text-noir text-3xl md:text-4xl text-center">{title}</h1>
    <p className="font-body text-noir/50 text-sm mt-4 text-center max-w-sm">
      This page is being crafted — check back shortly.
    </p>
  </div>
);

export default ComingSoon;
