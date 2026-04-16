import { AdSlot } from "./AdSlot";

type Props = {
  onNavigate: (page: "home" | "privacy" | "about" | "contact") => void;
};

export function SiteFooter({ onNavigate }: Props) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <AdSlot label="พื้นที่โฆษณาด้านล่างเว็บไซต์" className="mb-8" />

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
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <button type="button" className="text-left hover:text-blue-600" onClick={() => onNavigate("home")}>
                หน้าแรก
              </button>
              <button type="button" className="text-left hover:text-blue-600" onClick={() => onNavigate("about")}>
                About Us
              </button>
              <button type="button" className="text-left hover:text-blue-600" onClick={() => onNavigate("privacy")}>
                Privacy Policy
              </button>
              <button type="button" className="text-left hover:text-blue-600" onClick={() => onNavigate("contact")}>
                Contact
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              หมายเหตุ
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              พื้นที่โฆษณาจะถูกวางแยกจากเนื้อหาหลักอย่างชัดเจน เพื่อรองรับการใช้งานในอนาคตและเป็นมิตรกับผู้ใช้ทุกอุปกรณ์
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Font Tai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}