type Props = {
  label?: string;
  className?: string;
};

export function AdSlot({ label = "พื้นที่โฆษณา", className = "" }: Props) {
  return (
    <aside
      className={`w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 ${className}`}
      aria-label="Advertisement"
    >
      <div className="flex min-h-[120px] items-center justify-center p-4 text-sm">
        {label}
      </div>
    </aside>
  );
}