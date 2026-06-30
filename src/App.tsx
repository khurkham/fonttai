import { useEffect, useMemo, useState } from "react";
import { Edit, LogOut, Plus, Trash2, X } from "lucide-react";
import { api } from "./api";
import { FontCard } from "./components/FontCard";
import { Pagination } from "./components/Pagination";
import { SiteFooter } from "./components/SiteFooter";
import { SeoHead } from "./components/SeoHead";
import { CookieBanner } from "./components/CookieBanner";
import { NavbarWithSearch } from "./components/NavbarWithSearch";
import BackToTop from "./components/BackToTop";
import type { ContactMessage, FontItem, VisitorCounter } from "./types";

/* ❌ ลบ ads + articles import ออกแล้ว */

type ViewMode = "home" | "admin";

type PublicPage =
  | "home"
  | "about"
  | "services"
  | "privacy"
  | "cookie"
  | "contact"
  | "notfound";

/* ❌ ลบ SHOW_AD_PLACEHOLDERS */

const DEFAULT_PREVIEW =
  "ၾွၼ်ႉတႆး ႁူမ်ၸူမ်းႁပ်ႉတွၼ်ႈ ฟอนต์ไต ยินดีต้อนรับ Font Tai Welcome!";

const ALPHABET = [
  "ALL",
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
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

/* ================= ROUTING (ลบ articles ออกแล้ว) ================= */

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

/* ================= MAIN APP ================= */

export default function App() {
  const [page, setPage] = useState<PublicPage>("home");

  useEffect(() => {
    const handlePopState = () => {
      setPage(pathToPage(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    handlePopState();
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(next: PublicPage) {
    const path = pageToPath(next);
    window.history.pushState({}, "", path);
    setPage(next);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SeoHead />
      <NavbarWithSearch onNavigate={navigate} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {page === "home" && <Home />}
        {page === "about" && <About />}
        {page === "services" && <Services />}
        {page === "privacy" && <Privacy />}
        {page === "cookie" && <Cookie />}
        {page === "contact" && <Contact />}
        {page === "notfound" && <NotFound />}
      </main>

      <SiteFooter />
      <BackToTop />
      <CookieBanner />
    </div>
  );
}

/* ================= PAGES ================= */

function Home() {
  return <div>Home</div>;
}

function About() {
  return <div>About</div>;
}

function Services() {
  return <div>Services</div>;
}

function Privacy() {
  return <div>Privacy</div>;
}

function Cookie() {
  return <div>Cookie</div>;
}

function Contact() {
  return <div>Contact</div>;
}

function NotFound() {
  return <div>404</div>;
}