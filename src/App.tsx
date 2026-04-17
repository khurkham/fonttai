import { useEffect, useMemo, useState } from "react";
import { Edit, LogOut, Plus, Trash2, X } from "lucide-react";
import { api } from "./api";
import { FontCard } from "./components/FontCard";
import { Pagination } from "./components/Pagination";
import { SiteFooter } from "./components/SiteFooter";
import { AdSlot } from "./components/AdSlot";
import { SeoHead } from "./components/SeoHead";
import { CookieBanner } from "./components/CookieBanner";
import type { FontItem } from "./types";
import { NavbarWithSearch } from "./components/NavbarWithSearch";

type ViewMode = "home" | "admin";
type PublicPage =
  | "home"
  | "about"
  | "services"
  | "privacy"
  | "cookie"
  | "contact"
  | "notfound";

const DEFAULT_PREVIEW =
  "สวัสดีชาวโลก ၵေႃႈမိူင်းတႆး 👋 The quick brown fox jumps over the lazy dog.";

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

function pageToPath(page: PublicPage): string {
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
    case "notfound":
      return "/404/";
    case "home":
    default:
      return "/";
  }
}

function pathToPage(pathname: string): PublicPage {
  const path = pathname.replace(/\/+$/, "") || "/";

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
  onSuccess: () => void;
}) {
  const [username, setUsername] = useState("admin");
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
        onSuccess();
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
          <h3 className="text-2xl font-black text-slate-900">เข้าสู่ระบบหลังบ้าน</h3>
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

          {error && <p className="whitespace-pre-wrap text-sm text-red-600">{error}</p>}

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
  const [characteristics, setCharacteristics] = useState("");
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
      setCharacteristics("");
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

          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="ลักษณะ"
            value={characteristics}
            onChange={(e) => setCharacteristics(e.target.value)}
          />

          <textarea
            className="min-h-[120px] rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
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

          {error && <p className="whitespace-pre-wrap text-sm text-red-600">{error}</p>}

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
  const [characteristics, setCharacteristics] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!font) return;
    setName(font.name || "");
    setStyle(font.style || "Regular");
    setOwner(font.owner || "");
    setCharacteristics(font.characteristics || "");
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

          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="ลักษณะ"
            value={characteristics}
            onChange={(e) => setCharacteristics(e.target.value)}
          />

          <textarea
            className="min-h-[120px] rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="รายละเอียด"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          {error && <p className="whitespace-pre-wrap text-sm text-red-600">{error}</p>}

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

  function updateContactField(
    field: "firstName" | "lastName" | "email" | "subject" | "message",
    value: string
  ) {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleContactSubmit(e: React.FormEvent) {
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

    setContactSuccess("ส่งข้อมูลเรียบร้อยแล้ว (ตัวอย่างฟอร์ม สามารถเชื่อมต่อ backend ภายหลังได้)");
    setContactForm({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    });
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
            อัปเดตล่าสุด: [ใส่วันที่]
          </p>
        </div>

        <div className="space-y-6 leading-7 text-slate-600">
          <p>
            เว็บไซต์ Font Tai ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งานทุกท่าน
            นโยบายฉบับนี้อธิบายถึงวิธีการเก็บรวบรวม ใช้ เปิดเผย
            และคุ้มครองข้อมูลของผู้ใช้งานเมื่อเข้าใช้บริการเว็บไซต์ของเรา
            หากคุณใช้งานเว็บไซต์นี้ต่อไป จะถือว่าคุณรับทราบและยอมรับนโยบายฉบับนี้
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              1. ข้อมูลที่เราอาจเก็บรวบรวม
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                ข้อมูลทางเทคนิค เช่น IP address, ประเภทเบราว์เซอร์,
                ระบบปฏิบัติการ, ภาษา, วันที่และเวลาที่เข้าใช้งาน
              </li>
              <li>
                ข้อมูลการใช้งานเว็บไซต์ เช่น หน้าที่เข้าชม การค้นหาฟอนต์
                การกดดูรายละเอียด และการดาวน์โหลดฟอนต์
              </li>
              <li>
                ข้อมูลจากคุกกี้และเทคโนโลยีที่คล้ายกัน
                เพื่อช่วยให้เว็บไซต์ทำงานได้อย่างมีประสิทธิภาพ
              </li>
              <li>
                ข้อมูลที่ผู้ใช้งานให้กับเราโดยตรง เช่น
                ข้อมูลจากแบบฟอร์มติดต่อ หรือข้อมูลที่ใช้เข้าสู่ระบบผู้ดูแล
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              2. วัตถุประสงค์ในการใช้ข้อมูล
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>เพื่อให้บริการและปรับปรุงเว็บไซต์</li>
              <li>เพื่อวิเคราะห์การใช้งานและพัฒนาประสบการณ์ผู้ใช้</li>
              <li>เพื่อรักษาความปลอดภัยของระบบ</li>
              <li>เพื่อรองรับบริการจากบุคคลที่สาม เช่น Google AdSense ในอนาคต</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              3. การใช้คุกกี้และเทคโนโลยีที่คล้ายกัน
            </h2>
            <p className="mt-3">
              เว็บไซต์นี้อาจใช้คุกกี้เพื่อจดจำการตั้งค่า ช่วยให้เว็บไซต์ทำงานได้ดีขึ้น
              วิเคราะห์การใช้งาน และรองรับการแสดงโฆษณาในอนาคต
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              4. การเปิดเผยข้อมูล
            </h2>
            <p className="mt-3">
              เราจะไม่ขายหรือเผยแพร่ข้อมูลส่วนบุคคลของผู้ใช้งานโดยไม่จำเป็น
              เว้นแต่เป็นไปตามกฎหมายหรือเพื่อคุ้มครองความปลอดภัยของระบบ
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              5. ติดต่อเรา
            </h2>
            <p className="mt-3">
              หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อผ่านหน้า Contact ของเว็บไซต์
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
            อัปเดตล่าสุด: [ใส่วันที่]
          </p>
        </div>

        <div className="space-y-6 leading-7 text-slate-600">
          <p>
            เว็บไซต์ Font Tai ใช้คุกกี้และเทคโนโลยีที่คล้ายกัน
            เพื่อให้เว็บไซต์ทำงานได้อย่างเหมาะสม ปรับปรุงประสบการณ์ของผู้ใช้งาน
            วิเคราะห์การใช้งาน และรองรับบริการโฆษณาในอนาคต
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-900">1. คุกกี้คืออะไร</h2>
            <p className="mt-3">
              คุกกี้คือไฟล์ข้อมูลขนาดเล็กที่ถูกบันทึกไว้ในอุปกรณ์ของคุณ
              เมื่อคุณเข้าใช้งานเว็บไซต์ เพื่อช่วยให้เว็บไซต์จดจำข้อมูลบางอย่าง
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              2. ประเภทของคุกกี้ที่เราอาจใช้
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>คุกกี้ที่จำเป็นต่อการทำงานของเว็บไซต์</li>
              <li>คุกกี้เพื่อการวิเคราะห์และวัดผลการใช้งาน</li>
              <li>คุกกี้เพื่อการโฆษณาและการแสดงเนื้อหาที่เหมาะสม</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              3. การจัดการคุกกี้
            </h2>
            <p className="mt-3">
              คุณสามารถจัดการ ลบ หรือปิดใช้งานคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์ของคุณ
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
          Font Tai คือเว็บไซต์รวมฟอนต์ไตและฟอนต์ไทยสำหรับพรีวิว ดาวน์โหลด
          และจัดการฟอนต์ โดยออกแบบมาเพื่อรองรับการใช้งานบนทุกอุปกรณ์
          และพร้อมสำหรับการขยายเป็นเว็บไซต์เชิงพาณิชย์ในอนาคต
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
          บริการของเว็บไซต์ Font Tai ได้แก่ พรีวิวฟอนต์ออนไลน์
          จัดการฟอนต์อัปโหลดเอง และดาวน์โหลดหรือใช้งานฟอนต์ผ่านเว็บในรูปแบบที่เหมาะกับทุกอุปกรณ์
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
            หากต้องการติดต่อสอบถาม แนะนำฟอนต์ แจ้งปัญหาการใช้งาน
            หรือสอบถามความร่วมมือทางธุรกิจ สามารถส่งข้อมูลมาหาเราได้ผ่านแบบฟอร์มด้านล่าง
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
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactForm.lastName}
                onChange={(e) => updateContactField("lastName", e.target.value)}
                placeholder="กรอกนามสกุล"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              หัวข้อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contactForm.subject}
              onChange={(e) => updateContactField("subject", e.target.value)}
              placeholder="หัวข้อที่ต้องการติดต่อ"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ข้อความ <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={contactForm.message}
              onChange={(e) => updateContactField("message", e.target.value)}
              placeholder="กรอกรายละเอียดที่ต้องการติดต่อ"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
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
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
          >
            ส่งข้อมูล
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
          ขออภัย หน้าที่คุณพยายามเข้าถึงอาจถูกลบ เปลี่ยนชื่อ
          หรือไม่มีอยู่ในเว็บไซต์นี้แล้ว
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

