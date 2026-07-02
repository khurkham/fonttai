type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="input-shan rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ႁူၼ်လင်
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            p === page
              ? "bg-blue-600 text-white"
              : "border border-slate-300 bg-white text-slate-700"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="input-shan rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ၵႂႃႇၼႃႈ
      </button>
    </nav>
  );
}