import { useEffect, useMemo, useState } from "react";
import { Edit, LogOut, Plus, Trash2, X } from "lucide-react";
import { api } from "./api";
import { FontCard } from "./components/FontCard";
import { Pagination } from "./components/Pagination";
import { SiteFooter } from "./components/SiteFooter";
import { SeoHead } from "./components/SeoHead";
import { CookieBanner } from "./components/CookieBanner";
import { NavbarWithSearch } from "./components/NavbarWithSearch";
import type { ContactMessage, FontItem, VisitorCounter } from "./types";
import { bindConsentScriptLoader } from "./utils/consentScripts";
import {
  ARTICLES,
  ARTICLES_INTRO,
  ARTICLE_CATEGORIES,
  getArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
} from "./data/articles";


type ViewMode = "home" | "admin";
type PublicPage =
  | "home"
  | "about"
  | "services"
  | "privacy"
  | "cookie"
  | "contact"
  | "articles"
  | "article-detail"
  | "notfound";

 
const DEFAULT_PREVIEW =
  "ၾွၼ်ႉတႆး ႁူမ်ၸူမ်းႁပ်ႉတွၼ်ႈ ฟอนต์ไต ยินดีต้อนรับ Font Tai Welcome!";

const SHOW_AD_PLACEHOLDERS = true;

const ALPHABET = [
  "ALL",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];
const FONT_CHARACTERISTIC_OPTIONS = [
  { value: "official", label: "ทางการ" },
  { value: "modern", label: "ทันสมัย" },
  { value: "display", label: "พาดหัว / โปสเตอร์" },
  { value: "body", label: "เนื้อหา อ่านยาว" },
  { value: "handwriting", label: "ลายมือ" },
  { value: "decorative", label: "ตกแต่ง" },
  { value: "traditional", label: "ดั้งเดิม" },
  { value: "Regular", label: "ทางการ" },
  { value: "Bold", label: "พาดหัว / โปสเตอร์" },
  { value: "Italic", label: "ลายมือ" },
] as const;

function getCharacteristicLabel(value: string) {
  const found = FONT_CHARACTERISTIC_OPTIONS.find((item) => item.value === value);
  return found?.label || value;
}

const GOOGLE_FONTS: FontItem[] = [
  {
    id: "g1",
    name: "Tai Heritage Pro",
    style: "Regular",
    owner: "SIL International",
    characteristics: "Serif",
    details: "ฟอนต์ไต (ไทใหญ่) มาตรฐาน รองรับอักขระครบถ้วน",
    isCustom: false,
    sourceUrl: "https://fonts.google.com/specimen/Tai+Heritage+Pro",
    fileKey: "",
    mimeType: "",
    createdAt: "",
    fileUrl: "",
    downloadUrl: "",
  },
  {
    id: "g2",
    name: "Prompt",
    style: "Regular",
    owner: "Cadson Demak",
    characteristics: "Sans Serif",
    details: "ฟอนต์ยอดนิยม ทันสมัย",
    isCustom: false,
    sourceUrl: "https://fonts.google.com/specimen/Prompt",
    fileKey: "",
    mimeType: "",
    createdAt: "",
    fileUrl: "",
    downloadUrl: "",
  },
  {
    id: "g3",
    name: "Sarabun",
    style: "Regular",
    owner: "Suppon Srisawat",
    characteristics: "Serif",
    details: "เหมาะกับเอกสารและงานราชการ",
    isCustom: false,
    sourceUrl: "https://fonts.google.com/specimen/Sarabun",
    fileKey: "",
    mimeType: "",
    createdAt: "",
    fileUrl: "",
    downloadUrl: "",
  },
  {
    id: "g4",
    name: "Mali",
    style: "Regular",
    owner: "Cadson Demak",
    characteristics: "Script",
    details: "เป็นกันเอง อ่านง่าย",
    isCustom: false,
    sourceUrl: "https://fonts.google.com/specimen/Mali",
    fileKey: "",
    mimeType: "",
    createdAt: "",
    fileUrl: "",
    downloadUrl: "",
  },
  {
    id: "g5",
    name: "Kanit",
    style: "Bold",
    owner: "Cadson Demak",
    characteristics: "Sans Serif",
    details: "หนา ชัด เหมาะกับหัวเรื่อง",
    isCustom: false,
    sourceUrl: "https://fonts.google.com/specimen/Kanit",
    fileKey: "",
    mimeType: "",
    createdAt: "",
    fileUrl: "",
    downloadUrl: "",
  },
  {
    id: "g6",
    name: "Chakra Petch",
    style: "Regular",
    owner: "Cadson Demak",
    characteristics: "Display",
    details: "โดดเด่นสำหรับงานดีไซน์",
    isCustom: false,
    sourceUrl: "https://fonts.google.com/specimen/Chakra+Petch",
    fileKey: "",
    mimeType: "",
    createdAt: "",
    fileUrl: "",
    downloadUrl: "",
  },
];



function pageToPath(page: PublicPage, slug?: string): string {
  switch (page) {
    case "about":
      return "/about/";
    case "services":
      return "/services/";
    case "privacy":
      return "/privacy/";
    case "cookie":
      return "/cookie/";
    case "contact":
      return "/contact/";
    case "articles":
      return "/articles/";
    case "article-detail":
      return slug ? `/articles/${slug}/` : "/articles/";
    case "notfound":
      return "/404/";
    case "home":
    default:
      return "/";
  }
}

function pathToPage(pathname: string): PublicPage {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/articles") return "articles";
  if (path.startsWith("/articles/")) return "article-detail";

  switch (path) {
    case "/":
      return "home";
    case "/about":
      return "about";
    case "/services":
      return "services";
    case "/privacy":
      return "privacy";
    case "/cookie":
      return "cookie";
    case "/contact":
      return "contact";
    case "/404":
      return "notfound";
    default:
      return "notfound";
  }
}

