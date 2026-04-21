import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import type { CookieConsentSettings } from "../utils/cookieConsent";


export type CookieConsentSettings = {
  necessary: true;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
};

type Props = {
  open: boolean;
  settings: CookieConsentSettings;
  onClose: () => void;
  onSave: (settings: CookieConsentSettings) => void;
  onAcceptAll: () => void;
  onRejectOptional: () => void;
  onNavigate: (page: "privacy" | "cookie") => void;
};

type SectionKey = "necessary" | "analytics" | "functional" | "marketing";

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (disabled || !onChange) return;
        onChange(!checked);
      }}
      className={`relative inline-flex h-10 w-[68px] items-center rounded-full transition ${
        checked ? "bg-blue-600" : "bg-slate-200"
      } ${disabled ? "cursor-not-allowed opacity-90" : ""}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Section({
  title,
  description,
  checked,
  disabled,
  expanded,
  onToggleExpand,
  onToggleValue,
  children,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleValue?: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-slate-200 first:border-t-0">
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onToggleExpand}
              className="mt-1 text-slate-400 transition hover:text-slate-600"
              aria-label="ขยายรายละเอียด"
            >
              {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            <div className="min-w-0">
              <h4 className="text-xl font-black text-slate-900">{title}</h4>
              <p className="mt-3 text-base leading-8 text-slate-500">
                {description}
              </p>

              <button
                type="button"
                onClick={onToggleExpand}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                คุกกี้ที่ใช้
              </button>
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-1">
          <Toggle checked={checked} disabled={disabled} onChange={onToggleValue} />
        </div>
      </div>

      {expanded ? (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function CookieSettingsModal({
  open,
  settings,
  onClose,
  onSave,
  onAcceptAll,
  onRejectOptional,
  onNavigate,
}: Props) {
  const [draft, setDraft] = useState<CookieConsentSettings>(settings);
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({
    necessary: false,
    analytics: false,
    functional: false,
    marketing: false,
  });

  const allOptionalOff = useMemo(
    () => !draft.analytics && !draft.functional && !draft.marketing,
    [draft]
  );
useEffect(() => {
  setDraft(settings);
}, [settings]);
  if (!open) return null;

  function setExpand(key: SectionKey) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="relative flex h-[min(92vh,760px)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h3 className="text-3xl font-black text-slate-900">ตั้งค่าคุกกี้</h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-3 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="ปิด"
          >
            <X size={26} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <Section
            title="คุกกี้ที่จำเป็น"
            description="คุกกี้เหล่านี้จำเป็นต่อการทำงานของเว็บไซต์ ช่วยให้ฟังก์ชันหลักทำงานได้ เช่น ความปลอดภัยของระบบ การจดจำค่าพื้นฐาน และการเข้าถึงหน้าเว็บไซต์ คุณไม่สามารถปิดการใช้งานคุกกี้เหล่านี้ได้"
            checked
            disabled
            expanded={expanded.necessary}
            onToggleExpand={() => setExpand("necessary")}
          >
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
              <li>บันทึกสถานะการยินยอมคุกกี้ของผู้ใช้งาน</li>
              <li>ช่วยให้หน้าเว็บไซต์และระบบนำทางทำงานได้ถูกต้อง</li>
              <li>รองรับความปลอดภัยพื้นฐานของระบบและการใช้งานหลังบ้าน</li>
            </ul>
          </Section>

          <Section
            title="การวิเคราะห์และประสิทธิภาพ"
            description="คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าผู้เยี่ยมชมโต้ตอบกับเว็บไซต์อย่างไร โดยรวบรวมและรายงานข้อมูลแบบไม่ระบุตัวตน เพื่อช่วยให้เราปรับปรุงเว็บไซต์ให้ดีขึ้น"
            checked={draft.analytics}
            expanded={expanded.analytics}
            onToggleExpand={() => setExpand("analytics")}
            onToggleValue={(checked) =>
              setDraft((prev) => ({ ...prev, analytics: checked }))
            }
          >
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
              <li>วัดจำนวนผู้เข้าชมหน้าเว็บไซต์และพฤติกรรมการใช้งาน</li>
              <li>ช่วยวิเคราะห์หน้าที่ได้รับความนิยมและประสิทธิภาพของเว็บ</li>
              <li>เหมาะสำหรับการต่อยอดใช้ระบบวิเคราะห์ เช่น Analytics ในอนาคต</li>
            </ul>
          </Section>

          <Section
            title="ฟังก์ชันการทำงานและการตั้งค่า"
            description="คุกกี้เหล่านี้ช่วยให้เว็บไซต์มีฟังก์ชันที่ดีขึ้นและปรับแต่งตามการโต้ตอบของคุณกับเว็บไซต์ เช่น จดจำการตั้งค่าบางอย่าง เพื่อให้ใช้งานได้สะดวกขึ้น"
            checked={draft.functional}
            expanded={expanded.functional}
            onToggleExpand={() => setExpand("functional")}
            onToggleValue={(checked) =>
              setDraft((prev) => ({ ...prev, functional: checked }))
            }
          >
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
              <li>จดจำค่าที่ผู้ใช้เลือกไว้ เช่น การตั้งค่าบางอย่างบนเว็บไซต์</li>
              <li>ช่วยให้ประสบการณ์ใช้งานสม่ำเสมอเมื่อกลับมาใช้งานอีกครั้ง</li>
              <li>เหมาะกับเว็บพรีวิวฟอนต์ที่อาจมีการจดจำค่าการใช้งานในอนาคต</li>
            </ul>
          </Section>

          <Section
            title="การตลาดและโฆษณา"
            description="คุกกี้เหล่านี้ใช้เพื่อแสดงเนื้อหาหรือโฆษณาที่เกี่ยวข้องกับคุณ และอาจใช้เพื่อวัดจำนวนครั้งที่คุณเห็นโฆษณา รวมถึงประสิทธิภาพของแคมเปญโฆษณา"
            checked={draft.marketing}
            expanded={expanded.marketing}
            onToggleExpand={() => setExpand("marketing")}
            onToggleValue={(checked) =>
              setDraft((prev) => ({ ...prev, marketing: checked }))
            }
          >
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
              <li>รองรับแพลตฟอร์มโฆษณา เช่น Google AdSense ในอนาคต</li>
              <li>ช่วยควบคุมความเกี่ยวข้องของโฆษณาและการวัดผล</li>
              <li>ควรเปิดใช้เฉพาะเมื่อคุณยินยอมให้เว็บไซต์ใช้คุกกี้ด้านการตลาด</li>
            </ul>
          </Section>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-5">
          <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-500">
            <button
              type="button"
              onClick={() => onNavigate("privacy")}
              className="font-medium text-blue-600 underline underline-offset-2"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate("cookie")}
              className="font-medium text-blue-600 underline underline-offset-2"
            >
              Cookie Policy
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onRejectOptional}
              className="rounded-2xl bg-slate-100 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              ปฏิเสธทั้งหมด
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onAcceptAll}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                ยอมรับทั้งหมด
              </button>

              <button
                type="button"
                onClick={() => {
                  onSave({
                    necessary: true,
                    analytics: draft.analytics,
                    functional: draft.functional,
                    marketing: draft.marketing,
                  });
                }}
                className="rounded-2xl bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>

          {allOptionalOff ? (
            <p className="mt-3 text-xs text-slate-400">
              ขณะนี้เลือกใช้เฉพาะคุกกี้ที่จำเป็นเท่านั้น
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
  
}
