import { ARTICLES_INTRO, getArticleBySlug } from "./data/articles";

export const SITE_NAME = "Font Tai";

export const DEFAULT_TITLE =
  "Font Tai ၾွၼ်ႉတႆး - ฟอนต์ไต ฟอนต์ไทใหญ่ Shan Font Preview & Download";

export const DEFAULT_DESCRIPTION =
  "Font Tai ၾွၼ်ႉတႆး แหล่งรวมฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย สำหรับพรีวิวฟอนต์ออนไลน์ ดาวน์โหลดฟอนต์ และดูโค้ดฝังฟอนต์บนเว็บไซต์ รองรับภาษาไต ภาษาไทย และทุกอุปกรณ์";

export type PageMeta = {
  title: string;
  description: string;
};

/**
 * แหล่งข้อมูล title/description ของทุกหน้า ใช้ร่วมกันทั้งฝั่ง client (App.tsx,
 * ผ่าน SeoHead) และฝั่ง server (worker.ts, สำหรับ inject ลงใน HTML ก่อนส่งให้ crawler)
 * เพื่อไม่ให้ค่าที่ผู้ใช้เห็นกับค่าที่ Googlebot/AdSense bot เห็นไม่ตรงกัน
 */
export function getPageMeta(rawPathname: string): PageMeta {
  const path = rawPathname.replace(/\/+$/, "") || "/";

  if (path.startsWith("/articles/")) {
    const slug = path.replace("/articles/", "");
    const article = getArticleBySlug(slug);
    if (article) {
      return {
        title: `${article.title} | ${SITE_NAME}`,
        description: article.description,
      };
    }
  }

  switch (path) {
    case "/":
      return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };

    case "/articles":
      return {
        title: `บทความและคู่มือการใช้งานฟอนต์ไต | ${SITE_NAME}`,
        description: ARTICLES_INTRO,
      };

    case "/about":
      return {
        title: "About Font Tai - เว็บไซต์รวมฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย",
        description:
          "รู้จัก Font Tai เว็บไซต์รวมฟอนต์ไต ฟอนต์ไทใหญ่ ฟอนต์ไทย และ Tai font ที่ช่วยให้พรีวิวฟอนต์ ดาวน์โหลดฟอนต์ และนำฟอนต์ไปใช้งานบนเว็บไซต์ได้ง่ายขึ้น",
      };

    case "/services":
      return {
        title: "Services - Preview, Download & Font Embed Code | Font Tai",
        description:
          "บริการของ Font Tai ครอบคลุมการพรีวิวฟอนต์ออนไลน์ ดาวน์โหลดฟอนต์ ดูโค้ดฝังฟอนต์ และจัดการฟอนต์สำหรับใช้งานบนเว็บไซต์ทั้งภาษาไต ภาษาไทย และภาษาอังกฤษ",
      };

    case "/contact":
      return {
        title: "Contact Font Tai - ติดต่อสอบถาม แนะนำฟอนต์ และแจ้งปัญหา",
        description:
          "ติดต่อทีมงาน Font Tai เพื่อสอบถามการใช้งานเว็บไซต์ แนะนำฟอนต์ แจ้งปัญหาการดาวน์โหลดฟอนต์ หรือพูดคุยเรื่องการใช้งานฟอนต์ไต ฟอนต์ไทใหญ่ และฟอนต์ไทย",
      };

    case "/privacy":
      return {
        title: "Privacy Policy - นโยบายความเป็นส่วนตัว | Font Tai",
        description:
          "อ่านนโยบายความเป็นส่วนตัวของ Font Tai เพื่อดูแนวทางการเก็บ ใช้ และคุ้มครองข้อมูลผู้ใช้งาน",
      };

    case "/cookie":
      return {
        title: "Cookie Policy - นโยบายคุกกี้ | Font Tai",
        description:
          "อ่านนโยบายคุกกี้ของ Font Tai เพื่อทำความเข้าใจประเภทของคุกกี้ที่ใช้",
      };

    case "/404":
      return {
        title: `404 Not Found | ${SITE_NAME}`,
        description: "ไม่พบหน้าที่คุณค้นหาบนเว็บไซต์ Font Tai",
      };

    default:
      // path ที่ไม่รู้จัก (เช่น URL พิมพ์ผิด) ใช้ค่า default แทนการเดา
      return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  }
}

/** แปลง pathname ให้อยู่ในรูปแบบที่มี trailing slash เสมอ (ยกเว้น root "/") ใช้ทำ canonical URL */
export function getCanonicalPath(rawPathname: string): string {
  const path = rawPathname.replace(/\/+$/, "") || "/";
  return path === "/" ? "/" : `${path}/`;
}
