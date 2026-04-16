import { useEffect, useState } from "react";
import { Code, Download, ExternalLink } from "lucide-react";
import type { FontItem } from "../types";
import { getFamily, normalizeFontUrl } from "../lib";

type Props = {
  font: FontItem;
  previewText: string;
  fontSize: number;
  textColor: string;
  onShowCode: (font: FontItem) => void;
};

export function FontCard({
  font,
  previewText,
  fontSize,
  textColor,
  onShowCode,
}: Props) {
  const [fontLoaded, setFontLoaded] = useState(!font.isCustom);

  const fontFamily = getFamily(font.name, font.isCustom);
  const fileHref = font.isCustom
    ? normalizeFontUrl(font.fileUrl)
    : `https://fonts.google.com/specimen/${font.name.replace(/\s+/g, "+")}`;

  const downloadHref =
    font.isCustom && font.fileKey
      ? `/api/font-download/${font.fileKey}`
      : fileHref;

  useEffect(() => {
    let cancelled = false;

    async function loadCustomFont() {
      if (!font.isCustom) {
        setFontLoaded(true);
        return;
      }

      if (!fileHref) {
        setFontLoaded(false);
        return;
      }

      try {
        const face = new FontFace(font.name, `url("${fileHref}")`);
        await face.load();
        document.fonts.add(face);
        if (!cancelled) setFontLoaded(true);
      } catch (error) {
        console.error("Failed to load custom font:", font.name, error);
        if (!cancelled) setFontLoaded(false);
      }
    }

    loadCustomFont();

    return () => {
      cancelled = true;
    };
  }, [font.name, font.isCustom, fileHref]);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {font.name}
            </h2>

            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {font.style}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                font.isCustom
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-100 text-slate-700"
              }`}
            >
              {font.isCustom ? "Custom Font" : "Google Font"}
            </span>

            {font.isCustom && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${
                  fontLoaded
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {fontLoaded ? "โหลดฟอนต์แล้ว" : "กำลังโหลดฟอนต์"}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">เจ้าของ:</span>{" "}
              {font.owner}
            </p>
            <p>
              <span className="font-semibold text-slate-800">ลักษณะ:</span>{" "}
              {font.characteristics}
            </p>
          </div>

          {font.details && (
            <p className="mt-3 text-sm italic text-slate-500">{font.details}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onShowCode(font)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            <Code size={16} />
            รับโค้ด
          </button>

          {font.isCustom ? (
            <>
              {fileHref ? (
                <a
                  href={fileHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <ExternalLink size={16} />
                  เปิดไฟล์ฟอนต์
                </a>
              ) : null}

              {downloadHref ? (
                <a
                  href={downloadHref}
                  className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
                >
                  <Download size={16} />
                  ดาวน์โหลดฟอนต์
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
                >
                  <Download size={16} />
                  ไม่พบไฟล์ฟอนต์
                </button>
              )}
            </>
          ) : (
            <a
              href={fileHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              <Download size={16} />
              รับจาก Google
            </a>
          )}
        </div>
      </div>

      <div className="my-5 h-px bg-slate-100" />

      <div className="overflow-x-auto pb-2">
        <p
          className="min-h-[1.5em] whitespace-nowrap"
          style={{
            fontFamily: fontLoaded ? fontFamily : "sans-serif",
            fontSize,
            color: textColor,
            lineHeight: 1.5,
          }}
        >
          {previewText || "โปรดพิมพ์ข้อความด้านบน"}
        </p>
      </div>
    </article>
  );
}