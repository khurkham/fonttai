import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

type PublicPage =
  | "home"
  | "about"
  | "services"
  | "privacy"
  | "cookie"
  | "contact"
  | "notfound";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  publicPage: PublicPage;
  onNavigate: (page: PublicPage) => void;
};

type NavItem = {
  key: PublicPage;
  label: string;
};

const MAIN_NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "contact", label: "Contact" },
];

const MOBILE_EXTRA_ITEMS: NavItem[] = [
  { key: "privacy", label: "Privacy Policy" },
  { key: "cookie", label: "Cookie Policy" },
];

export function NavbarWithSearch({
  search,
  onSearchChange,
  publicPage,
  onNavigate,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [publicPage]);

  const isActive = (page: PublicPage) => {
    if (publicPage === "notfound" && page === "home") return false;
    return publicPage === page;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-24 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex shrink-0 items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-sm">
              T
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900">
                Font Tai
              </div>
            </div>
          </button>

          <nav className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-10">
              {MAIN_NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.key)}
                    className={`text-lg font-semibold transition ${
                      isActive(item.key)
                        ? "text-blue-600"
                        : "text-slate-900 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden w-full max-w-xs shrink-0 lg:block">
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-700 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-slate-200 py-4 lg:hidden">
            <div className="mb-4">
              <label className="relative block">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              {[...MAIN_NAV_ITEMS, ...MOBILE_EXTRA_ITEMS].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  className={`rounded-2xl px-4 py-3 text-left text-base font-semibold transition ${
                    isActive(item.key)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}