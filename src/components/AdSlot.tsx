type AdSlotProps = {
  label?: string;
  className?: string;
  slotId?: string;
  showDemo?: boolean;
  variant?: "banner" | "rectangle" | "inline";
};

export function AdSlot({
  label = "พื้นที่โฆษณา",
  className = "",
  slotId,
  showDemo = true,
  variant = "inline",
}: AdSlotProps) {
  const minHeightClass =
    variant === "banner"
      ? "min-h-[160px]"
      : variant === "rectangle"
      ? "min-h-[250px]"
      : "min-h-[120px]";

  return (
    <section
      className={`overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white ${minHeightClass} ${className}`}
      aria-label={label}
      data-ad-slot={slotId || ""}
    >
      <div className="flex h-full w-full items-center justify-center px-4 py-6 text-center">
        {showDemo ? (
          <div className="w-full max-w-2xl space-y-3">
            <div className="mx-auto inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 shadow-sm">
              Advertisement
            </div>

            <div className="space-y-2">
              <p className="text-lg font-bold text-slate-700">{label}</p>
              <p className="text-sm leading-6 text-slate-500">
                พื้นที่สำหรับวางโฆษณา Google AdSense หรือโฆษณาแบนเนอร์ในอนาคต
              </p>
            </div>

            <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-400">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                Responsive Ad Area
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                Slot: {slotId || "demo-slot"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {variant}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="adsense-placeholder w-full"
            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
            data-ad-slot={slotId || "1234567890"}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </section>
  );
}