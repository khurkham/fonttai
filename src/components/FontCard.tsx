import { Code, Download } from 'lucide-react';
import type { FontItem } from '../types';
import { getFamily } from '../lib';

type Props = {
  font: FontItem;
  previewText: string;
  fontSize: number;
  textColor: string;
  onShowCode: (font: FontItem) => void;
};

export function FontCard({ font, previewText, fontSize, textColor, onShowCode }: Props) {
  const fontFamily = getFamily(font.name, font.isCustom);
  const fileHref = font.isCustom ? font.fileUrl : `https://fonts.google.com/specimen/${font.name.replace(/\s+/g, '+')}`;
  return (
    <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="font-bold text-gray-900 text-xl flex items-center gap-2">
            {font.name}
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">{font.style}</span>
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
            <p><span className="font-semibold text-gray-700">เจ้าของ:</span> {font.owner}</p>
            <p><span className="font-semibold text-gray-700">ลักษณะ:</span> {font.characteristics}</p>
          </div>
          {font.details && <p className="text-sm text-gray-400 mt-1 italic">{font.details}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onShowCode(font)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium">
            <Code size={16} /> รับโค้ด
          </button>
          <a href={fileHref} target={font.isCustom ? '_blank' : '_blank'} rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium">
            <Download size={16} />
            {font.isCustom ? 'เปิดไฟล์ฟอนต์' : 'รับจาก Google'}
          </a>
        </div>
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div className="overflow-x-auto pb-2">
        <p style={{ fontFamily, fontSize, color: textColor, lineHeight: 1.5 }} className="whitespace-nowrap min-h-[1.5em]">
          {previewText || 'โปรดพิมพ์ข้อความด้านบน'}
        </p>
      </div>
    </article>
  );
}
