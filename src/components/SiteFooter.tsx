import { Mail, MapPin, Phone, Settings } from "lucide-react";
import { AdSlot } from "./AdSlot";

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
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <AdSlot
          label="พื้นที่โฆษณาด้านล่างเว็บไซต์"
          variant="banner"
          slotId="footer-banner"
          className="mb-8 min-h-[140px]"
        />

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img
  src="/logo.png"
  alt="Font Tai Logo"
  className="h-11 w-11 rounded-2xl object-cover shadow-sm"
/>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  Font Tai
                </h3>
                <p className="text-sm text-slate-500">
                  Thai & Tai Font Preview Platform
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              เว็บไซต์รวมฟอนต์ไตและฟอนต์ไทยสำหรับพรีวิว ดาวน์โหลด
              และจัดการฟอนต์ รองรับการใช้งานบนทุกอุปกรณ์
              และพร้อมต่อยอดสู่ระบบเว็บไซต์เชิงพาณิชย์ในอนาคต
            </p>
          </div>

          <div>
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

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              นโยบายเว็บไซต์
            </h4>

            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate("privacy")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Privacy Policy
              </button>

              <button
                type="button"
                onClick={() => onNavigate("cookie")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Cookie Policy
              </button>

              <button
                type="button"
                onClick={() => onNavigate("notfound")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                หน้า 404
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              ติดต่อ / ผู้ดูแลระบบ
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-blue-600" />
                <span>bejaitai@email.com</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-blue-600" />
                <span>+66 94-624-8370</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-blue-600" />
                <span>Thailand</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onAdminClick}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Settings size={16} />
              เข้าหลังบ้าน
            </button>
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