export default function App() {
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

  const [codeFont, setCodeFont] = useState<FontItem | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddFont, setShowAddFont] = useState(false);
  const [loading, setLoading] = useState(true);

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
    (async () => {
      setLoading(true);
      await Promise.all([loadFonts(), checkAuth()]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPublicPage(pathToPage(window.location.pathname));
      setViewMode("home");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const allFonts = useMemo(() => {
    const merged = [...customFonts, ...GOOGLE_FONTS];
    const q = search.trim().toLowerCase();

    if (!q) return merged;

    return merged.filter((font) =>
      [font.name, font.owner, font.characteristics, font.style, font.details]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [customFonts, search]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

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
    setViewMode("home");
  }

  const seoTitle =
    publicPage === "privacy"
      ? "Privacy Policy | Font Tai"
      : publicPage === "cookie"
      ? "Cookie Policy | Font Tai"
      : publicPage === "about"
      ? "About Us | Font Tai"
      : publicPage === "services"
      ? "Services | Font Tai"
      : publicPage === "contact"
      ? "Contact | Font Tai"
      : publicPage === "notfound"
      ? "404 Not Found | Font Tai"
      : "Font Tai - แหล่งรวมฟอนต์ไต ฟอนต์ไทย พรีวิวฟอนต์ออนไลน์";

  const seoDescription =
    publicPage === "home"
      ? "เว็บไซต์รวมฟอนต์ไตและฟอนต์ไทยสำหรับพรีวิว ดาวน์โหลด และจัดการฟอนต์ รองรับมือถือ เดสก์ท็อป และพร้อมต่อยอด SEO"
      : publicPage === "contact"
      ? "ติดต่อทีมงาน Font Tai ผ่านแบบฟอร์มติดต่อบนเว็บไซต์"
      : publicPage === "notfound"
      ? "ไม่พบหน้าที่คุณต้องการ"
      : "ข้อมูลสำคัญของเว็บไซต์ Font Tai";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        path={pageToPath(publicPage)}
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
                <h2 className="text-4xl font-black tracking-tight">ระบบจัดการฟอนต์</h2>

                <div className="flex flex-wrap gap-3">
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

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">ชื่อ</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">สไตล์</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">เจ้าของ</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">ลักษณะ</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">ประเภท</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allFonts.map((font) => (
                      <tr key={font.id} className="border-t border-slate-200">
                        <td className="px-4 py-4 font-semibold">{font.name}</td>
                        <td className="px-4 py-4">{font.style}</td>
                        <td className="px-4 py-4">{font.owner}</td>
                        <td className="px-4 py-4">{font.characteristics}</td>
                        <td className="px-4 py-4">{font.isCustom ? "Custom" : "Google"}</td>
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
            </section>
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

                    <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                      พรีวิวฟอนต์ไตและฟอนต์ไทย
                      <br />
                      แบบมืออาชีพในเว็บเดียว
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      รองรับทุกอุปกรณ์ ค้นหาฟอนต์ได้ง่าย รองรับฟอนต์อัปโหลดเอง
                      และพร้อมต่อยอดเป็นเว็บไซต์เชิงพาณิชย์ในอนาคต
                    </p>
                  </div>

                  <div className="flex items-end">
                    <AdSlot
                      label="พื้นที่โฆษณา Hero Banner"
                      variant="banner"
                      slotId="hero-banner"
                      className="min-h-[160px]"
                    />
                  </div>
                </div>
              </section>

              <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                  <input
                    className="rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none focus:border-blue-400"
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
                    <span className="min-w-[70px] text-2xl font-black">{fontSize}px</span>
                  </div>

                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-12 w-16 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                  <input
                    className="rounded-2xl border border-slate-300 px-5 py-4 text-base outline-none focus:border-blue-400"
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

              <AdSlot
                label="พื้นที่โฆษณาเหนือรายการฟอนต์"
                variant="banner"
                slotId="top-font-list"
                className="mb-8 min-h-[140px]"
              />

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

                      {(index + 1) % 5 === 0 &&
                      index !== paginatedFonts.length - 1 ? (
                        <div className="mt-6">
                          <AdSlot
                            label="พื้นที่โฆษณาคั่นรายการฟอนต์"
                            variant="inline"
                            slotId={`inline-${index + 1}`}
                            className="min-h-[120px]"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </section>
              )}

              <Pagination page={page} totalPages={totalPages} onChange={setPage} />

              <AdSlot
                label="พื้นที่โฆษณาก่อนส่วนท้ายเว็บไซต์"
                variant="banner"
                slotId="before-footer"
                className="mt-10 min-h-[140px]"
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
          await checkAuth();
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
          navigateToPage("home");
        }}
      />

      <CookieBanner onNavigate={(page) => navigateToPage(page)} />
    </div>
  );
}