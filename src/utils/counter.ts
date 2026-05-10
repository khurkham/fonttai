import { Counter } from "counterapi";

// ============================================================
// CounterAPI Utility
// ============================================================
// ไฟล์นี้สร้าง instance ของ Counter ใช้ร่วมกันทั้งแอปพลิเคชัน
// เพื่อหลีกเลี่ยงการสร้าง instance ใหม่ทุกครั้งที่ใช้งาน
//
// การตั้งค่า
// 1. แก้ค่า WORKSPACE_NAME ให้ตรงกับ workspace ของคุณ
//    ดูได้จากเมนู Workspaces ในแดชบอร์ด counterapi.dev
// 2. แก้ค่า COUNTER_NAME ให้ตรงกับ counter ที่สร้างไว้
//    ดูได้จากเมนู Counters ในแดชบอร์ด
// ============================================================

const WORKSPACE_NAME = "khurkhams-team";
const COUNTER_NAME = "site-visits";

let counterInstance: Counter | null = null;

function getCounter(): Counter {
  if (!counterInstance) {
    counterInstance = new Counter({
      workspace: WORKSPACE_NAME,
      timeout: 5000,
    });
  }
  return counterInstance;
}

/**
 * เพิ่มจำนวนการเข้าชมเว็บไซต์ขึ้น 1
 * เรียกเมื่อผู้ใช้เปิดเว็บไซต์ครั้งแรก
 *
 * ใช้ sessionStorage เพื่อป้องกันการนับซ้ำ
 * ในเซสชันเดียวกัน (เช่น เปลี่ยนหน้าหรือรีเฟรช)
 */
export async function trackSiteVisit(): Promise<number | null> {
  if (typeof window === "undefined") return null;

  const SESSION_KEY = "counterapi_visit_tracked";
  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    return null;
  }

  try {
    const counter = getCounter();
    const result = await counter.up(COUNTER_NAME);
    sessionStorage.setItem(SESSION_KEY, "1");
    return result.value;
  } catch (err) {
    console.warn("CounterAPI tracking error:", err);
    return null;
  }
}

/**
 * ดึงค่าปัจจุบันของ counter โดยไม่เพิ่มจำนวน
 * ใช้สำหรับแสดงสถิติบนหน้าเว็บไซต์
 */
export async function getSiteVisitCount(): Promise<number | null> {
  if (typeof window === "undefined") return null;

  try {
    const counter = getCounter();
    const result = await counter.get(COUNTER_NAME);
    return result.value;
  } catch (err) {
    console.warn("CounterAPI fetch error:", err);
    return null;
  }
}

/**
 * เพิ่มจำนวนการเข้าชมหน้าเฉพาะเจาะจง
 * เช่น trackPageVisit("article-install-windows")
 * เพื่อนับจำนวนผู้อ่านบทความแต่ละบทความ
 */
export async function trackPageVisit(
  pageName: string
): Promise<number | null> {
  if (typeof window === "undefined") return null;
  if (!pageName) return null;

  try {
    const counter = getCounter();
    const result = await counter.up(pageName);
    return result.value;
  } catch (err) {
    console.warn("CounterAPI page tracking error:", err);
    return null;
  }
}