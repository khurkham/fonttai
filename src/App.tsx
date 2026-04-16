import { useEffect, useMemo, useState } from "react";
import { LogOut, Plus, Trash2, X } from "lucide-react";
import { api } from "./api";
import { FontCard } from "./components/FontCard";
import { Pagination } from "./components/Pagination";
import { SiteFooter } from "./components/SiteFooter";
import { AdSlot } from "./components/AdSlot";
import { SeoHead } from "./components/SeoHead";
import { getFamily } from "./lib";
import type { FontItem } from "./types";
import { NavbarWithSearch } from "./components/NavbarWithSearch";
import type { PreviewMode } from "./components/ViewportToggle";

type ViewMode = "home" | "admin";
type PublicPage = "home" | "about" | "services" | "privacy" | "contact";

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
  },
];

function CodeModal({
  font,
  onClose,
}: {
  font: FontItem | null;
  onClose: () => void;
}) {
  if (!font) return null;

  const fontFamily = getFamily(font.name, font.isCustom);
  const css = font.isCustom
    ? `@font-face {
  font-family: "${fontFamily}";
  src: url("${font.fileUrl}") format("truetype");
  font-display: swap;
}

.your-class {
  font-family: "${fontFamily}", sans-serif;
}`
    : `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${font.sourceUrl.replace(
        "https://fonts.google.com/specimen/",
        "https://fonts.googleapis.com/css2?family="
      )}&display=swap" rel="stylesheet">

.your-class {
  font-family: "${fontFamily}", sans-serif;
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

function StaticPage({ page }: { page: PublicPage }) {
  if (page === "privacy") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          เว็บไซต์นี้อาจเก็บข้อมูลที่จำเป็นต่อการใช้งาน เช่น session cookie สำหรับการเข้าสู่ระบบผู้ดูแลระบบ
          และข้อมูลเชิงเทคนิคเพื่อความปลอดภัยและการปรับปรุงประสบการณ์ใช้งาน โดยจะไม่เผยแพร่ข้อมูลส่วนบุคคลโดยไม่จำเป็น
        </p>
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
          Font Tai คือเว็บไซต์รวมฟอนต์ไตและฟอนต์ไทยสำหรับพรีวิว ดาวน์โหลด และจัดการฟอนต์
          โดยออกแบบมาเพื่อรองรับการใช้งานบนทุกอุปกรณ์ และพร้อมสำหรับการขยายเป็นเว็บไซต์เชิงพาณิชย์ในอนาคต
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
          บริการของเว็บไซต์ Font Tai ได้แก่ พรีวิวฟอนต์ออนไลน์ จัดการฟอนต์อัปโหลดเอง
          และดาวน์โหลดหรือใช้งานฟอนต์ผ่านเว็บในรูปแบบที่เหมาะกับทุกอุปกรณ์
        </p>
      </section>
    );
  }

  if (page === "contact") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Contact
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          ติดต่อเจ้าของเว็บไซต์ได้ผ่านอีเมลหรือช่องทางติดต่อที่คุณจะเพิ่มภายหลัง เช่น Facebook Page, Line OA หรือแบบฟอร์มติดต่อ
        </p>
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

  const [customFonts, setCustomFonts] = useState<FontItem[]>([]);
  const [isAuthed, setIsAuthed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [publicPage, setPublicPage] = useState<PublicPage>("home");

  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [codeFont, setCodeFont] = useState<FontItem | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddFont, setShowAddFont] = useState(false);
  const [loading, setLoading] = useState(true);

  async function handleToggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error", error);
    }
  }

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

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

  const allFonts = useMemo(() => {
    const merged = [...customFonts, ...GOOGLE_FONTS];
    const q = search.trim().toLowerCase();

    if (!q) return merged;

    return merged.filter((font) =>
      [
        font.name,
        font.owner,
        font.characteristics,
        font.style,
        font.details,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [customFonts, search]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const previewContainerClass =
    previewMode === "mobile"
      ? "mx-auto w-full max-w-[430px]"
      : previewMode === "tablet"
      ? "mx-auto w-full max-w-[900px]"
      : "w-full";

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

  const seoTitle =
    publicPage === "privacy"
      ? "Privacy Policy | Font Tai"
      : publicPage === "about"
      ? "About Us | Font Tai"
      : publicPage === "services"
      ? "Services | Font Tai"
      : publicPage === "contact"
      ? "Contact | Font Tai"
      : "Font Tai - แหล่งรวมฟอนต์ไต ฟอนต์ไทย พรีวิวฟอนต์ออนไลน์";

  const seoDescription =
    publicPage === "home"
      ? "เว็บไซต์รวมฟอนต์ไตและฟอนต์ไทยสำหรับพรีวิว ดาวน์โหลด และจัดการฟอนต์ รองรับมือถือ เดสก์ท็อป และพร้อมต่อยอด SEO"
      : "ข้อมูลสำคัญของเว็บไซต์ Font Tai";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SeoHead title={seoTitle} description={seoDescription} />

      <div className="flex min-h-screen flex-col">
        <NavbarWithSearch
  search={search}
  onSearchChange={setSearch}
  publicPage={publicPage}
  onNavigate={setPublicPage}
/>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
          <div className={previewContainerClass}>
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
                          <td className="px-4 py-4">{font.characteristics}</td>
                          <td className="px-4 py-4">{font.isCustom ? "Custom" : "Google"}</td>
                          <td className="px-4 py-4">
                            {font.isCustom ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteFont(font.id)}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 font-medium text-red-600"
                              >
                                <Trash2 size={16} />
                                ลบ
                              </button>
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
              <StaticPage page={publicPage} />
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

                <AdSlot label="พื้นที่โฆษณาเหนือรายการฟอนต์" className="mb-8" />

                {loading ? (
                  <p className="text-lg text-slate-500">กำลังโหลดฟอนต์...</p>
                ) : paginatedFonts.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                    ยังไม่มีฟอนต์ให้แสดง
                  </div>
                ) : (
                  <section className="flex flex-col gap-6">
                    {paginatedFonts.map((font) => (
                      <FontCard
                        key={font.id}
                        font={font}
                        previewText={previewText}
                        fontSize={fontSize}
                        textColor={textColor}
                        onShowCode={setCodeFont}
                      />
                    ))}
                  </section>
                )}

                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </main>

        <SiteFooter
          onNavigate={(page) => {
            setViewMode("home");
            setPublicPage(page);
          }}
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

      <AddFontModal
        open={showAddFont}
        onClose={() => setShowAddFont(false)}
        onCreated={async () => {
          await loadFonts();
          setPublicPage("home");
          setViewMode("home");
        }}
      />
    </div>
  );
}