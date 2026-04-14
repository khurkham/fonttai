import { useEffect, useMemo, useState } from 'react';
import { Code, LogOut, Palette, Plus, Search, Settings, SlidersHorizontal, Trash2, Type, X } from 'lucide-react';
import { api } from './api';
import { GOOGLE_FONT_LINKS } from './lib';
import type { FontItem } from './types';
import { FontCard } from './components/FontCard';

type View = 'user' | 'login' | 'admin';

function CodeModal({ font, onClose }: { font: FontItem; onClose: () => void }) {
  const googleFontName = font.name.replace(/\s+/g, '+');
  const htmlCode = font.isCustom
    ? `<!-- เปลี่ยน URL ให้ตรงกับโดเมนคุณ -->\n<style>\n@font-face {\n  font-family: '${font.name}';\n  src: url('${font.fileUrl ?? 'https://yourdomain.com/fonts/font-file.woff2'}');\n}\n</style>`
    : `<link href="https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap" rel="stylesheet">`;
  const cssCode = font.isCustom
    ? `body {\n  font-family: '${font.name}';\n}`
    : `body {\n  font-family: '${font.name}', sans-serif;\n}`;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="space-between" style={{ alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>โค้ดสำหรับใช้งาน: {font.name}</h3>
          <button className="btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="stack" style={{ marginTop: 16 }}>
          <div>
            <strong>HTML</strong>
            <pre className="card" style={{ padding: 16, overflow: 'auto' }}><code>{htmlCode}</code></pre>
          </div>
          <div>
            <strong>CSS</strong>
            <pre className="card" style={{ padding: 16, overflow: 'auto' }}><code>{cssCode}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>('user');
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewText, setPreviewText] = useState('สวัสดีชาวโลก ၸﺌ်ꩫ်ꩾႃꩫ်ꩺꩫ် 👋 The quick brown fox jumps over the lazy dog.');
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#1F2937');
  const [searchQuery, setSearchQuery] = useState('');
  const [auth, setAuth] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [codeFont, setCodeFont] = useState<FontItem | null>(null);
  const [formError, setFormError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', style: 'Regular', owner: '', characteristics: '', details: '', file: null as File | null });

  useEffect(() => {
    for (const href of GOOGLE_FONT_LINKS) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  async function loadFonts() {
    setLoading(true);
    try {
      const data = await api.getFonts();
      setFonts(data.items);
    } finally {
      setLoading(false);
    }
  }

  async function loadMe() {
    try {
      const data = await api.me();
      setAuth(Boolean(data.authenticated));
    } catch {
      setAuth(false);
    }
  }

  useEffect(() => {
    loadFonts();
    loadMe();
  }, []);

  const filteredFonts = useMemo(() => fonts.filter((font) => {
    const q = searchQuery.toLowerCase();
    return !q || font.name.toLowerCase().includes(q) || font.style.toLowerCase().includes(q) || font.characteristics.toLowerCase().includes(q);
  }), [fonts, searchQuery]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.login(loginData.username, loginData.password);
      setAuth(true);
      setView('admin');
      setLoginError('');
      setLoginData({ username: '', password: '' });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async function handleLogout() {
    await api.logout();
    setAuth(false);
    setView('user');
  }

  async function handleAddFont(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!formData.name || !formData.owner || !formData.characteristics || !formData.file) {
      setFormError('กรอกข้อมูลให้ครบและเลือกไฟล์ฟอนต์');
      return;
    }
    const fd = new FormData();
    fd.set('name', formData.name);
    fd.set('style', formData.style);
    fd.set('owner', formData.owner);
    fd.set('characteristics', formData.characteristics);
    fd.set('details', formData.details);
    fd.set('file', formData.file);
    await api.createFont(fd);
    setShowAddForm(false);
    setFormData({ name: '', style: 'Regular', owner: '', characteristics: '', details: '', file: null });
    await loadFonts();
  }

  async function handleDelete(id: string) {
    if (!confirm('ต้องการลบฟอนต์นี้หรือไม่')) return;
    await api.deleteFont(id);
    await loadFonts();
  }

  return (
    <div>
      <header className="header">
        <div className="container" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <div className="space-between" style={{ alignItems: 'center' }}>
            <div className="row">
              <div style={{ background: '#2563eb', color: 'white', borderRadius: 16, padding: 12 }}><Type size={24} /></div>
              <div>
                <h1 style={{ margin: 0 }}>Font Tai</h1>
                <div className="muted">แหล่งรวมฟอนต์ไต พรีวิวและจัดการฟอนต์บน Cloudflare</div>
              </div>
            </div>
            <div className="row wrap">
              {auth && <span className="badge">Admin login แล้ว</span>}
              <button className="btn" onClick={() => setView('user')}>หน้าหลัก</button>
              {!auth && <button className="btn primary" onClick={() => setView('login')}><Settings size={16} /> เข้าหลังบ้าน</button>}
              {auth && <button className="btn primary" onClick={() => setView('admin')}><Settings size={16} /> จัดการฟอนต์</button>}
            </div>
          </div>
        </div>
      </header>

      {view === 'login' && (
        <main className="container" style={{ paddingTop: 32 }}>
          <form className="card stack" onSubmit={handleLogin} style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
            <h2 style={{ margin: 0 }}>เข้าสู่ระบบหลังบ้าน</h2>
            <input className="input" placeholder="username" value={loginData.username} onChange={(e) => setLoginData((p) => ({ ...p, username: e.target.value }))} />
            <input className="input" placeholder="password" type="password" value={loginData.password} onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))} />
            {loginError && <div style={{ color: '#dc2626' }}>{loginError}</div>}
            <button className="btn primary" type="submit">เข้าสู่ระบบ</button>
          </form>
        </main>
      )}

      {view === 'admin' && auth && (
        <main className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div className="space-between" style={{ alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>ระบบจัดการฟอนต์</h2>
            <div className="row wrap">
              <button className="btn primary" onClick={() => setShowAddForm(true)}><Plus size={16} /> เพิ่มฟอนต์</button>
              <button className="btn danger" onClick={handleLogout}><LogOut size={16} /> ออกจากระบบ</button>
            </div>
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>สไตล์</th>
                  <th>เจ้าของ</th>
                  <th>ลักษณะ</th>
                  <th>ประเภท</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fonts.map((font) => (
                  <tr key={font.id}>
                    <td>{font.name}</td>
                    <td>{font.style}</td>
                    <td>{font.owner}</td>
                    <td>{font.characteristics}</td>
                    <td>{font.isCustom ? 'Custom Upload' : 'Google'}</td>
                    <td>{font.isCustom && <button className="btn" onClick={() => handleDelete(font.id)}><Trash2 size={16} /></button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {(view === 'user' || (view === 'admin' && !auth)) && (
        <main className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
          <div className="card stack" style={{ padding: 20, marginBottom: 20 }}>
            <div className="row wrap">
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: '#6b7280' }} />
                <input className="input" style={{ paddingLeft: 34 }} value={previewText} onChange={(e) => setPreviewText(e.target.value)} placeholder="พิมพ์ข้อความที่ต้องการพรีวิว" />
              </div>
              <div className="row">
                <SlidersHorizontal size={18} />
                <input type="range" min="12" max="100" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
                <span>{fontSize}px</span>
              </div>
              <div className="row">
                <Palette size={18} />
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
              </div>
            </div>
            <div style={{ maxWidth: 360, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: '#6b7280' }} />
              <input className="input" style={{ paddingLeft: 34 }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ค้นหาฟอนต์" />
            </div>
          </div>

          <div className="grid">
            {loading ? <div className="card" style={{ padding: 20 }}>กำลังโหลด...</div> : filteredFonts.map((font) => (
              <FontCard key={font.id} font={font} previewText={previewText} fontSize={fontSize} textColor={textColor} onShowCode={setCodeFont} />
            ))}
          </div>
        </main>
      )}

      {showAddForm && (
        <div className="modal-backdrop">
          <form className="modal stack" onSubmit={handleAddFont}>
            <div className="space-between" style={{ alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>เพิ่มฟอนต์ใหม่</h3>
              <button type="button" className="btn" onClick={() => setShowAddForm(false)}><X size={16} /></button>
            </div>
            <input className="input" placeholder="ชื่อฟอนต์" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
            <select className="input" value={formData.style} onChange={(e) => setFormData((p) => ({ ...p, style: e.target.value }))}>
              <option>Regular</option>
              <option>Bold</option>
              <option>Italic</option>
              <option>Bold Italic</option>
            </select>
            <input className="input" placeholder="เจ้าของฟอนต์" value={formData.owner} onChange={(e) => setFormData((p) => ({ ...p, owner: e.target.value }))} />
            <input className="input" placeholder="ลักษณะฟอนต์" value={formData.characteristics} onChange={(e) => setFormData((p) => ({ ...p, characteristics: e.target.value }))} />
            <textarea className="input" placeholder="รายละเอียด" value={formData.details} onChange={(e) => setFormData((p) => ({ ...p, details: e.target.value }))} />
            <input className="input" type="file" accept=".ttf,.otf,.woff,.woff2" onChange={(e) => setFormData((p) => ({ ...p, file: e.target.files?.[0] ?? null }))} />
            {formError && <div style={{ color: '#dc2626' }}>{formError}</div>}
            <button className="btn primary" type="submit">บันทึกฟอนต์</button>
          </form>
        </div>
      )}

      {codeFont && <CodeModal font={codeFont} onClose={() => setCodeFont(null)} />}
    </div>
  );
}
