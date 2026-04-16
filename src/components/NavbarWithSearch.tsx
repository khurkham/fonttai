import { useState } from "react";
import { Menu, Search, X } from "lucide-react";

type NavPage = "home" | "about" | "services" | "privacy" | "contact";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  publicPage: NavPage;
  onNavigate: (page: NavPage) => void;
};

export function NavbarWithSearch({
  search,
  onSearchChange,
  publicPage,
  onNavigate,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { key: NavPage; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "about", label: "About" },
    { key: "services", label: "Services" },
  ];

  const linkClass = (page: NavPage) =>
    `px-3 py-2 rounded-lg text-base font-semibold transition ${
      publicPage === page
        ? "text-blue-600"
        : "text-slate-900 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        {/* Left: Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm">
            <span className="text-xl font-black">T</span>
          </div>

          <div className="min-w-0">
            <div className="truncate text-2xl font-extrabold tracking-tight text-slate-900">
              Font Tai
            </div>
          </div>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden items-center gap-4 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={linkClass(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Desktop search */}
        <div className="hidden lg:block">
          <div className="relative w-[300px] xl:w-[340px]">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-base text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 p-2 text-slate-700 lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile / Tablet menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onNavigate(item.key);
                    setMobileOpen(false);
                  }}
                  className={`text-left rounded-xl px-3 py-3 text-base font-semibold transition ${
                    publicPage === item.key
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="relative w-full">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-base text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}