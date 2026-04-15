import { useEffect, useMemo, useState } from "react";
import { Plus, Settings, LogOut, Trash2, X } from "lucide-react";
import { api } from "./api";
import { FontCard } from "./components/FontCard";
import { getFamily } from "./lib";
import type { FontItem } from "./types";

type ViewMode = "home" | "admin";

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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            โค้ดใช้งาน: {font.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm whitespace-pre-wrap">
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-2xl font-bold text-gray-900">เข้าสู่ระบบหลังบ้าน</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <input
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ชื่อผู้ใช้"
          />
          <input
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
          />

          {error && <p className="text-red-600 text-sm whitespace-pre-wrap">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl px-4 py-3 font-semibold disabled:opacity-60"
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-2xl font-bold text-gray-900">เพิ่มฟอนต์ใหม่</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <input
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none"
            placeholder="ชื่อฟอนต์"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none"
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
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none"
            placeholder="เจ้าของ"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />

          <input
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none"
            placeholder="ลักษณะ"
            value={characteristics}
            onChange={(e) => setCharacteristics(e.target.value)}
          />

          <textarea
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none min-h-[110px]"
            placeholder="รายละเอียด"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <input
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none"
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {error && <p className="text-red-600 text-sm whitespace-pre-wrap">{error}</p>}

          <button
            className="w-full bg-blue-600 text-white rounded-xl px-4 py-3 font-semibold disabled:opacity-60"
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

export default function App() {
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW);
  const [search, setSearch] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState("#1f2937");

  const [customFonts, setCustomFonts] = useState<FontItem[]>([]);
  const [isAuthed, setIsAuthed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("home");

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl">
              T
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight">Font Tai</h1>
              <p className="text-gray-500 text-lg">
                แหล่งรวมฟอนต์ไต พรีวิวและจัดการฟอนต์บน Cloudflare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthed && (
              <span className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold">
                Admin login แล้ว
              </span>
            )}

            <button
              type="button"
              onClick={() => setViewMode("home")}
              className="px-5 py-3 rounded-2xl border border-gray-300 bg-white text-gray-800 font-semibold"
            >
              หน้าหลัก
            </button>

            {isAuthed ? (
              <button
                type="button"
                onClick={() => setViewMode("admin")}
                className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-semibold flex items-center gap-2"
              >
                <Settings size={18} />
                จัดการฟอนต์
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-semibold flex items-center gap-2"
              >
                <Settings size={18} />
                เข้าหลังบ้าน
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === "admin" && isAuthed ? (
          <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-4xl font-black">ระบบจัดการฟอนต์</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddFont(true)}
                  className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-semibold flex items-center gap-2"
                >
                  <Plus size={18} />
                  เพิ่มฟอนต์
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-3 rounded-2xl bg-red-600 text-white font-semibold flex items-center gap-2"
                >
                  <LogOut size={18} />
                  ออกจากระบบ
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4">ชื่อ</th>
                    <th className="px-4 py-4">สไตล์</th>
                    <th className="px-4 py-4">เจ้าของ</th>
                    <th className="px-4 py-4">ลักษณะ</th>
                    <th className="px-4 py-4">ประเภท</th>
                    <th className="px-4 py-4">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {allFonts.map((font) => (
                    <tr key={font.id} className="border-t border-gray-200">
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
                            className="px-3 py-2 rounded-xl bg-red-50 text-red-600 font-medium flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            ลบ
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <>
            <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4 items-center">
                <input
                  className="rounded-2xl border border-gray-300 px-5 py-4 text-2xl outline-none"
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
                  <span className="text-2xl font-bold w-20">{fontSize}px</span>
                </div>

                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-16 h-12 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div className="mt-4">
                <input
                  className="rounded-2xl border border-gray-300 px-5 py-4 text-xl outline-none w-full max-w-md"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาฟอนต์"
                />
              </div>
            </section>

            {loading ? (
              <p className="text-xl text-gray-500">กำลังโหลดฟอนต์...</p>
            ) : (
              <section className="flex flex-col gap-6">
                {allFonts.map((font) => (
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
          </>
        )}
      </main>

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
          setViewMode("home");
        }}
      />
    </div>
  );
}