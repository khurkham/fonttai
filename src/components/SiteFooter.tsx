import { Mail, MapPin, UserRoundPlus, Settings, } from "lucide-react";
import { AdSlot } from "./AdSlot";

import { openCookieSettings } from "../utils/cookieConsent";

type Props = {
  onNavigate: (
    page:
      | "home"
      | "about"
      | "services"
      | "privacy"
      | "cookie"
      | "contact"
      | "notfound"
  ) => void;
  onAdminClick: () => void;
};

export function SiteFooter({ onNavigate, onAdminClick }: Props) {
const SHOW_AD_PLACEHOLDERS = import.meta.env.DEV;



  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {SHOW_AD_PLACEHOLDERS ? (<AdSlot
          label="พื้นที่โฆษณาด้านล่างเว็บไซต์"
          variant="banner"
          slotId="footer-banner"
          className="mb-8 min-h-[140px]"
        />) : null}

        <div className="grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-[1.15fr_0.9fr_0.95fr_0.95fr]">
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

            <p className="mt-4 text-sm leading-7 text-slate-600">
              เว็บไซต์รวมฟอนต์ไตสำหรับพรีวิว ดาวน์โหลด มีโค้ดสำหรับฝังในเว็บไซต์
              เพื่อให้สามารถอ่านภาษาไตได้ง่าย
            </p>
          </div>

          <div className="flex h-full flex-col">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              เมนูเว็บไซต์
            </h4>

            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                หน้าแรก
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

          <div className="flex h-full flex-col">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              ติดต่อ / ผู้ดูแลระบบ
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-blue-600" />
                <span>bejaitai@gmail.com</span>
              </div>

           <div className="flex items-start gap-3">
  <UserRoundPlus size={16} className="mt-0.5 text-blue-600" />

  <a
    href="https://line.me/ti/p/bejaitai"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-green-600 transition-colors"
  >
    ID Line: bejaitai
  </a>
</div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-blue-600" />
                <span>Thailand</span>
              </div>
            </div>

            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={onAdminClick}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Settings size={16} />
                เข้าหลังบ้าน
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Font Tai. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <button
                type="button"
                onClick={() => onNavigate("privacy")}
                className="transition hover:text-blue-600"
              >
                Privacy
              </button>

              <button
                type="button"
                onClick={() => onNavigate("cookie")}
                className="transition hover:text-blue-600"
              >
                Cookies
              </button>
              <button
  type="button"
  onClick={openCookieSettings}
  className="transition hover:text-blue-600"
>
  CookieSettings
</button>

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