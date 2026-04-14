# แผนผังไฟล์: หน้าบ้าน / หลังบ้าน / Cloudflare

## หน้าบ้าน (Frontend)
ไฟล์เหล่านี้อยู่ฝั่ง React และทำงานในเบราว์เซอร์

- `src/main.tsx` จุดเริ่มต้นของ React
- `src/App.tsx` หน้าหลัก, หน้า login, หน้า admin, ฟอร์มอัปโหลด
- `src/components/FontCard.tsx` การ์ดแสดงฟอนต์แต่ละรายการ
- `src/api.ts` ตัวกลางเรียก API ไปยัง Worker
- `src/types.ts` type ของข้อมูลฟอนต์และ auth
- `src/styles.css` สไตล์หน้าเว็บ
- `index.html` shell ของ Vite

## หลังบ้าน (Backend)
ไฟล์เหล่านี้รันบน Cloudflare Worker

- `src/worker.ts`
  - `GET /api/fonts` ดึงรายการฟอนต์จาก D1
  - `GET /api/font-file/:key` เปิดไฟล์จาก R2
  - `POST /api/admin/login` ล็อกอิน
  - `POST /api/admin/logout` ออกจากระบบ
  - `GET /api/admin/me` ตรวจสอบสถานะล็อกอิน
  - `POST /api/admin/fonts` รับไฟล์ฟอนต์แล้วอัปขึ้น R2 พร้อมบันทึก D1
  - `DELETE /api/admin/fonts/:id` ลบรายการฟอนต์จาก D1 และลบไฟล์จาก R2
- `src/lib.ts` helper เช่น `sha256Hex`

## Cloudflare config / data layer
- `wrangler.jsonc` ผูก Worker + Static Assets + D1 + R2
- `schema.sql` สร้างตาราง `fonts` และ seed ข้อมูลตั้งต้น
- `.dev.vars.example` ตัวอย่างค่าที่ต้องใช้ตอนพัฒนา local

## เส้นทางข้อมูลตอนอัปโหลดฟอนต์
1. Admin เลือกไฟล์ใน `src/App.tsx`
2. Frontend สร้าง `FormData`
3. `src/api.ts` ส่ง `POST /api/admin/fonts`
4. `src/worker.ts` รับไฟล์แล้ว `put()` ลง R2
5. `src/worker.ts` บันทึก metadata ลง D1
6. หน้าเว็บเรียก `GET /api/fonts` เพื่อรีโหลดข้อมูล

## เส้นทางข้อมูลตอนเปิดดูฟอนต์ที่อัปโหลด
1. Frontend รับ `fileKey` จาก API
2. แปลงเป็น `fileUrl = /api/font-file/<key>`
3. Worker อ่าน object จาก R2
4. ส่งไฟล์กลับมาที่เบราว์เซอร์
