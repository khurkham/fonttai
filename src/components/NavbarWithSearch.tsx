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
  const [open, setOpen] = useState(false);

  const items: { key: NavPage; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "about", label: "About" },
    { key: "services", label: "Services" },
  ];

  const navClass = (page: NavPage) =>
    `block rounded-md px-3 py-2 text-[18px] font-medium transition ${
      publicPage === page
        ? "text-blue-600"
        : "text-slate-900 hover:text-blue-600"
    }`;

  return (
    <nav className="fixed start-0 top-0 z-20 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center space-x-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm">
            <span className="text-lg font-black">T</span>
          </div>
          <span className="self-center whitespace-nowrap text-[22px] font-semibold text-slate-900">
            Font Tai
          </span>
        </button>

        <div className="flex items-center md:order-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 md:hidden"
            aria-label="Toggle search"
          >
            <Search size={22} />
          </button>

          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <Search size={16} className="text-slate-500" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pe-3 ps-9 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-[260px] lg:w-[300px]"
              placeholder="Search"
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ms-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 md:hidden"
            aria-label="Open main menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div
          className={`${
            open ? "block" : "hidden"
          } w-full items-center justify-between md:order-1 md:flex md:w-auto`}
        >
          <div className="relative mt-3 md:hidden">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <Search size={16} className="text-slate-500" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pe-3 ps-9 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search"
            />
          </div>

          <ul className="mt-4 flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0">
            {items.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(item.key);
                    setOpen(false);
                  }}
                  className={navClass(item.key)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}