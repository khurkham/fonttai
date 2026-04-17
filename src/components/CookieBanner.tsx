import { useEffect, useState } from "react";
import { Cookie, Settings, ShieldCheck, X } from "lucide-react";

type Props = {
  onNavigate: (page: "privacy" | "cookie") => void;
};

const CONSENT_KEY = "fonttai_cookie_consent";

type ConsentValue = "accepted" | "rejected" | "customized";

export function CookieBanner({ onNavigate }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  function saveConsent(value: ConsentValue) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Cookie size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
                Cookie Consent
              </p>
              <h3 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
                เว็บไซต์นี้ใช้คุกกี้
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => saveConsent("rejected")}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="ปิด"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
            <div>
              <p className="text-sm leading-7 text-slate-600">
                เว็บไซต์นี้ใช้คุกกี้เพื่อให้เว็บไซต์ทำงานได้อย่างเหมาะสม
                วิเคราะห์การใช้งาน ปรับปรุงประสบการณ์ของผู้ใช้
                และสนับสนุนการแสดงโฆษณาในอนาคต คุณสามารถยอมรับ ปฏิเสธ
                หรือจัดการการตั้งค่าคุกกี้ได้ โดยอ่านรายละเอียดเพิ่มเติมได้ที่{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("privacy")}
                  className="font-semibold text-blue-600 underline underline-offset-2"
                >
                  Privacy Policy
                </button>{" "}
                และ{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("cookie")}
                  className="font-semibold text-blue-600 underline underline-offset-2"
                >
                  Cookie Policy
                </button>
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-900">
                    <ShieldCheck size={18} className="text-blue-600" />
                    <span className="text-sm font-bold">คุกกี้ที่จำเป็น</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-500">
                    ใช้เพื่อให้ระบบทำงานได้อย่างถูกต้อง เช่น การจดจำการตั้งค่าพื้นฐาน
                    และความปลอดภัยของเว็บไซต์
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-900">
                    <Settings size={18} className="text-blue-600" />
                    <span className="text-sm font-bold">วิเคราะห์และโฆษณา</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-500">
                    ใช้เพื่อวิเคราะห์การใช้งานเว็บไซต์ และเตรียมรองรับการแสดงโฆษณา
                    เช่น Google AdSense ในอนาคต
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => saveConsent("accepted")}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                ยอมรับทั้งหมด
              </button>

              <button
                type="button"
                onClick={() => saveConsent("rejected")}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                ปฏิเสธคุกกี้ที่ไม่จำเป็น
              </button>

              <button
                type="button"
                onClick={() => saveConsent("customized")}
                className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                ตั้งค่าคุกกี้
              </button>

              <p className="pt-1 text-center text-xs leading-5 text-slate-400">
                การกดปุ่มใดปุ่มหนึ่งถือเป็นการบันทึกตัวเลือกคุกกี้ของคุณไว้ในเบราว์เซอร์นี้
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}