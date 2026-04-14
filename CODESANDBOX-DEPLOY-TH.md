# วิธีใช้ใน CodeSandbox แล้ว deploy ขึ้น Cloudflare แบบทีละขั้น

## 1) อัปโหลดไฟล์เข้า CodeSandbox
- สร้าง sandbox ใหม่แบบ Node หรือ Vite
- แตก zip โปรเจกต์นี้ แล้วลากทุกไฟล์เข้า sandbox
- หรืออัปโหลด zip แล้วแตกไฟล์ใน terminal

## 2) ติดตั้ง package
```bash
npm install
```

## 3) ล็อกอิน Cloudflare
```bash
npx wrangler login
```

## 4) สร้าง D1 database
```bash
npx wrangler d1 create font_tai_db
```
คัดลอก `database_id` ที่ได้ แล้วเอาไปใส่ใน `wrangler.jsonc`

## 5) สร้าง R2 bucket
ไปที่ Cloudflare Dashboard > R2 > Create bucket
ตั้งชื่อ bucket ให้ตรงกับ `font-tai-files`

## 6) สร้างตารางใน D1
```bash
npx wrangler d1 execute font_tai_db --remote --file=schema.sql
```

## 7) ตั้งค่า `.dev.vars`
คัดลอกไฟล์ `.dev.vars.example` เป็น `.dev.vars`

ตัวอย่าง
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<sha256 password>
SESSION_SECRET=<random long secret>
```

## 8) สร้าง SHA-256 ของรหัสผ่าน
```bash
node -e "const crypto=require('crypto'); console.log(crypto.createHash('sha256').update('123456').digest('hex'))"
```
เปลี่ยน `123456` เป็นรหัสผ่านจริงที่คุณต้องการ

## 9) รันในเครื่อง / CodeSandbox
```bash
npm run dev
```

## 10) ทดสอบ flow
- เปิดเว็บ
- เข้าหน้า login
- ล็อกอิน
- เพิ่มฟอนต์ใหม่
- เช็กว่ามีรายการใหม่ในหน้าหลัก

## 11) ตั้ง secret สำหรับ production
```bash
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD_HASH
npx wrangler secret put SESSION_SECRET
```

## 12) Deploy
```bash
npm run deploy
```

## 13) ผูกโดเมนจริง
Cloudflare Dashboard > Workers & Pages > โปรเจกต์นี้ > Custom Domains

## หมายเหตุสำคัญ
- ฟอนต์ที่อัปโหลดจะเก็บจริงใน R2
- รายการฟอนต์เก็บใน D1
- ตัวเว็บ React ถูก build เป็น static assets แล้วเสิร์ฟจาก Worker
