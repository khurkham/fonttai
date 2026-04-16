import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { ViewportToggle, type PreviewMode } from "./ViewportToggle";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  publicPage: "home" | "about" | "services" | "privacy" | "contact";
  onNavigate: (page: "home" | "about" | "services" | "privacy" | "contact") => void;
  mode: PreviewMode;
  isFullscreen: boolean;
  onChangeMode: (mode: PreviewMode) => void;
  onToggleFullscreen: () => void;
};

export function NavbarWithSearch({
  search,
  onSearchChange,
  publicPage,
  onNavigate,
  mode,
  isFullscreen,
  onChangeMode,
  onToggleFullscreen,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (page: string) =>
    `rounded-xl px-3 py-2 text-base font-semibold transition ${
      publicPage === page
        ? "text-blue-600"
        : "text-slate-800 hover:bg-slate-50 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-2xl font-extrabold text-white shadow-sm">
              T
            </div>

            <div className="min-w-0">
              <div className="truncate text-3xl font-black tracking-tight text-slate-900">
                Font Tai
              </div>
              <div className="hidden text-sm text-slate-500 md:block">
                แหล่งรวมฟอนต์ไต ฟอนต์ไทย พรีวิวและจัดการฟอนต์
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex rounded-xl border border-slate-300 p-2 text-slate-700 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden flex-1 items-center justify-center gap-2 lg:flex">
            <button className={linkClass("home")} onClick={() => onNavigate("home")}>
              Home
            </button>
            <button className={linkClass("about")} onClick={() => onNavigate("about")}>
              About
            </button>
            <button className={linkClass("services")} onClick={() => onNavigate("services")}>
              Services
            </button>
            <button className={linkClass("privacy")} onClick={() => onNavigate("privacy")}>
              Privacy
            </button>
            <button className={linkClass("contact")} onClick={() => onNavigate("contact")}>
              Contact
            </button>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative w-[280px] xl:w-[320px]">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="hidden border-t border-slate-100 py-3 lg:block">
          <ViewportToggle
            mode={mode}
            isFullscreen={isFullscreen}
            onChangeMode={onChangeMode}
            onToggleFullscreen={onToggleFullscreen}
          />
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 py-4 lg:hidden">
            <div className="mb-4 flex flex-col gap-2">
              <button className={linkClass("home")} onClick={() => onNavigate("home")}>
                Home
              </button>
              <button className={linkClass("about")} onClick={() => onNavigate("about")}>
                About
              </button>
              <button className={linkClass("services")} onClick={() => onNavigate("services")}>
                Services
              </button>
              <button className={linkClass("privacy")} onClick={() => onNavigate("privacy")}>
                Privacy
              </button>
              <button className={linkClass("contact")} onClick={() => onNavigate("contact")}>
                Contact
              </button>
            </div>

            <div className="mb-4 relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <ViewportToggle
              mode={mode}
              isFullscreen={isFullscreen}
              onChangeMode={onChangeMode}
              onToggleFullscreen={onToggleFullscreen}
            />
          </div>
        )}
      </div>
    </header>
  );
}