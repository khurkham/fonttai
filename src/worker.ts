import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

type Bindings = {
  ASSETS?: Fetcher;
  DB: D1Database;
  FONT_BUCKET: R2Bucket;
  APP_NAME?: string;

  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
  SESSION_SECRET?: string;
};

type Env = {
  Bindings: Bindings;
};

type FontRow = {
  id: string;
  name: string;
  style: string;
  owner: string;
  characteristics: string;
  details: string;
  is_custom: number;
  source_url: string | null;
  file_key: string | null;
  mime_type: string | null;
  created_at: string;
};

type ContactRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: number;
};

type LoginBody = {
  username?: string;
  password?: string;
};

type ContactBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const app = new Hono<Env>();

function okJson(
  c: any,
  data: Record<string, unknown>,
  status = 200,
  extraHeaders?: HeadersInit
) {
  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      if (value !== undefined) c.header(key, String(value));
    });
  }
  return c.json(data, status);
}

function errJson(
  c: any,
  message: string,
  status = 400,
  extraHeaders?: HeadersInit
) {
  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      if (value !== undefined) c.header(key, String(value));
    });
  }
  return c.json({ ok: false, message }, status);
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getAdminConfig(env: Bindings) {
  const username = env.ADMIN_USERNAME?.trim() || "";
  const passwordHash = env.ADMIN_PASSWORD_HASH?.trim().toLowerCase() || "";
  const sessionSecret = env.SESSION_SECRET?.trim() || "";

  return {
    username,
    passwordHash,
    sessionSecret,
    configured: Boolean(username && passwordHash && sessionSecret),
  };
}

async function createSessionToken(env: Bindings) {
  const { username, passwordHash, sessionSecret } = getAdminConfig(env);
  return sha256Hex(`${username}|${passwordHash}|${sessionSecret}`);
}

async function isAuthenticated(env: Bindings, token?: string | null) {
  if (!token) return false;

  const config = getAdminConfig(env);
  if (!config.configured) return false;

  const expected = await createSessionToken(env);
  return token === expected;
}

async function requireAuth(c: any, next: () => Promise<void>) {
  const token = getCookie(c, "admin_session");
  const authed = await isAuthenticated(c.env, token);

  console.log("requireAuth cookie:", token ? "FOUND" : "MISSING");
  console.log("requireAuth authed:", authed);

  if (!authed) {
    return errJson(c, "Unauthorized", 401);
  }

  await next();
}

function mapFontRow(c: any, row: FontRow) {
  const fileUrl =
    row.file_key && row.is_custom
      ? `${new URL(c.req.url).origin}/api/font-file/${encodeURIComponent(
          row.file_key
        )}`
      : undefined;

  return {
    id: row.id,
    name: row.name,
    style: row.style,
    owner: row.owner,
    characteristics: row.characteristics,
    details: row.details,
    isCustom: Boolean(row.is_custom),
    sourceUrl: row.source_url || "",
    fileKey: row.file_key || "",
    mimeType: row.mime_type || "",
    fileUrl,
    downloadUrl: fileUrl,
    createdAt: row.created_at,
  };
}

function mapContactRow(row: ContactRow) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    createdAt: row.created_at,
    isRead: Boolean(row.is_read),
  };
}

