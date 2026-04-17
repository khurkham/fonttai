import { useEffect, useState } from "react";

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
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Cookie Consent
            </p>

            <h3 className="mt-2 text-xl font-black text-slate-900">
              เว็บไซต์นี้ใช้คุกกี้
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              เว็บไซต์นี้ใช้คุกกี้เพื่อให้เว็บไซต์ทำงานได้อย่างเหมาะสม วิเคราะห์การใช้งาน
              และสนับสนุนการแสดงโฆษณา คุณสามารถยอมรับ ปฏิเสธ
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
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => saveConsent("rejected")}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              ปฏิเสธคุกกี้ที่ไม่จำเป็น
            </button>

            <button
              type="button"
              onClick={() => saveConsent("customized")}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              ตั้งค่าคุกกี้
            </button>

            <button
              type="button"
              onClick={() => saveConsent("accepted")}
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              ยอมรับทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}