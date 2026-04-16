import { Code, Download } from "lucide-react";
import type { FontItem } from "../types";
import { getFamily } from "../lib";

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
  const fontFamily = getFamily(font.name, font.isCustom);
  const fileHref = font.isCustom
    ? font.fileUrl
    : `https://fonts.google.com/specimen/${font.name.replace(/\s+/g, "+")}`;

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
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                font.isCustom
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {font.isCustom ? "Custom Font" : "Google Font"}
            </span>
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

          <a
            href={fileHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
          >
            <Download size={16} />
            {font.isCustom ? "เปิดไฟล์ฟอนต์" : "รับจาก Google"}
          </a>
        </div>
      </div>

      <div className="my-5 h-px bg-slate-100" />

      <div className="overflow-x-auto pb-2">
        <p
          className="min-h-[1.5em] whitespace-nowrap"
          style={{
            fontFamily,
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