function escapeCsv(value: unknown): string {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

function getClientIp(c: any): string {
  return (
    c.req.header("CF-Connecting-IP") ||
    c.req.header("x-forwarded-for") ||
    "unknown"
  );
}

async function upsertActiveVisitor(c: any, pathname: string) {
  const ip = getClientIp(c);
  const ipHash = await sha256Hex(ip);
  const userAgent = c.req.header("user-agent") || "";

  await c.env.DB.prepare(
    `INSERT INTO active_visitors (ip_hash, path, user_agent, last_seen_at, first_seen_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(ip_hash) DO UPDATE SET
       path = excluded.path,
       user_agent = excluded.user_agent,
       last_seen_at = CURRENT_TIMESTAMP`
  )
    .bind(ipHash, pathname, userAgent)
    .run();

  return { ipHash, userAgent };
}

function shouldTrackPath(pathname: string): boolean {
  if (pathname.startsWith("/api/")) return false;
  if (pathname.startsWith("/assets/")) return false;
  if (pathname === "/favicon.ico") return false;
  if (pathname.endsWith(".png")) return false;
  if (pathname.endsWith(".jpg")) return false;
  if (pathname.endsWith(".jpeg")) return false;
  if (pathname.endsWith(".webp")) return false;
  if (pathname.endsWith(".svg")) return false;
  if (pathname.endsWith(".css")) return false;
  if (pathname.endsWith(".js")) return false;
  if (pathname.endsWith(".woff")) return false;
  if (pathname.endsWith(".woff2")) return false;
  if (pathname.endsWith(".ttf")) return false;
  if (pathname.endsWith(".otf")) return false;
  return true;
}

function getMimeType(filename: string, fallback = "application/octet-stream") {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".ttf")) return "font/ttf";
  if (lower.endsWith(".otf")) return "font/otf";
  if (lower.endsWith(".woff")) return "font/woff";
  if (lower.endsWith(".woff2")) return "font/woff2";
  return fallback;
}

function isAllowedFontFile(file: File) {
  const lower = file.name.toLowerCase();
  return (
    lower.endsWith(".ttf") ||
    lower.endsWith(".otf") ||
    lower.endsWith(".woff") ||
    lower.endsWith(".woff2")
  );
}

function sanitizeFilename(name: string) {
  return name
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------- public routes ----------

app.get("/api/fonts", async (c) => {
  try {
    const result = await c.env.DB.prepare(
      `
      SELECT
        id, name, style, owner, characteristics, details,
        is_custom, source_url, file_key, mime_type, created_at
      FROM fonts
      ORDER BY is_custom DESC, created_at DESC, name ASC
      `
    ).all<FontRow>();

    const items = (result.results ?? []).map((row) => mapFontRow(c, row));
    return okJson(c, { ok: true, items });
  } catch (error) {
    console.error("/api/fonts error", error);
    return errJson(c, "ไม่สามารถโหลดรายการฟอนต์ได้", 500);
  }
});

app.get("/api/font-file/:key", async (c) => {
  try {
    const key = c.req.param("key");
    if (!key) return errJson(c, "Missing font key", 400);

    const object = await c.env.FONT_BUCKET.get(key);
    if (!object) return errJson(c, "ไม่พบไฟล์ฟอนต์", 404);

    const filename = key.split("/").pop() || "font";
    const contentType = object.httpMetadata?.contentType || getMimeType(key);

    const headers = new Headers();
    headers.set("content-type", contentType);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    headers.set("content-disposition", `attachment; filename="${filename}"`);

    if (object.size !== undefined) {
      headers.set("content-length", String(object.size));
    }

    return new Response(object.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("/api/font-file/:key error", error);
    return errJson(c, "ไม่สามารถดาวน์โหลดไฟล์ฟอนต์ได้", 500);
  }
});

app.get("/api/font-file/:key", async (c) => {
  try {
    const key = c.req.param("key");
    if (!key) return new Response(null, { status: 400 });

    const object = await c.env.FONT_BUCKET.head(key);
    if (!object) return new Response(null, { status: 404 });

    const filename = key.split("/").pop() || "font";
    const contentType = object.httpMetadata?.contentType || getMimeType(key);

    const headers = new Headers();
    headers.set("content-type", contentType);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    headers.set("content-disposition", `attachment; filename="${filename}"`);
    if (object.size !== undefined) {
      headers.set("content-length", String(object.size));
    }

    return new Response(null, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("/api/font-file/:key HEAD error", error);
    return new Response(null, { status: 500 });
  }
});

app.get("/api/visitor-counter", async (c) => {
  try {
    const totalResult = await c.env.DB.prepare(
      `SELECT COUNT(DISTINCT ip_hash) AS count FROM visitor_stats`
    ).first<{ count: number }>();

    const todayResult = await c.env.DB.prepare(
      `SELECT COUNT(DISTINCT ip_hash) AS count
       FROM visitor_stats
       WHERE date(visited_at, 'localtime') = date('now', 'localtime')`
    ).first<{ count: number }>();

    const onlineResult = await c.env.DB.prepare(
      `SELECT COUNT(*) AS count
       FROM active_visitors
       WHERE last_seen_at >= datetime('now', '-1 minute')`
    ).first<{ count: number }>();

    await c.env.DB.prepare(
      `DELETE FROM active_visitors
       WHERE last_seen_at < datetime('now', '-15 minutes')`
    ).run();

    return okJson(c, {
      ok: true,
      stats: {
        totalVisitors: Number(totalResult?.count ?? 0),
        todayVisitors: Number(todayResult?.count ?? 0),
        onlineNow: Number(onlineResult?.count ?? 0),
      },
    });
  } catch (error) {
    console.error("/api/visitor-counter error", error);
    return errJson(c, "ไม่สามารถดึงสถิติผู้เข้าชมได้", 500);
  }
});

app.post("/api/visitor-heartbeat", async (c) => {
  try {
    const body = await c.req.json<{ path?: string }>().catch(() => ({}));
    const pathname = (body.path || "/").trim() || "/";

    await upsertActiveVisitor(c, pathname);

    return okJson(c, { ok: true });
  } catch (error) {
    console.error("/api/visitor-heartbeat error", error);
    return errJson(c, "ไม่สามารถอัปเดตสถานะผู้ใช้งานได้", 500);
  }
});

app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json<ContactBody>();

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const subject = body.subject?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!firstName || !lastName || !email || !subject || !message) {
      return errJson(c, "กรุณากรอกข้อมูลให้ครบทุกช่อง", 400);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return errJson(c, "กรุณากรอกอีเมลให้ถูกต้อง", 400);
    }

    const id = crypto.randomUUID();

    await c.env.DB.prepare(
      `INSERT INTO contact_messages
       (id, first_name, last_name, email, subject, message, is_read)
       VALUES (?, ?, ?, ?, ?, ?, 0)`
    )
      .bind(id, firstName, lastName, email, subject, message)
      .run();

    return okJson(c, {
      ok: true,
      message: "ส่งข้อมูลเรียบร้อยแล้ว",
      id,
    });
  } catch (error) {
    console.error("/api/contact error", error);
    return errJson(c, "ไม่สามารถส่งข้อมูลติดต่อได้", 500);
  }
});

