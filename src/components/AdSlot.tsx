type Props = {
  label?: string;
  className?: string;
};

export function AdSlot({ label = "พื้นที่โฆษณา", className = "" }: Props) {
  return (
    <aside
      className={`flex min-h-[90px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 ${className}`}
      aria-label="Advertisement"
    >
      {label}
    </aside>
  );
}