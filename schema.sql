CREATE TABLE IF NOT EXISTS fonts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  style TEXT NOT NULL,
  owner TEXT NOT NULL,
  characteristics TEXT NOT NULL,
  details TEXT DEFAULT '',
  is_custom INTEGER NOT NULL DEFAULT 0,
  source_url TEXT DEFAULT '',
  file_key TEXT DEFAULT '',
  mime_type TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fonts_name ON fonts(name);
CREATE INDEX IF NOT EXISTS idx_fonts_characteristics ON fonts(characteristics);

INSERT OR IGNORE INTO fonts (id, name, style, owner, characteristics, details, is_custom, source_url)
VALUES
('f-tai-heritage', 'Tai Heritage Pro', 'Regular', 'SIL International', 'Serif', 'ฟอนต์ไต (ไทใหญ่) มาตรฐาน รองรับอักขระครบถ้วน', 0, 'https://fonts.googleapis.com/css2?family=Tai+Heritage+Pro&display=swap'),
('f-prompt', 'Prompt', 'Regular', 'Cadson Demak', 'Sans Serif', 'ฟอนต์ยอดนิยม ทันสมัย', 0, 'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700&display=swap'),
('f-sarabun', 'Sarabun', 'Regular', 'Suppon Srisawat', 'Serif', 'ฟอนต์มาตรฐานราชการไทย', 0, 'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap'),
('f-mali', 'Mali', 'Regular', 'Cadson Demak', 'Script', 'ฟอนต์ลายมือน่ารักๆ', 0, 'https://fonts.googleapis.com/css2?family=Mali:wght@300;400;500;700&display=swap'),
('f-kanit', 'Kanit', 'Bold', 'Cadson Demak', 'Sans Serif', 'ฟอนต์ไม่มีหัว นิยมใช้พาดหัว', 0, 'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;700&display=swap'),
('f-chakra', 'Chakra Petch', 'Regular', 'Cadson Demak', 'Display', 'ฟอนต์ทรงเหลี่ยม ล้ำยุค', 0, 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;700&display=swap');
