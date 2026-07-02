import { useEffect, useMemo, useState } from "react";
import { Edit, LogOut, Plus, Trash2, X } from "lucide-react";
import { api } from "./api";
import { FontCard } from "./components/FontCard";
import { Pagination } from "./components/Pagination";
import { SiteFooter } from "./components/SiteFooter";
import { SeoHead } from "./components/SeoHead";
import { NavbarWithSearch } from "./components/NavbarWithSearch";
import BackToTop from "./components/BackToTop";
import type { ContactMessage, FontItem, VisitorCounter } from "./types";

type ViewMode = "home" | "admin";
type PublicPage =
  | "home"
  | "about"
  | "services"
  | "contact"
  | "notfound";

const DEFAULT_PREVIEW =
  "ၾွၼ်ႉတႆး ႁူမ်ၸူမ်းႁပ်ႉတွၼ်ႈ ฟอนต์ไต ยินดีต้อนรับ Font Tai Welcome!";

const ALPHABET = [
  "ALL",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];
const FONT_CHARACTERISTIC_OPTIONS = [
 { value: "official", label: "ပဵၼ်တၢင်းၵၢၼ်" },
 { value: "modern", label: "ပၢၼ်မႂ်ႇ" },
 { value: "display", label: "ႁူဝ်ၶေႃႈ / ပူဝ်ႇသ်တႃႇ" },
 { value: "body", label: "ၼိူဝ်ႉလိၵ်ႈ လူဢၢၼ်ႇယၢဝ်း" },
 { value: "handwriting", label: "လၢႆးမိုဝ်း" },
 { value: "decorative", label: "ႁၢင်ႈၶိူင်ႈ" },
 { value: "traditional", label: "ပၢၼ်ၵဝ်ႇ" },
 { value: "Regular", label: "ပဵၼ်တၢင်းၵၢၼ်" },
 { value: "Bold", label: "ႁူဝ်ၶေႃႈ / ပူဝ်ႇသ်တႃႇ" },
 { value: "Italic", label: "တူဝ်ၵိူင်း" },
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
    details: "လၵ်းၸဵင်ၾွၼ်ႉတႆး ႁွင်းႁပ်ႉဢၵ်ႉၶရႃႇတူဝ်လိၵ်ႈတဵမ်ထူၼ်ႈ",
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
    details: "ၾွၼ်ႉၵူၼ်းသူင်ၸႂ်ႉၼမ် ပၢၼ်မႂ်ႇ",
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
    details: "သၢင်ႇထုၵ်ႇတႃႇတႅမ်ႈလိၵ်ႈလႄႈၸႂ်ႉပၼ်တၢင်းၵၢၼ်",
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
    details: "လူဢၢၼ်ႇငၢႆႈ",
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
    details: "တူဝ်လိၵ်ႈၼႃ ၸႅင်ႈလႅင်း သၢင်ႇထုၵ်ႇႁဵတ်းပဵၼ်ႁူဝ်ၶေႃႈ",
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
    details: "တွၼ်ႈတႃႇၵၢၼ်တီႇသၢႆး",
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
          <h3 className="input-shan text-2xl font-black text-slate-900">
           ၶူတ်ႉၸႂ်ႉၵၢၼ် : {font.name}
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
        setError("ၶဝ်ႈၵႂႃႇၼႂ်းပိူင်ဢမ်ႇဢွင်ႇမၢၼ်");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ၶဝ်ႈၵႂႃႇၼႂ်းပိူင်ဢမ်ႇဢွင်ႇမၢၼ်");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="input-shan text-2xl font-black text-slate-900">
            ၶဝ်ႈလင်ႁိူၼ်း
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="input-shan flex flex-col gap-4 p-5">
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ၸိုဝ်ႈၵူၼ်းၸႂ်ႉ"
          />
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="မၢႆလပ်ႉ"
          />

          {error && (
            <p className="whitespace-pre-wrap text-sm text-red-600">{error}</p>
          )}

          <button
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
            type="submit"
          >
            {loading ? "တိုၵ်ႉၶဝ်ႈၵႂႃႇၼႂ်းပိူင်..." : "ၶဝ်ႈၵႂႃႇၼႂ်းပိူင်"}
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
      setError("ၶႅၼ်းတေႃႈတႅမ်ႈၶေႃႈမုၼ်းႁႂ်ႈတဵမ်ထူၼ်ႈလႄႈလိူၵ်ႈၾၢႆႇၾွၼ်ႉ");
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
      setError(err instanceof Error ? err.message : "ထႅမ်ၾွၼ်ႉဢမ်ႇဢွင်ႇမၢၼ်");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="input-shan fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="text-2xl font-black text-slate-900">ထႅမ်ၾွၼ်ႉမႂ်ႇ</h3>
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
            placeholder="ၸိုဝ်ႈၾွၼ်ႉ"
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
            placeholder="ၸဝ်ႈၶွင်"
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
            placeholder="ႁူဝ်ယွႆႈ"
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
            {loading ? "တိုၵ်ႉသိမ်း..." : "သိမ်းၾွၼ်ႉ"}
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
      setError("ၶႅၼ်းတေႃႈတႅမ်ႈၶေႃႈမုၼ်းႁႂ်ႈတဵမ်ထူၼ်ႈ");
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
      setError(err instanceof Error ? err.message : "မႄးထတ်းၾွၼ်ႉဢမ်ႇဢွင်ႇမၢၼ်");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="input-shan text-2xl font-black text-slate-900">မႄးထတ်းၾွၼ်ႉ</h3>
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
            className="input-shan rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="ၸိုဝ်ႈၾွၼ်ႉ"
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
            className="input-shan rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-400"
            placeholder="ၸဝ်ႈၶွင်"
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
            placeholder="ႁူဝ်ယွႆႈ"
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
            {loading ? "တိုၵ်ႉသိမ်း..." : "သိမ်းၵၢၼ်မႄးထတ်း"}
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
      setContactError("ၶႅၼ်းတေႃႈတႅမ်ႈၶေႃႈမုၼ်းႁႂ်ႈတဵမ်ၵူႈလွၵ်း");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setContactError("ၶႅၼ်းတေႃႈတႅမ်ႈဢီႇမႄးလ်ႁႂ်ႈမၢၼ်ႇမႅၼ်ႈ");
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

      setContactSuccess(res.message || "သူင်ႇၶေႃႈမုၼ်းယဝ်ႉတူဝ်ႈလီငၢမ်း");

      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setContactError(
        err instanceof Error ? err.message : "ဢမ်ႇၸၢင်ႈသူင်ႇၶေႃႈမုၼ်းလႆႈ"
      );
    } finally {
      setContactSubmitting(false);
    }
  }

  if (page === "about") {
    return (
      <section className="input-shan rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          About Us
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          ဝဵပ်ႉသၢႆႉ Font Tai ၼႆႉ ပဵၼ်တီႈႁူမ်ႈတုမ်ၾွၼ်ႉတႆး တွၼ်ႈတႃႇတူၺ်းပိူင်ၽၢင်ႁၢင်ႈၾွၼ်ႉၵမ်းသိုဝ်ႈ၊ ၸၼ်တၢဝ်းလူတ်ႇ (Download) ဢဝ်ၵႂႃႇၸႂ်ႉတိုဝ်းငၢႆႈ လိူဝ်သေၼၼ်ႉဢမ်ႇၵႃး ဢဝ်ၵႂႃႇၸႂ်ႉတိုဝ်းၼႂ်းဝဵပ်ႉသၢႆႉၸဝ်ႈၵဝ်ႇၵေႃႈလႆႈ ဝဵပ်ႉသၢႆႉဢၼ်ၼႆႉဢမ်ႇလူဝ်ႇသိုဝ်ႉၶႃႈ ၸၼ်ဢဝ်လႆႈၵမ်းလဵဝ် မီးၽၢင်ႁၢင်ၼေပၼ်ၵူႈဢၼ်။
        </p>
      </section>
    );
  }

  if (page === "services") {
    return (
      <section className="input-shan rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Services
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          ဝဵပ်ႉသၢႆႉ Font Tai ၼႆႉ ပုၼ်ႈတႃႇၼေၽၢင်ႁၢင်ႈၾွၼ်ႉဢွၼ်ႇလၢႆး သင်ၸိူဝ်ႉဝႃႈၶႆႈဢဝ်ၾွၼ်ႉၸဝ်ႈၵဝ်ႇၽၢၵ်ႇၶိုၼ်ႈဝဵပ်ႉသၢႆႉႁဝ်းၼႆၸိုင် ၵပ်းသိုပ်ႇမႃးလႆႈယူႇတႃႇသေႇၶႃႈဢေႃႈ၊ တူၺ်းပိူင်ၾွၼ်ႉသေၸၼ်တၢဝ်းလူတ်ႇဢဝ်ၾွၼ်ႉဢၼ်လႆႈၸႂ်ၼၼ်ႉ ႁဝ်းၶႃႈတေသိုပ်ႇၶတ်းၸႂ်ဢဝ်ၾွၼ်ႉတၢင်ႇ (Upload) ၶိုၼ်ႈၼိူဝ်ဝဵပ်ႉသၢႆႉတႃႇသေႇယူႇၶႃႈ ၾွၼ်ႉဢၼ်ႁဝ်းတၢင်ၼၼ်ႉတေပဵၼ်ၾွၼ်ႉ (Unicode) ယူႇၼီႇၶူတ်ႉလွၼ်ႉလွၼ်ႉ ပိူဝ်ႈတႃႇတေၸႂ်ႉၵၢၼ်လႆႈၵူႈဢွင်ႈတီႈ။
          
        </p>
      </section>
    );
  }

  if (page === "contact") {
    return (
      <section className="input-shan mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            Contact Form
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            ၽွမ်ႇၵပ်းသိုပ်းၸူးၶိုၼ်း
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
ပေႃးဝႃႈ ၶႂ်ႈၵပ်းသိုပ်ႇတွင်ႈထၢမ်၊ ပၼ်တၢင်းႁၼ်ထိုင်လွင်ႈၾွၼ်ႉ၊ တၢင်ႇလၢတ်ႈပၼ်ႁႃလွင်ႈၸႂ်ႉတိုဝ်း ဢမ်ႇၼၼ် တွင်ႈထၢမ်ၵူႈလွင်ႈလွင်ႈသူင်ႇၶေႃႈမုၼ်းမႃးၸူးႁဝ်းၶႃႈ ၽၢၼ်ႇတၢင်း ၽွမ်ႇ (Form) တီႈၽၢႆႇတႂ်ႈၼႆႉလႆႈယူႇၶႃႈဢေႃႈ။          </p>
        </div>

        <form className="space-y-5" onSubmit={handleContactSubmit} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ၸိုဝ်ႈ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactForm.firstName}
                onChange={(e) => updateContactField("firstName", e.target.value)}
                placeholder="တႅမ်ႈၸိုဝ်ႈ"
                className="w-full input-shan rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="input-shan mb-2 block text-sm font-semibold text-slate-700">
                ၶိူဝ်းႁိူၼ်း <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactForm.lastName}
                onChange={(e) => updateContactField("lastName", e.target.value)}
                placeholder="တႅမ်ႈၶိူဝ်းႁိူၼ်း"
                className="w-full input-shan rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ဢီႇမေးလ် <span className="text-red-500">*</span>
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
              ႁူဝ်ၶေႃႈ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contactForm.subject}
              onChange={(e) => updateContactField("subject", e.target.value)}
              placeholder="ႁူဝ်ၶေႃႈဢၼ်လူဝ်ႇၵပ်းသိုပ်ႇ"
              className="input-shan w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="input-shan mb-2 block text-sm font-semibold text-slate-700">
              ၶေႃႈၵႂၢမ်း <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={contactForm.message}
              onChange={(e) => updateContactField("message", e.target.value)}
              placeholder="တႅမ်ႈႁူဝ်ယွႆႈဢၼ်လူဝ်ႇၵပ်းသိုပ်ႇ"
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

          <div className="input-shan rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            ၶေႃႈမုၼ်းတီႈသူၸဝ်ႈသူင်ႇမႃးၼႂ်းၽွမ်ႇၼႆႉ တေထုၵ်ႇၸႂ်ႉတိုဝ်းၼႂ်းၵၢၼ်ၵပ်းသိုပ်ႇသူၸဝ်ႈၶိုၼ်းၵူၺ်း။
          </div>

          <button
            type="submit"
            disabled={contactSubmitting}
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {contactSubmitting ? "တိုၵ်ႉသူင်ႇၶေႃႈမုၼ်း..." : "သူင်ႇၶေႃႈမုၼ်း"}
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
          သွၵ်ႈႁႃဢမ်ႇႁၼ်ၼႂ်းၼႃႈဢၼ်သူသွၵ်ႈႁႃ
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          ယွၼ်းၶႂၢင်းပၼ် ၼႃႈလိၵ်ႈဢၼ်သူၶႆႈၶဝ်ႈၼၼ်ႉ မွတ်ႇပႅတ်ႈယဝ်ႉ လၢႆႈၸိုဝ်ႈ ဢမ်ႇၼၼ်မၼ်းဢမ်ႇယူႇၼႂ်းဝဵပ်ႉသၢႆႉၼႆႉယဝ်ႉ
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
  onNavigate("home");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  window.location.reload();
}}
            className="input-shan rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            ႁူၼ်ၶိုၼ်းၼႃႈႁိူၼ်း
          </button>

          <button
            type="button"
            onClick={() => onNavigate("contact")}
            className="input-shan rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            ၵပ်းသိုပ်ႇႁဝ်း
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
    <div className="input-shan fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              ႁူဝ်ၶေႃႈဢၼ်လူဝ်ႇၵပ်းသိုပ်ႇ
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

        <div className="input-shan space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                ၸိုဝ်း-ၶိူဝ်းႁိူၼ်း
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                {item.firstName} {item.lastName}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                ဢီႇမေးလ်
              </p>
              <p className="mt-2 font-semibold text-slate-900">{item.email}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              ႁူဝ်ၶေႃႈ
            </p>
            <p className="mt-2 font-semibold text-slate-900">{item.subject}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              ၶေႃႈၵႂၢမ်း
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
                  `ထိုင် ${item.firstName} ${item.lastName},\n\nယိၼ်းၸူမ်းတီႈၵပ်းသိုပ်ႇႁဝ်း\n\n`
                );
                window.location.href = `mailto:${item.email}?subject=${subject}&body=${body}`;
              }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700"
            >
              တွပ်ႇဢီႇမေးလ်
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
                ႁဵတ်းၶိူင်ႈမၢႆဝႃႈလူဢၢၼ်ႇယဝ်ႉ
              </button>
            ) : null}

            <button
              type="button"
              onClick={async () => {
                const ok = window.confirm("မၼ်ႈၸႂ်ႁိုဝ်ဢၼ်တေမွတ်ႇပႅတ်ႈၶေႃႈၵႂၢမ်းၼႆႉ?");
                if (!ok) return;
                await onDelete(item.id);
                onClose();
              }}
              className="rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white"
            >
              မွတ်ႇပႅတ်ႈၶေႃႈၵႂၢမ်း
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
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
  const [ownerFilter, setOwnerFilter] = useState("ALL");
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
      alert(err instanceof Error ? err.message : "Export CSV ဢမ်ႇလႆႈ");
    }
  }

  function handleReplyEmail(item: ContactMessage) {
    const subject = encodeURIComponent(`Re: ${item.subject}`);
    const body = encodeURIComponent(
      `ထိုင် ${item.firstName} ${item.lastName},\n\nယိၼ်းၸူမ်းတီႈၵပ်းသိုပ်ႇႁဝ်းမႃး\n\n`
    );
    window.location.href = `mailto:${item.email}?subject=${subject}&body=${body}`;
  }

  async function handleMarkContactAsRead(id: string) {
    try {
      await api.markContactAsRead(id);
      await loadContactMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Status update failed");
    }
  }

  async function handleDeleteContactMessage(id: string) {
    try {
      await api.deleteContactMessage(id);
      await loadContactMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "မွတ်ႇၶေႃႈၵႂၢမ်းဢမ်ႇလႆႈ");
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

    if (ownerFilter !== "ALL") {
      result = result.filter((font) => font.owner === ownerFilter);
    }

    if (!q) return result;

    return result.filter((font) =>
      [font.name, font.owner, font.characteristics, font.style, font.details]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [customFonts, search, letterFilter, ownerFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize, letterFilter, ownerFilter]);

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
      alert(err instanceof Error ? err.message : "မွတ်ႇၾွၼ်ႉဢမ်ႇလႆႈ");
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

  // === handler ที่ <SiteFooter> เรียกใช้ ===
  function handleNavigate(page: PublicPage) {
    navigateToPage(page);
  }

  function handleAdminClick() {
    if (isAuthed) {
      setViewMode("admin");
    } else {
      setShowLogin(true);
    }
  }

  const seoTitle =
  publicPage === "about"
    ? "About Font Tai - เว็บไซต์รวมฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย"
    : publicPage === "services"
    ? "Services - Preview, Download & Font Embed Code | Font Tai"
    : publicPage === "contact"
    ? "Contact Font Tai - ติดต่อสอบถาม แนะนำฟอนต์ และแจ้งปัญหา"
    : publicPage === "notfound"
    ? "404 Not Found | Font Tai"
    : "Font Tai ၾွၼ်ႉတႆး - ฟอนต์ไต ฟอนต์ไทใหญ่ Shan Font Preview & Download";

const seoDescription =
  publicPage === "home"
    ? "Font Tai ၾွၼ်ႉတႆး แหล่งรวมฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย สำหรับพรีวิวฟอนต์ออนไลน์ ดาวน์โหลดฟอนต์ และดูโค้ดฝังฟอนต์บนเว็บไซต์ รองรับภาษาไต ภาษาไทย และทุกอุปกรณ์"
    : publicPage === "about"
    ? "รู้จัก Font Tai เว็บไซต์รวมฟอนต์ไต ฟอนต์ไทใหญ่ ฟอนต์ไทย และ Tai font ที่ช่วยให้พรีวิวฟอนต์ ดาวน์โหลดฟอนต์ และนำฟอนต์ไปใช้งานบนเว็บไซต์ได้ง่ายขึ้น"
    : publicPage === "services"
    ? "บริการของ Font Tai ครอบคลุมการพรีวิวฟอนต์ออนไลน์ ดาวน์โหลดฟอนต์ ดูโค้ดฝังฟอนต์ และจัดการฟอนต์สำหรับใช้งานบนเว็บไซต์ทั้งภาษาไต ภาษาไทย และภาษาอังกฤษ"
    : publicPage === "contact"
    ? "ติดต่อทีมงาน Font Tai เพื่อสอบถามการใช้งานเว็บไซต์ แนะนำฟอนต์ แจ้งปัญหาการดาวน์โหลดฟอนต์ หรือพูดคุยเรื่องการใช้งานฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย"
    : publicPage === "notfound"
    ? "ไม่พบหน้าที่คุณค้นหาบนเว็บไซต์ Font Tai"
    : "Font Tai เว็บไซต์รวมฟอนต์ไต ฟอนต์ไทใหญ่ ฟอนต์ไทย และ Shan font สำหรับพรีวิวออนไลน์ ดาวน์โหลด และฝังฟอนต์บนเว็บไซต์";

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

                </div>
              )}
            </section>
          ) : publicPage !== "home" ? (
  <StaticPage page={publicPage} onNavigate={navigateToPage} />
) : (
            <>
              <section className="input-shan mb-6 rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm">
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
                      တူၺ်းၽၢင်ႁၢင်ႈၾွၼ်ႉတႆး၊ သွၵ်ႈႁႃၾွၼ်ႉတႆးလႆႈငၢႆႈငၢႆႈ၊ မီးၶူတ်ႉ (Code) တွၼ်ႈတႃႇဢဝ်ၾွၼ်ႉၵႂႃႇၾင်ဝႆႉၼႂ်းဝဵပ်ႉသၢႆႉ လႄႈၸၼ်တၢဝ်းလူတ်ႇ (Download) ဢဝ်ၾွၼ်ႉဢၼ်ပဵၼ်ၾၢႆႇ .ttf ၵႂႃႇၸႂ်ႉတိုဝ်းလႆႈယူႇၶႃႈဢေႃႈ။
                    </p>
                  </div>

                
                </div>
              </section>

              <section className="input-shan mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
                  <input
                    className="input-shan w-full min-w-0 rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none focus:border-blue-400"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="တႅမ်ႈၶေႃႈၵႂၢမ်းပိူဝ်ႈတႃႇၼႄၽၢင်ႁၢင်ႈၾွၼ်ႉ"
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
                    placeholder="သွၵ်ႈႁႃၾွၼ်ႉ"
                  />

                  <select
                    className="input-shan rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-400"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value={10}>ၼႄ 10 ၾွၼ်ႉ</option>
                    <option value={20}>ၼႄ 20 ၾွၼ်ႉ</option>
                    <option value={30}>ၼႄ 30 ၾွၼ်ႉ</option>
                  </select>
                </div>
              </section>

            <div className="mb-6 border-b border-slate-200/70 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:sticky md:top-[72px] md:z-30">

  <div className="overflow-x-auto px-2 py-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
    
    <div className="flex min-w-max items-center gap-2">

      {ALPHABET.map((letter) => {
        const isActive = letterFilter === letter;
        const isAll = letter === "ALL";

        return (
          <button
            key={letter}
            type="button"
            onClick={() => setLetterFilter(letter)}
            aria-pressed={isActive}
            className={`flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-sm font-bold transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            } ${isAll ? "px-4" : ""}`}
          >
            {letter}
          </button>
        );
      })}

    </div>
  </div>

  {(letterFilter !== "ALL" || ownerFilter !== "ALL") ? (
    <div className="border-t border-slate-100 px-4 py-2">
      <p className="input-shan text-center text-xs font-medium text-slate-500">
        {letterFilter !== "ALL" ? (
          <>
           ၼႄၸိုဝ်ႈၾွၼ်ႉဢၼ်ႈၶိုၼ်ႈလူၺ်ႈတူဝ်လိၵ်ႈ{" "}
            <span className="font-bold text-blue-600">{letterFilter}</span>
          </>
        ) : null}
        {letterFilter !== "ALL" && ownerFilter !== "ALL" ? " และ " : null}
        {ownerFilter !== "ALL" ? (
          <>
            ၸဝ်ႈၶွင်{" "}
            <span className="font-bold text-blue-600">{ownerFilter}</span>{" "}
            <button
              type="button"
              onClick={() => setOwnerFilter("ALL")}
              className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-300"
            >
              မွတ်ႇ
            </button>
          </>
        ) : null}
        {" "}တၢင်းၼမ် {allFonts.length} ႁူဝ်ယွႆႈ
      </p>
    </div>
  ) : null}

</div>

              

              {loading ? (
                <p className="input-shan text-lg text-slate-500">တိုဝ်းလူတ်ႇၾွၼ်ႉ ...</p>
              ) : paginatedFonts.length === 0 ? (
                <div className="input-shan rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                  ဢမ်ႇပႆႇမီးၾွၼ်ႉၼႄ
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
          onNavigate={handleNavigate}
          onAdminClick={handleAdminClick}
          allFonts={allFonts}
          setOwnerFilter={setOwnerFilter}
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

      <BackToTop />
    </div>
  );
}