// ---------- auth routes ----------

app.get("/api/check-secrets", async (c) => {
  const config = getAdminConfig(c.env);
  return okJson(c, {
    ok: true,
    hasAdminUsername: Boolean(config.username),
    hasAdminPasswordHash: Boolean(config.passwordHash),
    hasSessionSecret: Boolean(config.sessionSecret),
    passwordHashLength: config.passwordHash.length,
    sessionSecretLength: config.sessionSecret.length,
    configured: config.configured,
  });
});

app.post("/api/admin/login", async (c) => {
  try {
    const config = getAdminConfig(c.env);
    if (!config.configured) {
      return errJson(c, "Admin environment is not configured", 500);
    }

    const body = await c.req.json<LoginBody>();
    const username = body.username?.trim() ?? "";
    const password = body.password ?? "";

    if (!username || !password) {
      return errJson(c, "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน", 400);
    }

    const passwordHash = (await sha256Hex(password)).toLowerCase();

    if (username !== config.username || passwordHash !== config.passwordHash) {
      return errJson(c, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    const token = await createSessionToken(c.env);

    setCookie(c, "admin_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return okJson(c, {
      ok: true,
      authenticated: true,
    });
  } catch (error) {
    console.error("/api/admin/login error", error);
    return errJson(c, "ไม่สามารถเข้าสู่ระบบได้", 500);
  }
});

app.post("/api/admin/logout", async (c) => {
  deleteCookie(c, "admin_session", {
    path: "/",
    secure: true,
    sameSite: "Lax",
  });

  return okJson(c, { ok: true, authenticated: false });
});

app.get("/api/admin/me", async (c) => {
  const token = getCookie(c, "admin_session");
  const authenticated = await isAuthenticated(c.env, token);

  return okJson(c, {
    ok: true,
    authenticated,
    hasCookie: Boolean(token),
  });
});

// ---------- protected admin routes ----------

app.use("/api/admin/fonts", requireAuth);
app.use("/api/admin/fonts/*", requireAuth);
app.use("/api/admin/contact-messages", requireAuth);
app.use("/api/admin/contact-messages/*", requireAuth);
app.use("/api/admin/contact-messages/export.csv", requireAuth);

app.post("/api/admin/fonts", async (c) => {
  let uploadedKey: string | null = null;

  try {
    const form = await c.req.formData();

    const name = String(form.get("name") || "").trim();
    const style = String(form.get("style") || "").trim();
    const owner = String(form.get("owner") || "").trim();
    const characteristics = String(form.get("characteristics") || "").trim();
    const details = String(form.get("details") || "").trim();
    const file = form.get("file");

    if (
      !name ||
      !style ||
      !owner ||
      !characteristics ||
      !(file instanceof File)
    ) {
      return errJson(c, "กรุณากรอกข้อมูลให้ครบและเลือกไฟล์ฟอนต์", 400);
    }

    if (!isAllowedFontFile(file)) {
      return errJson(c, "รองรับเฉพาะไฟล์ .ttf, .otf, .woff, .woff2", 400);
    }

    if (file.size <= 0) {
      return errJson(c, "ไฟล์ฟอนต์ว่างเปล่าหรือไม่ถูกต้อง", 400);
    }

    const id = crypto.randomUUID();
    const safeFilename = sanitizeFilename(file.name) || "font-file";
    const fileKey = `fonts/${id}-${safeFilename}`;
    uploadedKey = fileKey;

    const mimeType = getMimeType(file.name, file.type || "application/octet-stream");
    const buffer = await file.arrayBuffer();

    await c.env.FONT_BUCKET.put(fileKey, buffer, {
      httpMetadata: {
        contentType: mimeType,
      },
    });

    await c.env.DB.prepare(
      `INSERT INTO fonts
       (id, name, style, owner, characteristics, details, is_custom, source_url, file_key, mime_type)
       VALUES (?, ?, ?, ?, ?, ?, 1, '', ?, ?)`
    )
      .bind(id, name, style, owner, characteristics, details, fileKey, mimeType)
      .run();

    return okJson(c, { ok: true, id }, 201);
  } catch (error) {
    console.error("/api/admin/fonts POST error", error);

    if (uploadedKey) {
      try {
        await c.env.FONT_BUCKET.delete(uploadedKey);
      } catch (cleanupError) {
        console.error("cleanup uploaded font failed", cleanupError);
      }
    }

    return errJson(c, "ไม่สามารถเพิ่มฟอนต์ได้", 500);
  }
});

app.patch("/api/admin/fonts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json<{
      name?: string;
      style?: string;
      owner?: string;
      characteristics?: string;
      details?: string;
    }>();

    const name = body.name?.trim() ?? "";
    const style = body.style?.trim() ?? "";
    const owner = body.owner?.trim() ?? "";
    const characteristics = body.characteristics?.trim() ?? "";
    const details = body.details?.trim() ?? "";

    if (!id || !name || !style || !owner || !characteristics) {
      return errJson(c, "กรุณากรอกข้อมูลให้ครบ", 400);
    }

    await c.env.DB.prepare(
      `UPDATE fonts
       SET name = ?, style = ?, owner = ?, characteristics = ?, details = ?
       WHERE id = ? AND is_custom = 1`
    )
      .bind(name, style, owner, characteristics, details, id)
      .run();

    return okJson(c, { ok: true });
  } catch (error) {
    console.error("/api/admin/fonts/:id PATCH error", error);
    return errJson(c, "ไม่สามารถแก้ไขฟอนต์ได้", 500);
  }
});

