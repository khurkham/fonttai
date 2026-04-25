import { useEffect, useMemo, useState } from "react";
import { Cookie, Settings, ShieldCheck, X } from "lucide-react";
import { CookieSettingsModal } from "./CookieSettingsModal";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  DEFAULT_COOKIE_SETTINGS,
  OPEN_COOKIE_SETTINGS_EVENT,
  type CookieConsentRecord,
  type CookieConsentSettings,
  readCookieConsent,
  saveCookieConsent,
} from "../utils/cookieConsent";

type Props = {
  onNavigate: (page: "privacy" | "cookie") => void;
};

export function CookieBanner({ onNavigate }: Props) {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] =
    useState<CookieConsentSettings>(DEFAULT_COOKIE_SETTINGS);

  useEffect(() => {
    const saved = readCookieConsent();

    if (!saved) {
      setVisible(true);
    } else {
      setSettings(saved.settings);
      setVisible(false);
    }

    function handleOpenSettings() {
      const latest = readCookieConsent();
      setSettings(latest?.settings || DEFAULT_COOKIE_SETTINGS);
      setShowSettings(true);
      setVisible(false);
    }

    function handleConsentChanged(event: Event) {
      const customEvent = event as CustomEvent<CookieConsentRecord>;
      if (customEvent.detail?.settings) {
        setSettings(customEvent.detail.settings);
      }
    }

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    window.addEventListener(
      COOKIE_CONSENT_CHANGED_EVENT,
      handleConsentChanged as EventListener
    );

    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
      window.removeEventListener(
        COOKIE_CONSENT_CHANGED_EVENT,
        handleConsentChanged as EventListener
      );
    };
  }, []);

  const summaryText = useMemo(() => {
    const enabled = [];
    if (settings.analytics) enabled.push("วิเคราะห์");
    if (settings.functional) enabled.push("ฟังก์ชัน");
    if (settings.marketing) enabled.push("การตลาด");

    if (enabled.length === 0) return "ใช้เฉพาะคุกกี้ที่จำเป็น";
    return `เปิดใช้: ${enabled.join(", ")}`;
  }, [settings]);

  function handleAcceptAll() {
    const next: CookieConsentSettings = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    };

    setSettings(next);
    saveCookieConsent({
      status: "accepted",
      settings: next,
      updatedAt: new Date().toISOString(),
    });
    setVisible(false);
    setShowSettings(false);
  }

  function handleRejectOptional() {
    const next: CookieConsentSettings = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    };

    setSettings(next);
    saveCookieConsent({
      status: "rejected",
      settings: next,
      updatedAt: new Date().toISOString(),
    });
    setVisible(false);
    setShowSettings(false);
  }

  function handleSaveCustom(next: CookieConsentSettings) {
    setSettings(next);
    saveCookieConsent({
      status: "customized",
      settings: next,
      updatedAt: new Date().toISOString(),
    });
    setVisible(false);
    setShowSettings(false);
  }

  if (!visible && !showSettings) return null;

  return (
    <>
      {visible ? (
        <div className="fixed inset-x-0 bottom-4 z-[60] px-4">
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
                onClick={handleRejectOptional}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                aria-label="ปิด"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <div className="grid gap-5 lg:grid-cols-[1.5fr_0.95fr]">
                <div>
                  <p className="text-sm leading-7 text-slate-600">
                    เว็บไซต์ Font Tai ใช้คุกกี้เพื่อให้เว็บไซต์ทำงานได้อย่างเหมาะสม
                    จดจำการตั้งค่าพื้นฐาน ช่วยวิเคราะห์การใช้งาน
                    และรองรับการพัฒนาฟังก์ชันหรือโฆษณาในอนาคต
                    คุณสามารถเลือกยอมรับทั้งหมด ปฏิเสธคุกกี้ที่ไม่จำเป็น
                    หรือกำหนดค่าการใช้งานคุกกี้ได้เอง โดยอ่านรายละเอียดเพิ่มเติมได้ที่{" "}
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
                        ใช้เพื่อให้เว็บไซต์ทำงานได้อย่างถูกต้อง เช่น
                        ความปลอดภัยของระบบ และการบันทึกการยินยอมคุกกี้
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-slate-900">
                        <Settings size={18} className="text-blue-600" />
                        <span className="text-sm font-bold">
                          วัดผล / ฟังก์ชัน / การตลาด
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-slate-500">
                        ใช้เพื่อวิเคราะห์การใช้งานเว็บไซต์ ช่วยจดจำการตั้งค่าบางอย่างของผู้ใช้ และรองรับบริการโฆษณาในอนาคตตามความยินยอมของคุณ
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-6 text-slate-400">
                    สถานะปัจจุบัน: {summaryText}
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    ยอมรับทั้งหมด
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectOptional}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    ปฏิเสธที่ไม่จำเป็น
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    ตั้งค่าคุกกี้
                  </button>

                  <p className="pt-1 text-center text-xs leading-5 text-slate-400">
                    การเลือกของคุณจะถูกบันทึกไว้ในอุปกรณ์นี้
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <CookieSettingsModal
        open={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveCustom}
        onAcceptAll={handleAcceptAll}
        onRejectOptional={handleRejectOptional}
        onNavigate={onNavigate}
      />
    </>
  );
}