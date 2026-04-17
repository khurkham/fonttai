import { Settings } from "lucide-react";
import { AdSlot } from "./AdSlot";

type Props = {
  onNavigate: (page: "home" | "privacy" | "about" | "contact") => void;
  onAdminClick: () => void;
};

export function SiteFooter({ onNavigate, onAdminClick }: Props) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <AdSlot label="พื้นที่โฆษณาก่อนส่วนท้ายเว็บไซต์" className="mt-10 min-h-[120px]" />

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Font Tai</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              เว็บไซต์รวมฟอนต์ไตและฟอนต์ไทยสำหรับพรีวิว ดาวน์โหลด และจัดการฟอนต์บนระบบ Cloudflare
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              เมนูเว็บไซต์
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                className="text-left text-sm text-slate-600 hover:text-blue-600"
                onClick={() => onNavigate("home")}
              >
                หน้าแรก
              </button>
              <button
                type="button"
                className="text-left text-sm text-slate-600 hover:text-blue-600"
                onClick={() => onNavigate("about")}
              >
                About Us
              </button>
              <button
                type="button"
                className="text-left text-sm text-slate-600 hover:text-blue-600"
                onClick={() => onNavigate("privacy")}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="text-left text-sm text-slate-600 hover:text-blue-600"
                onClick={() => onNavigate("contact")}
              >
                Contact
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              ผู้ดูแลระบบ
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              เข้าสู่ระบบจัดการฟอนต์จากปุ่มด้านล่าง
            </p>

            <button
              type="button"
              onClick={onAdminClick}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              <Settings size={16} />
              เข้าหลังบ้าน
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Font Tai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}