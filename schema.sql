CREATE TABLE IF NOT EXISTS fonts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  style TEXT NOT NULL,
  owner TEXT NOT NULL,
  characteristics TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  is_custom INTEGER NOT NULL DEFAULT 1,
  source_url TEXT NOT NULL DEFAULT '',
  file_key TEXT,
  mime_type TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visitor_stats (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  user_agent TEXT,
  visited_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visitor_stats_visited_at
ON visitor_stats(visited_at);

CREATE INDEX IF NOT EXISTS idx_visitor_stats_path
ON visitor_stats(path);

CREATE INDEX IF NOT EXISTS idx_fonts_name
ON fonts(name);

CREATE INDEX IF NOT EXISTS idx_fonts_characteristics
ON fonts(characteristics);

INSERT OR IGNORE INTO fonts (
  id,
  name,
  style,
  owner,
  characteristics,
  details,
  is_custom,
  source_url,
  file_key,
  mime_type
) VALUES
(
  'f-tai-heritage',
  'Tai Heritage Pro',
  'Regular',
  'SIL International',
  'Serif',
  'ฟอนต์ไต (ไทใหญ่) มาตรฐาน รองรับอักขระครบถ้วน',
  0,
  'https://fonts.googleapis.com/css2?family=Tai+Heritage+Pro&display=swap',
  NULL,
  NULL
),
(
  'f-prompt',
  'Prompt',
  'Regular',
  'Cadson Demak',
  'Sans Serif',
  'ฟอนต์ยอดนิยม ทันสมัย',
  0,
  'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700&display=swap',
  NULL,
  NULL
),
(
  'f-sarabun',
  'Sarabun',
  'Regular',
  'Suppon Srisawat',
  'Serif',
  'ฟอนต์มาตรฐานราชการไทย',
  0,
  'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap',
  NULL,
  NULL
),
(
  'f-mali',
  'Mali',
  'Regular',
  'Cadson Demak',
  'Script',
  'ฟอนต์ลายมือน่ารักๆ',
  0,
  'https://fonts.googleapis.com/css2?family=Mali:wght@300;400;500;700&display=swap',
  NULL,
  NULL
),
(
  'f-kanit',
  'Kanit',
  'Bold',
  'Cadson Demak',
  'Sans Serif',
  'ฟอนต์ไม่มีหัว นิยมใช้พาดหัว',
  0,
  'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;700&display=swap',
  NULL,
  NULL
),
(
  'f-chakra',
  'Chakra Petch',
  'Regular',
  'Cadson Demak',
  'Display',
  'ฟอนต์ทรงเหลี่ยม ล้ำยุค',
  0,
  'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;700&display=swap',
  NULL,
  NULL
),
(
  'font-demo-001',
  'namteng',
  'Regular',
  'namteng',
  'ลายมือ',
  'ฟอนต์ตัวอย่างสำหรับทดสอบระบบ',
  1,
  '',
  'fonts/font-demo-001-namteng.ttf',
  'font/ttf'
),
(
  'font-demo-002',
  'panglong',
  'Regular',
  'panglong',
  'ทางการ',
  'ฟอนต์ตัวอย่างสำหรับทดสอบระบบ',
  1,
  '',
  'fonts/font-demo-002-panglong.ttf',
  'font/ttf'
),
(
  'font-demo-003',
  'Prompt Demo',
  'Regular',
  'Cadson Demak',
  'Sans Serif',
  'Google Font ตัวอย่างสำหรับทดสอบระบบ',
  0,
  'https://fonts.google.com/specimen/Prompt',
  NULL,
  NULL
);

INSERT OR IGNORE INTO contact_messages (
  id,
  first_name,
  last_name,
  email,
  subject,
  message,
  is_read
) VALUES
(
  'contact-demo-001',
  'สมชาย',
  'ใจดี',
  'somchai@example.com',
  'สอบถามการใช้งานเว็บไซต์',
  'สวัสดีครับ ผมต้องการสอบถามวิธีดาวน์โหลดฟอนต์จากเว็บไซต์นี้',
  0
),
(
  'contact-demo-002',
  'สุดา',
  'วัฒนา',
  'suda@example.com',
  'แนะนำฟอนต์ใหม่',
  'อยากเสนอให้เพิ่มหมวดฟอนต์ไทใหญ่แบบทางการสำหรับงานเอกสารราชการ',
  1
),
(
  'contact-demo-003',
  'Aung',
  'Khun',
  'aungkhun@example.com',
  'แจ้งปัญหา',
  'ผมเปิดหน้า preview ได้ แต่ดาวน์โหลดฟอนต์ไม่ได้ รบกวนช่วยตรวจสอบให้ด้วยครับ',
  0
);

INSERT OR IGNORE INTO visitor_stats (
  id,
  path,
  ip_hash,
  user_agent,
  visited_at
) VALUES
(
  'visit-demo-001',
  '/',
  'demo_hash_ip_001',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/137.0',
  datetime('now', '-2 days')
),
(
  'visit-demo-002',
  '/about/',
  'demo_hash_ip_002',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/137.0',
  datetime('now', '-1 day')
),
(
  'visit-demo-003',
  '/contact/',
  'demo_hash_ip_003',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/137.0',
  datetime('now', '-30 minutes')
),
(
  'visit-demo-004',
  '/',
  'demo_hash_ip_004',
  'Mozilla/5.0 (Android 14) Mobile Safari',
  datetime('now', '-4 minutes')
),
(
  'visit-demo-005',
  '/services/',
  'demo_hash_ip_005',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
  datetime('now', '-2 minutes')
);