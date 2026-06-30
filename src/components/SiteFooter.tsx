import { Mail, MapPin, UserRoundPlus, Settings } from "lucide-react";

type FontItem = {
  owner?: string;
};

type Props = {
  onNavigate: (
    page:
      | "home"
      | "about"
      | "services"
      | "contact"
      | "notfound"
  ) => void;

  onAdminClick: () => void;

  allFonts: FontItem[];

  setOwnerFilter: (owner: string) => void;
};

export function SiteFooter({
  onNavigate,
  onAdminClick,
  allFonts,
  setOwnerFilter,
}: Props) {
  const ownerGroups = allFonts.reduce((groups, font) => {
    const owner = font.owner?.trim();

    if (!owner) return groups;

    const firstLetter = owner.charAt(0).toUpperCase();

    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }

    if (!groups[firstLetter].includes(owner)) {
      groups[firstLetter].push(owner);
    }

    return groups;
  }, {} as Record<string, string[]>);

  Object.keys(ownerGroups).forEach((letter) => {
    ownerGroups[letter].sort((a, b) => a.localeCompare(b));
  });

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">

        <div className="grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-[1.15fr_0.9fr_0.95fr_0.95fr]">

          {/* Logo */}
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Font Tai Logo"
                className="h-11 w-11 rounded-2xl object-contain shadow-sm"
              />

              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  Font Tai
                </h3>

                <p className="text-sm text-slate-500">
                  Tai Font Preview Platform
                </p>
              </div>
            </div>

            <p className="input-shan mt-4 text-sm leading-7 text-slate-600">
              ဝႅပ်ႉသၢႆႉႁူမ်ႈၾွၼ်ႉတႆး တွၼ်ႈတႃႇ ၸၢမ်းတူၺ်း၊ တၢဝ်းလူတ်ႇ လႄႈတွၼ်ႈတႃႇ 
              ၸႂ်ႉတိုဝ်းၼိူဝ်ဝႅပ်ႉသၢႆႉ၊ ၸွႆႈႁႂ်ႈႁဝ်းလူလိၵ်ႈတႆးလႆႈငၢႆႈၸႂ် လႄႈႁၼ်သႃႇတၢႆႇႁၢင်ႈလီမႃးၼၼ်ႉယဝ်ႉ။
            </p>
          </div>

          {/* Menu */}
          <div className="flex h-full flex-col">
            <h4 className="input-shan text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              ေမႇၼူးဝဵပ်ႉသၢႆႉ
            </h4>

            <div className="mt-4 flex flex-col gap-3">

              <button
                type="button"
                onClick={() => {
  onNavigate("home");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  window.location.reload();
}}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                HOME
              </button>

              <button
                type="button"
                onClick={() => onNavigate("about")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                About Us
              </button>

              <button
                type="button"
                onClick={() => onNavigate("services")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Services
              </button>

              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Contact
              </button>

            </div>
          </div>

          {/* Visitor Counter */}
          <div className="flex h-full w-full max-w-[250px] flex-col">

            <div className="rounded-[22px] border border-white/60 bg-white/85 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-[13px] text-blue-600 shadow-sm">
                  👁️
                </div>

                <div>
                  <h5 className="text-[15px] font-extrabold leading-none text-slate-900">
                    Visitor Counter
                  </h5>

                  <p className="mt-1 text-[10px] leading-none text-slate-400">
                    Live Website Visitors
                  </p>
                </div>

              </div>

              <div className="flex justify-center rounded-xl border border-slate-100 bg-white p-4">

                <img
                  src="https://api.visitorbadge.io/api/visitors?path=fonttai.com&label=Visitors&countColor=%230f172a"
                  alt="Visitor Counter"
                  className="h-[32px]"
                />

              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="input-shan flex h-full flex-col">

            <h4 className="input-shan text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              ၵပ်းသိုပ်ႇႁဝ်း / ၽၢႆႇၵုမ်းထိင်းသိတ်ႇတဵမ်ႇ
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-600">

              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-blue-600" />
                <span>bejaitai@gmail.com</span>
              </div>

              <div className="flex items-start gap-3">
                <UserRoundPlus
                  size={16}
                  className="mt-0.5 text-blue-600"
                />

                <a
                  href="https://line.me/ti/p/bejaitai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-green-600"
                >
                  ID Line: bejaitai
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-blue-600" />
                <span>Thailand</span>
              </div>

            </div>

            <div className="input-shan mt-auto pt-5">

              <button
                type="button"
                onClick={onAdminClick}
                className="input-shan inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Settings size={16} />
                ၶဝ်ႈလင်ႁိူၼ်း
              </button>

            </div>
          </div>
        </div>

        {/* Font Owners */}
        <div className="mt-10 border-t border-slate-200 pt-8">

          <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
            Font Owners
          </h4>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

            {Object.entries(ownerGroups)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, owners]) => (
                <div key={letter}>

                  <h5 className="mb-3 text-lg font-black text-blue-600">
                    {letter}
                  </h5>

                  <div className="space-y-2">

                    {owners.map((owner) => (
                      <button
                        key={owner}
                        type="button"
                        onClick={() => {
                          setOwnerFilter(owner);

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="block text-left text-sm text-slate-600 transition hover:text-blue-600"
                      >
                        {owner}
                      </button>
                    ))}

                  </div>
                </div>
              ))}

          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 border-t border-slate-200 pt-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Font Tai. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500">

              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="transition hover:text-blue-600"
              >
                Contact
              </button>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