app.delete("/api/admin/fonts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) return errJson(c, "Missing font id", 400);

    const font = await c.env.DB.prepare(
      `SELECT id, file_key, is_custom FROM fonts WHERE id = ? LIMIT 1`
    )
      .bind(id)
      .first<{ id: string; file_key: string | null; is_custom: number }>();

    if (!font) {
      return errJson(c, "ไม่พบฟอนต์", 404);
    }

    if (!font.is_custom) {
      return errJson(c, "ไม่สามารถลบฟอนต์ระบบได้", 400);
    }

    if (font.file_key) {
      await c.env.FONT_BUCKET.delete(font.file_key);
    }

    await c.env.DB.prepare(`DELETE FROM fonts WHERE id = ?`).bind(id).run();

    return okJson(c, { ok: true });
  } catch (error) {
    console.error("/api/admin/fonts/:id DELETE error", error);
    return errJson(c, "ไม่สามารถลบฟอนต์ได้", 500);
  }
});

app.get("/api/admin/contact-messages", async (c) => {
  try {
    const result = await c.env.DB.prepare(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    ).all<ContactRow>();

    return okJson(c, {
      ok: true,
      items: (result.results ?? []).map(mapContactRow),
    });
  } catch (error) {
    console.error("/api/admin/contact-messages error", error);
    return errJson(c, "ไม่สามารถดึงข้อมูลข้อความติดต่อได้", 500);
  }
});

