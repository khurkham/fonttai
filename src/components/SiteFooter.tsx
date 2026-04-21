import { Mail, MapPin, Phone, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { AdSlot } from "./AdSlot";
import { api } from "../api";
import type { VisitorCounter } from "../types";

type Props = {
  onNavigate: (
    page:
      | "home"
      | "about"
      | "services"
      | "privacy"
      | "cookie"
      | "contact"
      | "notfound"
  ) => void;
  onAdminClick: () => void;
};

export function SiteFooter({ onNavigate, onAdminClick }: Props) {
  const [stats, setStats] = useState<VisitorCounter>({
    totalVisitors: 0,
    todayVisitors: 0,
    onlineNow: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        setStatsLoading(true);
        const res = await api.getVisitorCounter();

        if (active) {
          setStats(res.stats);
        }
      } catch {
        if (active) {
          setStats({
            totalVisitors: 0,
            todayVisitors: 0,
            onlineNow: 0,
          });
        }
      } finally {
        if (active) {
          setStatsLoading(false);
        }
      }
    }

    loadStats();

    const interval = window.setInterval(() => {
      loadStats();
    }, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <AdSlot
          label="พื้นที่โฆษณาด้านล่างเว็บไซต์"
          variant="banner"
          slotId="footer-banner"
          className="mb-8 min-h-[140px]"
        />

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Font Tai Logo"
                className="h-11 w-11 rounded-2xl object-contain shadow-sm"
              />
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  Font Tai
                </h3>
                <p className="text-sm text-slate-500">
                  Thai &amp; Tai Font Preview Platform
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              เว็บไซต์รวมฟอนต์ไตและฟอนต์ไทยสำหรับพรีวิว ดาวน์โหลด และจัดการฟอนต์
              รองรับการใช้งานบนทุกอุปกรณ์ และพร้อมต่อยอดสู่ระบบเว็บไซต์เชิงพาณิชย์ในอนาคต
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              เมนูเว็บไซต์
            </h4>

            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                หน้าแรก
              </button>

              <button
                type="button"
                onClick={() => onNavigate("about")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                About Us
              </button>

              <button
                type="button"
                onClick={() => onNavigate("services")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Services
              </button>

              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="text-left text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Contact
              </button>
            </div>
          </div>

          <div className="w-full max-w-[340px]">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              สถิติผู้เข้าใช้งาน
            </h4>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  👁️
                </div>
                <h5 className="text-lg font-extrabold text-slate-900">
                  Visitor Counter
                </h5>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm font-medium text-slate-500">
                    ผู้เข้าชมทั้งหมด
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    {statsLoading ? "..." : stats.totalVisitors.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm font-medium text-slate-500">
                    วันนี้
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    {statsLoading ? "..." : stats.todayVisitors.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm font-medium text-slate-500">
                    ออนไลน์ตอนนี้
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    {statsLoading ? "..." : stats.onlineNow.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                ระบบนับผู้เข้าชมจริงจากฐานข้อมูล D1
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              ติดต่อ / ผู้ดูแลระบบ
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-blue-600" />
                <span>bejaitai@email.com</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-blue-600" />
                <span>+66 94-624-8370</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-blue-600" />
                <span>Thailand</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onAdminClick}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Settings size={16} />
              เข้าหลังบ้าน
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Font Tai. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <button
                type="button"
                onClick={() => onNavigate("privacy")}
                className="transition hover:text-blue-600"
              >
                Privacy
              </button>

              <button
                type="button"
                onClick={() => onNavigate("cookie")}
                className="transition hover:text-blue-600"
              >
                Cookies
              </button>

              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="transition hover:text-blue-600"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}