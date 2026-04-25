# Font Tai บน Cloudflare Workers

โปรเจกต์นี้แยกเป็น:
- Frontend: React + Vite (`src/App.tsx`, `src/components/*`)
- Backend API: Hono บน Cloudflare Workers (`src/worker.ts`)
- Database: Cloudflare D1 (`schema.sql`)
- File storage: Cloudflare R2 (เก็บไฟล์ฟอนต์)

## โครงสร้างไฟล์
- `src/App.tsx` หน้าบ้าน + หน้า login/admin
- `src/components/FontCard.tsx` การ์ดแสดงฟอนต์
- `src/api.ts` เรียก API
- `src/worker.ts` หลังบ้าน API + auth + serve assets
- `schema.sql` ตารางฐานข้อมูล
- `wrangler.jsonc` ตั้งค่า Cloudflare
- `.dev.vars.example` ตัวอย่าง secret

## ขั้นตอนใช้งานแบบย่อ
1. เปิดโปรเจกต์ใน CodeSandbox
2. ติดตั้ง package: `npm install`
3. login Cloudflare: `npx wrangler login`
4. สร้าง D1: `npx wrangler d1 create font_tai_db`
5. เอา `database_id` ที่ได้มาใส่ใน `wrangler.jsonc`
6. สร้าง R2 bucket ชื่อ `font-tai-files`
7. ใช้ `schema.sql` กับ D1:
   `npx wrangler d1 execute font_tai_db --remote --file=schema.sql`
8. สร้าง `.dev.vars` จาก `.dev.vars.example`
9. รัน local: `npm run dev`
10. deploy: `npm run deploy`

## หมายเหตุ
- ตอน deploy จริง ให้ตั้ง secrets ใน Cloudflare ด้วย `npx wrangler secret put`
- ถ้าจะใช้โดเมนจริง ให้ผูก Custom Domain ในหน้า Workers ของ Cloudflare