app.patch("/api/admin/contact-messages/:id/read", async (c) => {
  try {
    const id = c.req.param("id");

    await c.env.DB.prepare(
      `UPDATE contact_messages SET is_read = 1 WHERE id = ?`
    )
      .bind(id)
      .run();

    return okJson(c, { ok: true });
  } catch (error) {
    console.error("/api/admin/contact-messages/:id/read error", error);
    return errJson(c, "ไม่สามารถอัปเดตสถานะข้อความได้", 500);
  }
});

app.delete("/api/admin/contact-messages/:id", async (c) => {
  try {
    const id = c.req.param("id");

    await c.env.DB.prepare(`DELETE FROM contact_messages WHERE id = ?`)
      .bind(id)
      .run();

    return okJson(c, { ok: true });
  } catch (error) {
    console.error("/api/admin/contact-messages/:id delete error", error);
    return errJson(c, "ไม่สามารถลบข้อความได้", 500);
  }
});

app.get("/api/admin/contact-messages/export.csv", async (c) => {
  try {
    const result = await c.env.DB.prepare(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    ).all<ContactRow>();

    const rows = result.results ?? [];

    const header = [
      "id",
      "first_name",
      "last_name",
      "email",
      "subject",
      "message",
      "is_read",
      "created_at",
    ];

    const csvLines = [
      header.join(","),
      ...rows.map((row) =>
        [
          escapeCsv(row.id),
          escapeCsv(row.first_name),
          escapeCsv(row.last_name),
          escapeCsv(row.email),
          escapeCsv(row.subject),
          escapeCsv(row.message),
          escapeCsv(row.is_read),
          escapeCsv(row.created_at),
        ].join(",")
      ),
    ];

    const csv = "\uFEFF" + csvLines.join("\n");

    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="contact-messages.csv"',
      },
    });
  } catch (error) {
    console.error("/api/admin/contact-messages/export.csv error", error);
    return errJson(c, "ไม่สามารถ export CSV ได้", 500);
  }
});

// ---------- SPA assets + visitor tracking ----------

app.all("*", async (c) => {
  try {
    const pathname = new URL(c.req.url).pathname;

    if (shouldTrackPath(pathname)) {
      const { ipHash, userAgent } = await upsertActiveVisitor(c, pathname);

      const recent = await c.env.DB.prepare(
        `SELECT id
         FROM visitor_stats
         WHERE ip_hash = ?
           AND path = ?
           AND visited_at >= datetime('now', '-3 minutes')
         LIMIT 1`
      )
        .bind(ipHash, pathname)
        .first<{ id: string }>();

      if (!recent) {
        await c.env.DB.prepare(
          `INSERT INTO visitor_stats (id, path, ip_hash, user_agent)
           VALUES (?, ?, ?, ?)`
        )
          .bind(crypto.randomUUID(), pathname, ipHash, userAgent)
          .run();
      }
    }
  } catch (error) {
    console.error("visitor tracking error", error);
  }

  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }

  return new Response("Not Found", { status: 404 });
});

export default app;