function CodeModal({
  font,
  onClose,
}: {
  font: FontItem | null;
  onClose: () => void;
}) {
  if (!font) return null;

  const css = font.isCustom
    ? `@font-face {
  font-family: "${font.name}";
  src: url("${font.fileUrl}") format("truetype");
  font-display: swap;
}

.your-class {
  font-family: "${font.name}", sans-serif;
}`
    : `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${font.sourceUrl.replace(
        "https://fonts.google.com/specimen/",
        "https://fonts.googleapis.com/css2?family="
      )}&display=swap" rel="stylesheet">

.your-class {
  font-family: "${font.name}", sans-serif;
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="text-2xl font-black text-slate-900">
            โค้ดใช้งาน: {font.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-100">
            {css}
          </pre>
        </div>
      </div>
    </div>
  );
}

function LoginModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.login(username, password);
      if (res.ok && res.authenticated) {
        setPassword("");
        await onSuccess();
        onClose();
      } else {
        setError("เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="text-2xl font-black text-slate-900">
            เข้าสู่ระบบหลังบ้าน
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ชื่อผู้ใช้"
          />
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
          />

          {error && (
            <p className="whitespace-pre-wrap text-sm text-red-600">{error}</p>
          )}

          <button
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
            type="submit"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddFontModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [style, setStyle] = useState("Regular");
  const [owner, setOwner] = useState("");
  const [characteristics, setCharacteristics] = useState("official");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !owner || !characteristics || !file) {
      setError("กรุณากรอกข้อมูลให้ครบและเลือกไฟล์ฟอนต์");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", name);
      form.append("style", style);
      form.append("owner", owner);
      form.append("characteristics", characteristics);
      form.append("details", details);
      form.append("file", file);

      await api.createFont(form);

      setName("");
      setStyle("Regular");
      setOwner("");
      setCharacteristics("official");
      setDetails("");
      setFile(null);

      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เพิ่มฟอนต์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="text-2xl font-black text-slate-900">เพิ่มฟอนต์ใหม่</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="ชื่อฟอนต์"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option>Regular</option>
            <option>Bold</option>
            <option>Italic</option>
            <option>Light</option>
            <option>Medium</option>
            <option>SemiBold</option>
          </select>

          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="เจ้าของ"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />

          <select
  className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
  value={characteristics}
  onChange={(e) => setCharacteristics(e.target.value)}
>
  {FONT_CHARACTERISTIC_OPTIONS.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>

          <textarea
            className="input-shan min-h-[120px] rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="รายละเอียด"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <input
            className="rounded-2xl border border-slate-300 px-4 py-3"
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {error && (
            <p className="whitespace-pre-wrap text-sm text-red-600">{error}</p>
          )}

          <button
            className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกฟอนต์"}
          </button>
        </form>
      </div>
    </div>
  );
}

function EditFontModal({
  open,
  font,
  onClose,
  onUpdated,
}: {
  open: boolean;
  font: FontItem | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState("");
  const [style, setStyle] = useState("Regular");
  const [owner, setOwner] = useState("");
const [characteristics, setCharacteristics] = useState("official");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!font) return;
    setName(font.name || "");
    setStyle(font.style || "Regular");
    setOwner(font.owner || "");
setCharacteristics(font.characteristics || "official");
    setDetails(font.details || "");
    setError("");
  }, [font]);

  if (!open || !font) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !style || !owner || !characteristics) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      setLoading(true);
      await api.updateFont(font.id, {
        name,
        style,
        owner,
        characteristics,
        details,
      });
      await onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "แก้ไขฟอนต์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="text-2xl font-black text-slate-900">แก้ไขฟอนต์</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="ชื่อฟอนต์"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option>Regular</option>
            <option>Bold</option>
            <option>Italic</option>
            <option>Light</option>
            <option>Medium</option>
            <option>SemiBold</option>
          </select>

          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="เจ้าของ"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />

          <select
  className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
  value={characteristics}
  onChange={(e) => setCharacteristics(e.target.value)}
>
  {FONT_CHARACTERISTIC_OPTIONS.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>

          <textarea
            className="min-h-[120px] rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="รายละเอียด"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          {error && (
            <p className="whitespace-pre-wrap text-sm text-red-600">{error}</p>
          )}

          <button
            className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StaticPage({
  page,
  onNavigate,
}: {
  page: PublicPage;
  onNavigate: (page: PublicPage) => void;
}) {
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);

  function updateContactField(
    field: "firstName" | "lastName" | "email" | "subject" | "message",
    value: string
  ) {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactError("");
    setContactSuccess("");

    const firstName = contactForm.firstName.trim();
    const lastName = contactForm.lastName.trim();
    const email = contactForm.email.trim();
    const subject = contactForm.subject.trim();
    const message = contactForm.message.trim();

    if (!firstName || !lastName || !email || !subject || !message) {
      setContactError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setContactError("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    try {
      setContactSubmitting(true);

      const res = await api.sendContactMessage({
        firstName,
        lastName,
        email,
        subject,
        message,
      });

      setContactSuccess(res.message || "ส่งข้อมูลเรียบร้อยแล้ว");

      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setContactError(
        err instanceof Error ? err.message : "ไม่สามารถส่งข้อมูลได้"
      );
    } finally {
      setContactSubmitting(false);
    }
  }

  if (page === "privacy") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            Privacy Policy
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            อัปเดตล่าสุด: 21/4/2026
          </p>
        </div>

        <div className="space-y-6 leading-7 text-slate-600">
  <p>
    เว็บไซต์ Font Tai ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งานทุกท่าน
    นโยบายความเป็นส่วนตัวฉบับนี้อธิบายถึงแนวทางการเก็บรวบรวม ใช้ เปิดเผย
    และคุ้มครองข้อมูลที่เกี่ยวข้องกับการใช้งานเว็บไซต์ของเรา
    รวมถึงการใช้บริการจากบุคคลที่สาม เช่น Google AdSense
    เมื่อคุณเข้าใช้งานเว็บไซต์นี้ จะถือว่าคุณได้อ่านและรับทราบนโยบายฉบับนี้แล้ว
  </p>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      1. ข้อมูลที่เราอาจเก็บรวบรวม
    </h2>
    <ul className="mt-3 list-disc space-y-2 pl-6">
      <li>ข้อมูลทางเทคนิค เช่น IP address, ประเภทเบราว์เซอร์, ระบบปฏิบัติการ, ภาษา, วันที่และเวลาที่เข้าใช้งาน</li>
      <li>ข้อมูลการใช้งานเว็บไซต์ เช่น หน้าที่เข้าชม การค้นหา การดูตัวอย่างฟอนต์ และการโต้ตอบกับส่วนต่าง ๆ ของเว็บไซต์</li>
      <li>ข้อมูลจากคุกกี้และเทคโนโลยีที่คล้ายกัน เพื่อช่วยให้เว็บไซต์ทำงานได้อย่างมีประสิทธิภาพ</li>
      <li>ข้อมูลที่ผู้ใช้งานส่งให้เราโดยตรง เช่น ข้อมูลจากแบบฟอร์มติดต่อ</li>
    </ul>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      2. วัตถุประสงค์ในการใช้ข้อมูล
    </h2>
    <ul className="mt-3 list-disc space-y-2 pl-6">
      <li>เพื่อให้บริการและปรับปรุงการทำงานของเว็บไซต์</li>
      <li>เพื่อวิเคราะห์การใช้งานและพัฒนาประสบการณ์ของผู้ใช้</li>
      <li>เพื่อรักษาความปลอดภัยของระบบและป้องกันการใช้งานที่ไม่เหมาะสม</li>
      <li>เพื่อแสดงโฆษณาที่เกี่ยวข้องผ่านบริการ Google AdSense และผู้ให้บริการโฆษณาบุคคลที่สาม</li>
    </ul>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      3. การใช้คุกกี้
    </h2>
    <p className="mt-3">
      เว็บไซต์นี้ใช้คุกกี้เพื่อจดจำการตั้งค่าบางอย่างของผู้ใช้
      ช่วยให้เว็บไซต์ทำงานได้อย่างเหมาะสม วิเคราะห์การใช้งาน
      และรองรับการแสดงโฆษณาจากบุคคลที่สาม
      รายละเอียดเพิ่มเติมเกี่ยวกับประเภทของคุกกี้ที่เราใช้
      สามารถอ่านได้ที่นโยบายคุกกี้ของเว็บไซต์
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      4. การโฆษณาผ่าน Google AdSense และบุคคลที่สาม
    </h2>
    <p className="mt-3">
      เว็บไซต์ Font Tai ใช้บริการ Google AdSense ซึ่งเป็นบริการโฆษณาของ Google LLC
      เพื่อแสดงโฆษณาบนหน้าเว็บไซต์ Google และพันธมิตรโฆษณาที่เป็นบุคคลที่สาม
      อาจใช้คุกกี้และเทคโนโลยีที่คล้ายกัน เช่น Web Beacon
      ในการเก็บข้อมูลการเข้าชมเว็บไซต์ของคุณทั้งบนเว็บไซต์นี้และเว็บไซต์อื่น
      เพื่อแสดงโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ
    </p>
    <p className="mt-3">
      Google ใช้คุกกี้ที่เรียกว่า DoubleClick DART Cookie
      เพื่อแสดงโฆษณาแก่ผู้เข้าชมเว็บไซต์ของเราตามประวัติการเข้าชมเว็บไซต์ทั้งของเราและเว็บไซต์อื่นบนอินเทอร์เน็ต
    </p>
    <p className="mt-3">
      ผู้ใช้งานสามารถปฏิเสธการใช้ DART Cookie
      ได้ที่{" "}
      <a
        href="https://policies.google.com/technologies/ads"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 underline underline-offset-2"
      >
        นโยบายโฆษณาของ Google
      </a>
      {" "}หรือศึกษาวิธีปฏิเสธโฆษณาที่ปรับให้เหมาะกับแต่ละบุคคลได้ที่{" "}
      <a
        href="https://www.aboutads.info/choices/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 underline underline-offset-2"
      >
        aboutads.info/choices
      </a>
    </p>
    <p className="mt-3">
      โปรดทราบว่าเราไม่มีอำนาจควบคุมคุกกี้ที่ใช้โดยผู้ลงโฆษณาบุคคลที่สาม
      หากต้องการข้อมูลเพิ่มเติมเกี่ยวกับการเก็บข้อมูลและแนวทางการปฏิเสธ
      โปรดศึกษาจากนโยบายความเป็นส่วนตัวของผู้ให้บริการโฆษณาแต่ละราย
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      5. การเปิดเผยข้อมูล
    </h2>
    <p className="mt-3">
      เราจะไม่ขายข้อมูลส่วนบุคคลของผู้ใช้งานให้แก่บุคคลภายนอก
      เว้นแต่เป็นกรณีที่กฎหมายกำหนด หรือจำเป็นต่อการปกป้องสิทธิ
      ความปลอดภัย และความน่าเชื่อถือของเว็บไซต์
      อย่างไรก็ตาม เราอาจแบ่งปันข้อมูลทางเทคนิคที่ไม่ระบุตัวตน
      กับผู้ให้บริการบุคคลที่สาม เช่น Google AdSense และผู้ให้บริการวิเคราะห์เว็บไซต์
      เพื่อการให้บริการที่เกี่ยวข้องเท่านั้น
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      6. สิทธิของผู้ใช้งาน
    </h2>
    <p className="mt-3">
      ผู้ใช้งานสามารถเลือกจัดการคุกกี้บางประเภทผ่านระบบตั้งค่าคุกกี้ของเว็บไซต์
      สามารถปฏิเสธโฆษณาที่ปรับให้เหมาะกับแต่ละบุคคลผ่านการตั้งค่าของ Google
      และสามารถติดต่อเราเพื่อสอบถามข้อมูลเพิ่มเติมเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคลได้
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      7. ความปลอดภัยของข้อมูล
    </h2>
    <p className="mt-3">
      เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของผู้ใช้งาน
      อย่างไรก็ตาม การส่งข้อมูลผ่านอินเทอร์เน็ตไม่สามารถรับประกันความปลอดภัยได้ร้อยเปอร์เซ็นต์
      ผู้ใช้งานควรระมัดระวังในการแบ่งปันข้อมูลส่วนบุคคล
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      8. การเปลี่ยนแปลงนโยบาย
    </h2>
    <p className="mt-3">
      เราอาจปรับปรุงนโยบายความเป็นส่วนตัวฉบับนี้เป็นครั้งคราว
      โดยจะแสดงวันที่อัปเดตล่าสุดไว้ที่ส่วนต้นของหน้านี้
      เราขอแนะนำให้ผู้ใช้งานตรวจสอบนโยบายเป็นระยะเพื่อรับทราบการเปลี่ยนแปลง
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      9. ติดต่อเรา
    </h2>
    <p className="mt-3">
      หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้
      กรุณาติดต่อเราผ่านหน้า Contact ของเว็บไซต์
    </p>
  </div>
</div>
      </section>
    );
  }

  if (page === "cookie") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            Cookie Policy
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
            นโยบายคุกกี้
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            อัปเดตล่าสุด: 21/4/2026
          </p>
        </div>

        <div className="space-y-6 leading-7 text-slate-600">
  <p>
    เว็บไซต์ Font Tai ใช้คุกกี้และเทคโนโลยีที่คล้ายกัน
    เพื่อให้เว็บไซต์ทำงานได้อย่างเหมาะสม ช่วยจดจำการตั้งค่าบางอย่าง
    วิเคราะห์การใช้งานเว็บไซต์ และรองรับบริการด้านโฆษณาผ่าน Google AdSense
    และผู้ให้บริการโฆษณาบุคคลที่สามอื่น ๆ
  </p>

  <div>
    <h2 className="text-xl font-bold text-slate-900">1. คุกกี้คืออะไร</h2>
    <p className="mt-3">
      คุกกี้คือไฟล์ข้อมูลขนาดเล็กที่ถูกจัดเก็บไว้ในอุปกรณ์ของคุณเมื่อเข้าใช้งานเว็บไซต์
      เพื่อช่วยให้เว็บไซต์จดจำข้อมูลบางอย่างและปรับปรุงประสบการณ์การใช้งาน
      คุกกี้ที่ใช้บนเว็บไซต์นี้แบ่งออกเป็นคุกกี้ของเว็บไซต์เอง
      และคุกกี้ของบุคคลที่สาม เช่น Google
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      2. ประเภทของคุกกี้ที่เราใช้
    </h2>
    <ul className="mt-3 list-disc space-y-2 pl-6">
      <li>คุกกี้ที่จำเป็นต่อการทำงานของเว็บไซต์ เช่น การยืนยันตัวตนของผู้ดูแลระบบและการบันทึกการตั้งค่าคุกกี้</li>
      <li>คุกกี้เพื่อการวิเคราะห์และวัดผลการใช้งาน เพื่อทำความเข้าใจพฤติกรรมของผู้เข้าชม</li>
      <li>คุกกี้เพื่อจดจำการตั้งค่าหรือฟังก์ชันการใช้งานบางอย่าง เช่น ขนาดตัวอักษรและสีตัวอย่าง</li>
      <li>คุกกี้เพื่อการตลาดและการโฆษณา ซึ่งใช้โดย Google AdSense และพันธมิตรโฆษณา</li>
    </ul>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      3. คุกกี้จาก Google AdSense
    </h2>
    <p className="mt-3">
      เว็บไซต์ Font Tai ใช้บริการโฆษณาจาก Google AdSense
      ซึ่งเป็นผู้ให้บริการโฆษณาบุคคลที่สาม Google ใช้คุกกี้
      โดยเฉพาะคุกกี้ที่เรียกว่า DoubleClick DART Cookie
      เพื่อแสดงโฆษณาแก่ผู้ใช้งานตามประวัติการเข้าชมเว็บไซต์ของเราและเว็บไซต์อื่น
    </p>
    <p className="mt-3">
      ข้อมูลที่ Google และพันธมิตรอาจเก็บผ่านคุกกี้ประกอบด้วย IP address
      ประเภทเบราว์เซอร์ ภาษา หน้าเว็บที่เข้าชม เวลาที่เข้าใช้งาน
      และข้อมูลพฤติกรรมการคลิก เพื่อใช้ในการวัดประสิทธิภาพของโฆษณา
      และนำเสนอโฆษณาที่เกี่ยวข้องกับความสนใจของผู้ใช้
    </p>
    <p className="mt-3">
      คุณสามารถศึกษาข้อมูลเพิ่มเติมเกี่ยวกับวิธีที่ Google
      ใช้ข้อมูลจากเว็บไซต์ของพันธมิตรได้ที่{" "}
      <a
        href="https://policies.google.com/technologies/partner-sites"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 underline underline-offset-2"
      >
        นโยบายของ Google เกี่ยวกับเว็บไซต์พันธมิตร
      </a>
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      4. วัตถุประสงค์ในการใช้คุกกี้
    </h2>
    <ul className="mt-3 list-disc space-y-2 pl-6">
      <li>เพื่อให้เว็บไซต์ทำงานได้อย่างถูกต้อง</li>
      <li>เพื่อวิเคราะห์และปรับปรุงประสิทธิภาพของเว็บไซต์</li>
      <li>เพื่อจดจำการตั้งค่าบางอย่างของผู้ใช้งาน</li>
      <li>เพื่อแสดงโฆษณาที่เกี่ยวข้องผ่าน Google AdSense และพันธมิตรโฆษณาบุคคลที่สาม</li>
      <li>เพื่อวัดประสิทธิภาพและความถี่ของการแสดงโฆษณา</li>
    </ul>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      5. การจัดการและการปฏิเสธคุกกี้
    </h2>
    <p className="mt-3">
      คุณสามารถเลือกยอมรับหรือปฏิเสธคุกกี้บางประเภทได้ผ่านระบบตั้งค่าคุกกี้ของเว็บไซต์
      และสามารถลบหรือปิดใช้งานคุกกี้ผ่านการตั้งค่าเบราว์เซอร์ของคุณได้
    </p>
    <p className="mt-3">
      สำหรับการปฏิเสธโฆษณาที่ปรับให้เหมาะกับแต่ละบุคคลของ Google
      คุณสามารถตั้งค่าได้ที่{" "}
      <a
        href="https://www.google.com/settings/ads"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 underline underline-offset-2"
      >
        การตั้งค่าโฆษณาของ Google
      </a>
      {" "}หรือปฏิเสธคุกกี้สำหรับการโฆษณาแบบรวมจากผู้ให้บริการหลายรายได้ที่{" "}
      <a
        href="https://www.aboutads.info/choices/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 underline underline-offset-2"
      >
        aboutads.info/choices
      </a>
      {" "}และ{" "}
      <a
        href="https://www.youronlinechoices.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 underline underline-offset-2"
      >
        youronlinechoices.com
      </a>
    </p>
    <p className="mt-3">
      โปรดทราบว่าการปิดใช้งานคุกกี้บางประเภทอาจส่งผลต่อการทำงานของเว็บไซต์
      หรือทำให้คุณเห็นโฆษณาที่ไม่เกี่ยวข้องกับความสนใจของคุณ
    </p>
  </div>

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      6. การเปลี่ยนแปลงนโยบายคุกกี้
    </h2>
    <p className="mt-3">
      เราอาจปรับปรุงนโยบายคุกกี้นี้เป็นครั้งคราวเพื่อให้สอดคล้องกับการเปลี่ยนแปลงของเว็บไซต์
      บริการ หรือข้อกำหนดที่เกี่ยวข้อง โดยจะแสดงวันที่ปรับปรุงล่าสุดไว้ในหน้านี้
      เราขอแนะนำให้ตรวจสอบนโยบายเป็นระยะเพื่อรับทราบการเปลี่ยนแปลงล่าสุด
    </p>
  </div>
</div>
      </section>
    );
  }

  if (page === "about") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          About Us
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Font Tai คือเว็บไซต์รวมฟอนต์ไตและฟอนต์ไทยสำหรับพรีวิว ดาวน์โหลด และจัดการฟอนต์ โดยออกแบบมาเพื่อรองรับการใช้งานบนทุกอุปกรณ์ และพร้อมสำหรับการขยายเป็นเว็บไซต์เชิงพาณิชย์ในอนาคต
        </p>
      </section>
    );
  }

  if (page === "services") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Services
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          บริการของเว็บไซต์ Font Tai ได้แก่ พรีวิวฟอนต์ออนไลน์ จัดการฟอนต์อัปโหลดเอง และดาวน์โหลดหรือใช้งานฟอนต์ผ่านเว็บในรูปแบบที่เหมาะกับทุกอุปกรณ์
        </p>
      </section>
    );
  }

  if (page === "contact") {
    return (
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            Contact Form
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            แบบฟอร์มติดต่อกลับ
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            หากต้องการติดต่อสอบถาม แนะนำฟอนต์ แจ้งปัญหาการใช้งาน หรือสอบถามความร่วมมือทางธุรกิจ สามารถส่งข้อมูลมาหาเราได้ผ่านแบบฟอร์มด้านล่าง
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleContactSubmit} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ชื่อ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactForm.firstName}
                onChange={(e) => updateContactField("firstName", e.target.value)}
                placeholder="กรอกชื่อ"
                className="w-full input-shan rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="input-shan mb-2 block text-sm font-semibold text-slate-700">
                นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactForm.lastName}
                onChange={(e) => updateContactField("lastName", e.target.value)}
                placeholder="กรอกนามสกุล"
                className="w-full input-shan rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => updateContactField("email", e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="input-shan mb-2 block text-sm font-semibold text-slate-700">
              หัวข้อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contactForm.subject}
              onChange={(e) => updateContactField("subject", e.target.value)}
              placeholder="หัวข้อที่ต้องการติดต่อ"
              className="input-shan w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="input-shan mb-2 block text-sm font-semibold text-slate-700">
              ข้อความ <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={contactForm.message}
              onChange={(e) => updateContactField("message", e.target.value)}
              placeholder="กรอกรายละเอียดที่ต้องการติดต่อ"
              className="input-shan w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          {contactError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {contactError}
            </div>
          ) : null}

          {contactSuccess ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {contactSuccess}
            </div>
          ) : null}

          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            เมื่อท่านส่งข้อมูลผ่านฟอร์ม จะถือว่าท่านยอมรับใน{" "}
            <button
              type="button"
              onClick={() => onNavigate("privacy")}
              className="font-semibold text-blue-600 underline underline-offset-2"
            >
              นโยบายความเป็นส่วนตัว
            </button>{" "}
            ของเรา
          </div>

          <button
            type="submit"
            disabled={contactSubmitting}
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {contactSubmitting ? "กำลังส่งข้อมูล..." : "ส่งข้อมูล"}
          </button>
        </form>
      </section>
    );
  }

  if (page === "notfound") {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
          Error 404
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
          ไม่พบหน้าที่คุณค้นหา
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          ขออภัย หน้าที่คุณพยายามเข้าถึงอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ในเว็บไซต์นี้แล้ว
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            กลับหน้าแรก
          </button>

          <button
            type="button"
            onClick={() => onNavigate("contact")}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            ติดต่อเรา
          </button>
        </div>
      </section>
    );
  }

  return null;
}

function ContactDetailModal({
  item,
  onClose,
  onMarkRead,
  onDelete,
}: {
  item: ContactMessage | null;
  onClose: () => void;
  onMarkRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              รายละเอียดข้อความติดต่อ
            </h3>
            <p className="mt-1 text-sm text-slate-500">{item.createdAt}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                ชื่อ-นามสกุล
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                {item.firstName} {item.lastName}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                อีเมล
              </p>
              <p className="mt-2 font-semibold text-slate-900">{item.email}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              หัวข้อ
            </p>
            <p className="mt-2 font-semibold text-slate-900">{item.subject}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              ข้อความ
            </p>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
              {item.message}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const subject = encodeURIComponent(`Re: ${item.subject}`);
                const body = encodeURIComponent(
                  `เรียน ${item.firstName} ${item.lastName},\n\nขอบคุณสำหรับการติดต่อเรา\n\n`
                );
                window.location.href = `mailto:${item.email}?subject=${subject}&body=${body}`;
              }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700"
            >
              ตอบกลับอีเมล
            </button>

            {!item.isRead ? (
              <button
                type="button"
                onClick={async () => {
                  await onMarkRead(item.id);
                  onClose();
                }}
                className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white"
              >
                ทำเครื่องหมายว่าอ่านแล้ว
              </button>
            ) : null}

            <button
              type="button"
              onClick={async () => {
                const ok = window.confirm("ต้องการลบข้อความนี้ใช่หรือไม่");
                if (!ok) return;
                await onDelete(item.id);
                onClose();
              }}
              className="rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white"
            >
              ลบข้อความ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; onClick?: () => void }>;
}) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.onClick ? (
            <button
              type="button"
              onClick={item.onClick}
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-medium text-slate-900">{item.label}</span>
          )}

          {index < items.length - 1 ? <span>/</span> : null}
        </div>
      ))}
    </nav>
  );
}

function ArticleTableOfContents({
  headings,
}: {
  headings: Array<{ id: string; label: string }>;
}) {
  if (!headings.length) return null;

  return (
    <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-black text-slate-900">สารบัญ</h2>
      <nav className="mt-4">
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-600"
              >
                {heading.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function ArticlesPage({
  onOpenArticle,
  onNavigateHome,
}: {
  onOpenArticle: (slug: string) => void;
  onNavigateHome: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Breadcrumbs
        items={[{ label: "หน้าแรก", onClick: onNavigateHome }, { label: "บทความ" }]}
      />

      <div className="mb-10">
        <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          Articles
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          บทความและคู่มือการใช้งานฟอนต์ไต
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          {ARTICLES_INTRO}
        </p>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {ARTICLE_CATEGORIES.map((category) => (
          <div
            key={category.key}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <h2 className="text-base font-bold text-slate-900">{category.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {category.description}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ARTICLES.map((article) => (
          <article
            key={article.slug}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-4">
                <span className="inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  {article.categoryLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{article.updatedAt}</span>
                <span>•</span>
                <span>{article.readingTime}</span>
                <span>•</span>
                <span>{article.author}</span>
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-slate-900 transition group-hover:text-blue-700">
                {article.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {article.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {article.keywords.slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    บทความแนะนำ
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    อ่านคู่มือฉบับเต็ม
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenArticle(article.slug)}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  อ่านต่อ
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ArticleDetailPage({
  slug,
  onOpenArticle,
  onBackToArticles,
  onNavigateHome,
}: {
  slug: string | null;
  onOpenArticle: (slug: string) => void;
  onBackToArticles: () => void;
  onNavigateHome: () => void;
}) {
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">ไม่พบบทความ</h1>
        <p className="mt-3 text-slate-600">
          บทความที่คุณต้องการอาจถูกลบ เปลี่ยนลิงก์ หรือยังไม่ได้เผยแพร่
        </p>
        <button
          type="button"
          onClick={onBackToArticles}
          className="mt-6 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white"
        >
          กลับหน้าบทความ
        </button>
      </section>
    );
  }

  const relatedArticles = getRelatedArticles(article.slug, 3);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Breadcrumbs
        items={[
          { label: "หน้าแรก", onClick: onNavigateHome },
          { label: "บทความ", onClick: onBackToArticles },
          { label: article.title },
        ]}
      />

      <div className="mb-8">
        <button
          type="button"
          onClick={onBackToArticles}
          className="text-sm font-semibold text-blue-600"
        >
          ← กลับหน้าบทความ
        </button>

        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-blue-600">
          {article.categoryLabel}
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight leading-[1.35] text-slate-900 sm:text-4xl">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{article.updatedAt}</span>
          <span>•</span>
          <span>{article.readingTime}</span>
          <span>•</span>
          <span>{article.author}</span>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-[280px] w-full object-cover sm:h-[360px]"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0">
<p className="mb-8 text-base leading-8 text-slate-700 whitespace-normal break-words">
  {article.description}
</p>

<div className="space-y-10">
  {article.sections.map((section) => (
    <section key={section.id} id={section.id} className="scroll-mt-28">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        {section.heading}
      </h2>

      <div className="mt-4 space-y-5 leading-8 text-slate-700">
        {section.body
          .split("\n\n")
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index} className="whitespace-normal break-words">
              {paragraph}
            </p>
          ))}
      </div>
    </section>
  ))}
</div>
        </article>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <ArticleTableOfContents headings={article.headings} />
        </div>
      </div>

      {relatedArticles.length > 0 && (
        <div className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-black text-slate-900">บทความที่เกี่ยวข้อง</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedArticles.map((item) => (
              <article
                key={item.slug}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-4">
                    <span className="inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                      {item.categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{item.updatedAt}</span>
                    <span>•</span>
                    <span>{item.readingTime}</span>
                  </div>

                  <h3 className="mt-3 text-xl font-black leading-tight text-slate-900 transition group-hover:text-blue-700">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => onOpenArticle(item.slug)}
                    className="mt-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    อ่านต่อ
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [articleSlug, setArticleSlug] = useState<string | null>(() => {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname.startsWith("/articles/")) {
    const slug = pathname.replace("/articles/", "").replace(/\/+$/, "");
    return slug || null;
  }
  return null;
});
  const [selectedContact, setSelectedContact] =
    useState<ContactMessage | null>(null);
  const [adminTab, setAdminTab] = useState<"fonts" | "contacts" | "stats">(
    "fonts"
  );
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [contactLoading, setContactLoading] = useState(false);

  const [stats, setStats] = useState<VisitorCounter>({
    totalVisitors: 0,
    todayVisitors: 0,
    onlineNow: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW);
  const [search, setSearch] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState("#1f2937");
  const [editFont, setEditFont] = useState<FontItem | null>(null);
  const [showEditFont, setShowEditFont] = useState(false);
  const [customFonts, setCustomFonts] = useState<FontItem[]>([]);
  const [isAuthed, setIsAuthed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [publicPage, setPublicPage] = useState<PublicPage>(() =>
    pathToPage(window.location.pathname)
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [letterFilter, setLetterFilter] = useState<string>("ALL");

  const [codeFont, setCodeFont] = useState<FontItem | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddFont, setShowAddFont] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadContactMessages() {
    try {
      setContactLoading(true);
      const res = await api.getContactMessages();
      setContactMessages(res.items || []);
    } catch {
      setContactMessages([]);
    } finally {
      setContactLoading(false);
    }
  }

  async function loadStats() {
    try {
      setStatsLoading(true);
      const res = await api.getVisitorCounter();
      setStats(res.stats);
    } catch {
      setStats({
        totalVisitors: 0,
        todayVisitors: 0,
        onlineNow: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  }

  async function sendHeartbeat() {
    try {
      await api.visitorHeartbeat(pageToPath(publicPage));
    } catch {
      // เงียบไว้เพื่อไม่รบกวนผู้ใช้
    }
  }

  async function handleExportContactCsv() {
    try {
      const blob = await api.exportContactMessagesCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contact-messages.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export CSV ไม่สำเร็จ");
    }
  }

  function handleReplyEmail(item: ContactMessage) {
    const subject = encodeURIComponent(`Re: ${item.subject}`);
    const body = encodeURIComponent(
      `เรียน ${item.firstName} ${item.lastName},\n\nขอบคุณสำหรับการติดต่อเรา\n\n`
    );
    window.location.href = `mailto:${item.email}?subject=${subject}&body=${body}`;
  }

  async function handleMarkContactAsRead(id: string) {
    try {
      await api.markContactAsRead(id);
      await loadContactMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "อัปเดตสถานะไม่สำเร็จ");
    }
  }

  async function handleDeleteContactMessage(id: string) {
    try {
      await api.deleteContactMessage(id);
      await loadContactMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบข้อความไม่สำเร็จ");
    }
  }

  async function loadFonts() {
    try {
      const res = await api.getFonts();
      setCustomFonts(res.items || []);
    } catch {
      setCustomFonts([]);
    }
  }

  async function checkAuth() {
    try {
      const res = await api.me();
      setIsAuthed(Boolean(res.authenticated));
      if (!res.authenticated && viewMode === "admin") {
        setViewMode("home");
      }
    } catch {
      setIsAuthed(false);
      if (viewMode === "admin") setViewMode("home");
    }
  }

  useEffect(() => {
    if (viewMode === "admin" && isAuthed && adminTab === "contacts") {
      loadContactMessages();
    }
  }, [viewMode, isAuthed, adminTab]);

  useEffect(() => {
    if (viewMode === "admin" && isAuthed && adminTab === "stats") {
      loadStats();
    }
  }, [viewMode, isAuthed, adminTab]);

  useEffect(() => {
    sendHeartbeat();

    const interval = window.setInterval(() => {
      sendHeartbeat();
    }, 25000);

    return () => window.clearInterval(interval);
  }, [publicPage]);

  useEffect(() => {
  const interval = window.setInterval(() => {
    if (viewMode === "admin" && isAuthed && adminTab === "stats") {
      loadStats();
    }
  }, 5000);

  return () => window.clearInterval(interval);
}, [viewMode, isAuthed, adminTab]);


  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadFonts(), checkAuth(), loadStats()]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
  const handlePopState = () => {
    const pathname = window.location.pathname;
    const nextPage = pathToPage(pathname);

    setPublicPage(nextPage);
    setViewMode("home");

    if (nextPage === "article-detail") {
      const slug = pathname.replace(/\/+$/, "").replace("/articles/", "");
      setArticleSlug(slug || null);
    } else {
      setArticleSlug(null);
    }
  };

  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, []);

  const allFonts = useMemo(() => {
    const merged = [...customFonts, ...GOOGLE_FONTS];
    const q = search.trim().toLowerCase();

    let result = merged;

    if (letterFilter !== "ALL") {
      result = result.filter((font) =>
        font.name.trim().toUpperCase().startsWith(letterFilter)
      );
    }

    if (!q) return result;

    return result.filter((font) =>
      [font.name, font.owner, font.characteristics, font.style, font.details]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [customFonts, search, letterFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize, letterFilter]);

  useEffect(() => {
  const cleanup = bindConsentScriptLoader();
  return cleanup;
}, []);

  const totalPages = Math.max(1, Math.ceil(allFonts.length / pageSize));
  const paginatedFonts = allFonts.slice((page - 1) * pageSize, page * pageSize);

  async function handleLogout() {
    try {
      await api.logout();
    } finally {
      setIsAuthed(false);
      setViewMode("home");
    }
  }

  async function handleDeleteFont(id: string) {
    const ok = window.confirm("ต้องการลบฟอนต์นี้ใช่หรือไม่");
    if (!ok) return;

    try {
      await api.deleteFont(id);
      await loadFonts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบฟอนต์ไม่สำเร็จ");
    }
  }

  function navigateToPage(page: PublicPage) {
  const nextPath = pageToPath(page);
  if (window.location.pathname !== nextPath) {
    window.history.pushState({}, "", nextPath);
  }
  setPublicPage(page);
  if (page !== "article-detail") {
    setArticleSlug(null);
  }
  setViewMode("home");
}

  function openArticle(slug: string) {
  const nextPath = pageToPath("article-detail", slug);
  if (window.location.pathname !== nextPath) {
    window.history.pushState({}, "", nextPath);
  }
  setArticleSlug(slug);
  setPublicPage("article-detail");
  setViewMode("home");
}


const currentArticle = articleSlug ? getArticleBySlug(articleSlug) : undefined;
  const seoTitle =
  publicPage === "article-detail" && currentArticle
    ? `${currentArticle.title} | Font Tai`
    : publicPage === "articles"
    ? "บทความและคู่มือการใช้งานฟอนต์ไต | Font Tai"
    : publicPage === "privacy"
    ? "Privacy Policy - นโยบายความเป็นส่วนตัว | Font Tai"
    : publicPage === "cookie"
    ? "Cookie Policy - นโยบายคุกกี้ | Font Tai"
    : publicPage === "about"
    ? "About Font Tai - เว็บไซต์รวมฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย"
    : publicPage === "services"
    ? "Services - Preview, Download & Font Embed Code | Font Tai"
    : publicPage === "contact"
    ? "Contact Font Tai - ติดต่อสอบถาม แนะนำฟอนต์ และแจ้งปัญหา"
    : publicPage === "notfound"
    ? "404 Not Found | Font Tai"
    : "Font Tai ၾွၼ်ႉတႆး - ฟอนต์ไต ฟอนต์ไทใหญ่ Shan Font Preview & Download";

const seoDescription =
  publicPage === "article-detail" && currentArticle
    ? currentArticle.description
    : publicPage === "articles"
    ? ARTICLES_INTRO
    : publicPage === "home"
    ? "Font Tai ၾွၼ်ႉတႆး แหล่งรวมฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย สำหรับพรีวิวฟอนต์ออนไลน์ ดาวน์โหลดฟอนต์ และดูโค้ดฝังฟอนต์บนเว็บไซต์ รองรับภาษาไต ภาษาไทย และทุกอุปกรณ์"
    : publicPage === "about"
    ? "รู้จัก Font Tai เว็บไซต์รวมฟอนต์ไต ฟอนต์ไทใหญ่ ฟอนต์ไทย และ Tai font ที่ช่วยให้พรีวิวฟอนต์ ดาวน์โหลดฟอนต์ และนำฟอนต์ไปใช้งานบนเว็บไซต์ได้ง่ายขึ้น"
    : publicPage === "services"
    ? "บริการของ Font Tai ครอบคลุมการพรีวิวฟอนต์ออนไลน์ ดาวน์โหลดฟอนต์ ดูโค้ดฝังฟอนต์ และจัดการฟอนต์สำหรับใช้งานบนเว็บไซต์ทั้งภาษาไต ภาษาไทย และภาษาอังกฤษ"
    : publicPage === "contact"
    ? "ติดต่อทีมงาน Font Tai เพื่อสอบถามการใช้งานเว็บไซต์ แนะนำฟอนต์ แจ้งปัญหาการดาวน์โหลดฟอนต์ หรือพูดคุยเรื่องการใช้งานฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย"
    : publicPage === "privacy"
    ? "อ่านนโยบายความเป็นส่วนตัวของ Font Tai เพื่อดูแนวทางการเก็บ ใช้ และคุ้มครองข้อมูลผู้ใช้งาน"
    : publicPage === "cookie"
    ? "อ่านนโยบายคุกกี้ของ Font Tai เพื่อทำความเข้าใจประเภทของคุกกี้ที่ใช้"
    : publicPage === "notfound"
    ? "ไม่พบหน้าที่คุณค้นหาบนเว็บไซต์ Font Tai"
    : "Font Tai เว็บไซต์รวมฟอนต์ไต ฟอนต์ไทใหญ่ ฟอนต์ไทย และ Shan font สำหรับพรีวิวออนไลน์ ดาวน์โหลด และฝังฟอนต์บนเว็บไซต์";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        path={pageToPath(publicPage, articleSlug || undefined)}
        image="/og-image.jpg"
      />

      <div className="flex min-h-screen flex-col">
        <NavbarWithSearch
          search={search}
          onSearchChange={setSearch}
          publicPage={publicPage}
          onNavigate={navigateToPage}
        />

        <main className="mx-auto mt-[96px] w-full max-w-7xl flex-1 px-4 py-8">
          {viewMode === "admin" && isAuthed ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-4xl font-black tracking-tight">
                    ระบบจัดการเว็บไซต์
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    จัดการฟอนต์ ตรวจสอบข้อความติดต่อ และดูสถิติผู้เข้าใช้งาน
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {adminTab === "contacts" ? (
                    <button
                      type="button"
                      onClick={handleExportContactCsv}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                    >
                      Export CSV
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setShowAddFont(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white"
                  >
                    <Plus size={18} />
                    เพิ่มฟอนต์
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white"
                  >
                    <LogOut size={18} />
                    ออกจากระบบ
                  </button>
                </div>
              </div>

              <div className="mb-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setAdminTab("fonts")}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    adminTab === "fonts"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  จัดการฟอนต์
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab("contacts")}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    adminTab === "contacts"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  ข้อความติดต่อ
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab("stats")}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    adminTab === "stats"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  สถิติ
                </button>
              </div>

              {adminTab === "fonts" ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[760px] border-collapse">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          ชื่อ
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          สไตล์
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          เจ้าของ
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          ลักษณะ
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          ประเภท
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allFonts.map((font) => (
                        <tr key={font.id} className="border-t border-slate-200">
                          <td className="px-4 py-4 font-semibold">{font.name}</td>
                          <td className="px-4 py-4">{font.style}</td>
                          <td className="px-4 py-4">{font.owner}</td>
                          <td className="px-4 py-4">{getCharacteristicLabel(font.characteristics)}</td>
                          <td className="px-4 py-4">
                            {font.isCustom ? "Custom" : "Google"}
                          </td>
                          <td className="px-4 py-4">
                            {font.isCustom ? (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditFont(font);
                                    setShowEditFont(true);
                                  }}
                                  className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 font-medium text-blue-600"
                                >
                                  <Edit size={16} />
                                  แก้ไข
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteFont(font.id)}
                                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 font-medium text-red-600"
                                >
                                  <Trash2 size={16} />
                                  ลบ
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : adminTab === "contacts" ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[1100px] border-collapse">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          สถานะ
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          วันที่
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          ชื่อ-นามสกุล
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          อีเมล
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          หัวข้อ
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          ข้อความ
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactLoading ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-slate-500"
                          >
                            กำลังโหลดข้อความติดต่อ...
                          </td>
                        </tr>
                      ) : contactMessages.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-slate-500"
                          >
                            ยังไม่มีข้อความติดต่อ
                          </td>
                        </tr>
                      ) : (
                        contactMessages.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-200 align-top"
                          >
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                  item.isRead
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {item.isRead ? "อ่านแล้ว" : "ยังไม่อ่าน"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {item.createdAt}
                            </td>
                            <td className="px-4 py-4 font-medium text-slate-900">
                              {item.firstName} {item.lastName}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {item.email}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-slate-900">
                              {item.subject}
                            </td>
                            <td className="px-4 py-4 text-sm leading-6 text-slate-600">
                              <div className="max-w-[320px] whitespace-pre-wrap line-clamp-3">
                                {item.message}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedContact(item)}
                                  className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"
                                >
                                  ดูรายละเอียด
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleReplyEmail(item)}
                                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                                >
                                  ตอบกลับอีเมล
                                </button>

                                {!item.isRead ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMarkContactAsRead(item.id)
                                    }
                                    className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
                                  >
                                    อ่านแล้ว
                                  </button>
                                ) : null}

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const ok = window.confirm(
                                      "ต้องการลบข้อความนี้ใช่หรือไม่"
                                    );
                                    if (!ok) return;
                                    await handleDeleteContactMessage(item.id);
                                  }}
                                  className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                                >
                                  ลบ
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm font-medium text-slate-500">
                        ผู้เข้าชมทั้งหมด
                      </p>
                      <p className="mt-3 text-4xl font-black text-slate-900">
                        {statsLoading
                          ? "..."
                          : stats.totalVisitors.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm font-medium text-slate-500">
                        ผู้เข้าชมวันนี้
                      </p>
                      <p className="mt-3 text-4xl font-black text-slate-900">
                        {statsLoading
                          ? "..."
                          : stats.todayVisitors.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm font-medium text-slate-500">
                        ออนไลน์ตอนนี้
                      </p>
                      <p className="mt-3 text-4xl font-black text-emerald-600">
                        {statsLoading ? "..." : stats.onlineNow.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <h3 className="text-2xl font-black text-slate-900">
                        ตารางสรุปสถิติ
                      </h3>

                      <button
                        type="button"
                        onClick={loadStats}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        รีเฟรชข้อมูล
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full min-w-[640px] border-collapse">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                              รายการ
                            </th>
                            <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                              ค่า
                            </th>
                            <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                              หมายเหตุ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-slate-200">
                            <td className="px-4 py-4 font-medium text-slate-900">
                              ผู้เข้าชมทั้งหมด
                            </td>
                            <td className="px-4 py-4 text-slate-700">
                              {stats.totalVisitors.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-500">
                              นับจาก IP hash ไม่ซ้ำในฐานข้อมูล
                            </td>
                          </tr>

                          <tr className="border-t border-slate-200">
                            <td className="px-4 py-4 font-medium text-slate-900">
                              ผู้เข้าชมวันนี้
                            </td>
                            <td className="px-4 py-4 text-slate-700">
                              {stats.todayVisitors.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-500">
                              นับเฉพาะข้อมูลของวันปัจจุบัน
                            </td>
                          </tr>

                          <tr className="border-t border-slate-200">
                            <td className="px-4 py-4 font-medium text-slate-900">
                              ออนไลน์ตอนนี้
                            </td>
                            <td className="px-4 py-4 font-semibold text-emerald-600">
                              {stats.onlineNow.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-500">
                              ประมาณการจากผู้เข้าชมในช่วง 5 นาทีล่าสุด
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      หน้านี้รีเฟรชอัตโนมัติทุก 5 วินาทีเมื่อเปิดแท็บสถิติอยู่
                    </p>
                  </div>
                </div>
              )}
            </section>
          ) : publicPage === "articles" ? (
  <ArticlesPage
              onOpenArticle={openArticle}
              onNavigateHome={() => navigateToPage("home")}
            />
) : publicPage === "article-detail" ? (
 <ArticleDetailPage
  slug={articleSlug}
  onOpenArticle={openArticle}
  onBackToArticles={() => navigateToPage("articles")}
  onNavigateHome={() => navigateToPage("home")}
/>
) : publicPage !== "home" ? (
  <StaticPage page={publicPage} onNavigate={navigateToPage} />
) : (
            <>
              <section className="mb-6 rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
                      Font Preview Platform
                    </p>

                    <h2 className="input-shan text-3xl font-black tracking-tight leading-[1.45] text-slate-900 sm:text-4xl sm:leading-[1.5]">
                      ၽၢင်ႁၢင်ႈၾွၼ်ႉတႆး ယူႇၼီႇၶူတ်ႉ
                      <br />
                      ႁၼ်သႃႇတၢႆႇၵမ်းသိုဝ်ႈ 
                      <br />
                      မီးပႃးၶူတ်ႉၾွၼ်ႉတႃႇၽင်ၼႂ်းဝဵပ်ႉသၢႆႉ
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      พรีวิวฟอนต์ไต ค้นหาฟอนต์ได้ง่าย มีโค้ดสำหรับฝังฟอนต์ในเว็บไซต์ และสามารถโหลดฟอนต์ .ttf ไปใช้ได้
                    </p>
                  </div>

                
                </div>
              </section>

              <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
                  <input
                    className="input-shan w-full min-w-0 rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none focus:border-blue-400"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="พิมพ์ข้อความสำหรับพรีวิว"
                  />

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={16}
                      max={96}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                    />
                    <span className="min-w-[70px] text-2xl font-black">
                      {fontSize}px
                    </span>
                  </div>

                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-12 w-16 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    className="input-shan w-full min-w-0 rounded-2xl border border-slate-300 px-5 py-4 text-base outline-none focus:border-blue-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาฟอนต์"
                  />

                  <select
                    className="rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-400"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value={10}>แสดง 10 ฟอนต์</option>
                    <option value={20}>แสดง 20 ฟอนต์</option>
                    <option value={30}>แสดง 30 ฟอนต์</option>
                  </select>
                </div>
              </section>

              <div className="sticky top-[88px] z-30 -mx-4 mb-6 border-b border-slate-200/70 bg-slate-50/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-slate-50/70">
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  {ALPHABET.map((letter) => {
                    const isActive = letterFilter === letter;
                    const isAll = letter === "ALL";
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => setLetterFilter(letter)}
                        aria-pressed={isActive}
                        className={`min-w-[36px] rounded-xl px-2.5 py-1.5 text-sm font-bold transition sm:min-w-[40px] sm:px-3 sm:py-2 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        } ${isAll ? "px-3 sm:px-4" : ""}`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>

                {letterFilter !== "ALL" ? (
                  <p className="mt-2 text-center text-xs text-slate-500">
                    แสดงเฉพาะฟอนต์ที่ขึ้นต้นด้วยตัวอักษร {letterFilter} (
                    {allFonts.length} รายการ)
                  </p>
                ) : null}
              </div>

              

              {loading ? (
                <p className="text-lg text-slate-500">กำลังโหลดฟอนต์...</p>
              ) : paginatedFonts.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                  ยังไม่มีฟอนต์ให้แสดง
                </div>
              ) : (
                <section className="flex flex-col gap-6">
                  {paginatedFonts.map((font, index) => (
                    <div key={font.id}>
                      <FontCard
                        font={font}
                        previewText={previewText}
                        fontSize={fontSize}
                        textColor={textColor}
                        onShowCode={setCodeFont}
                      />

                    </div>
                  ))}
                </section>
              )}

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />

              
            </>
          )}
        </main>

        <SiteFooter
          onNavigate={navigateToPage}
          onAdminClick={() => setShowLogin(true)}
        />
      </div>

      <CodeModal font={codeFont} onClose={() => setCodeFont(null)} />

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={async () => {
          setIsAuthed(true);
          setViewMode("admin");
          await Promise.all([loadFonts(), loadContactMessages(), loadStats()]);
        }}
      />

      <EditFontModal
        open={showEditFont}
        font={editFont}
        onClose={() => {
          setShowEditFont(false);
          setEditFont(null);
        }}
        onUpdated={async () => {
          await loadFonts();
        }}
      />

      <AddFontModal
        open={showAddFont}
        onClose={() => setShowAddFont(false)}
        onCreated={async () => {
          await loadFonts();
        }}
      />

      <ContactDetailModal
        item={selectedContact}
        onClose={() => setSelectedContact(null)}
        onMarkRead={handleMarkContactAsRead}
        onDelete={handleDeleteContactMessage}
      />

      <CookieBanner onNavigate={(page) => navigateToPage(page)} />
    </div>
  );
}