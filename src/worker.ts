import { Hono } from "hono";
import { cors } from "hono/cors";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sha256Hex } from "./lib";
import type { ContactMessage, FontItem } from "./types";

type ContactRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

type ContactBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
};


type Bindings = {
  DB?: D1Database;
  FONT_BUCKET?: R2Bucket;
  ASSETS?: Fetcher;
  APP_NAME?: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
  SESSION_SECRET?: string;
};

type FontRow = {
  id: string;
  name: string;
  style: string;
  owner: string;
  characteristics: string;
  details: string | null;
  is_custom: number;
  source_url: string | null;
  file_key: string | null;
  mime_type: string | null;
  created_at: string;
};

type LoginBody = {
  username?: string;
  password?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/api/*",
  cors({
    origin: (origin) => origin || "*",
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

function okJson(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function errJson(message: string, status = 400) {
  return okJson({ ok: false, message }, status);
}

function isHttps(url: string) {
  return url.startsWith("https://");
}

async function signSession(username: string, secret: string) {
  return sha256Hex(`${username}:${secret}`);
}

async function isAuthed(c: any) {
  const username = getCookie(c, "admin_user");
  const token = getCookie(c, "admin_token");
  const admin = c.env.ADMIN_USERNAME;
  const secret = c.env.SESSION_SECRET;

  if (!username || !token || !admin || !secret) return false;

  const expected = await signSession(username, secret);
  return username === admin && token === expected;
}

async function requireAuth(c: any, next: any) {
  if (!(await isAuthed(c))) {
    return errJson("Unauthorized", 401);
  }
  return next();
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
  };
}

function mapFontRow(row: FontRow, baseUrl: string) {
  return {
    id: row.id,
    name: row.name,
    style: row.style,
    owner: row.owner,
    characteristics: row.characteristics,
    details: row.details ?? "",
    isCustom: Boolean(row.is_custom),
    sourceUrl: row.source_url ?? "",
    fileKey: row.file_key ?? "",
    mimeType: row.mime_type ?? "",
    createdAt: row.created_at,
    fileUrl:
      row.is_custom && row.file_key
        ? new URL(`/api/font-file/${row.file_key}`, baseUrl).toString()
        : "",
    downloadUrl:
      row.is_custom && row.file_key
        ? new URL(`/api/font-download/${row.file_key}`, baseUrl).toString()
        : "",
  };
}

app.get("/api/health", (c) => {
  return okJson({
    ok: true,
    appName: c.env.APP_NAME ?? null,
    hasDB: Boolean(c.env.DB),
    hasBucket: Boolean(c.env.FONT_BUCKET),
  });
});

app.get("/api/fonts", async (c) => {
  try {
    if (!c.env.DB) return okJson({ items: [] });

    const result = await c.env.DB.prepare(
      "SELECT * FROM fonts ORDER BY created_at DESC"
    ).all<FontRow>();

    return okJson({
  items: (result.results ?? []).map((row) => mapFontRow(row, c.req.url)),
});
  } catch (error) {
    console.error("/api/fonts error", error);
    return okJson({ items: [] });
  }
});

app.get("/api/font-file/:key", async (c) => {
  try {
    if (!c.env.FONT_BUCKET) {
      return errJson("Font bucket is not configured", 500);
    }

    const key = c.req.param("key");
    const obj = await c.env.FONT_BUCKET.get(key);

    if (!obj) return errJson("Not found", 404);

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("etag", obj.httpEtag);

    if (!headers.get("content-type")) {
      headers.set("content-type", "font/ttf");
    }

    headers.set("content-disposition", `inline; filename="${key}"`);
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new Response(obj.body, { headers });
  } catch (error) {
    console.error("/api/font-file error", error);
    return errJson("Failed to load font file", 500);
  }
});

app.get("/api/font-download/:key", async (c) => {
  try {
    if (!c.env.FONT_BUCKET) {
      return errJson("Font bucket is not configured", 500);
    }

    const key = c.req.param("key");
    const obj = await c.env.FONT_BUCKET.get(key);

    if (!obj) return errJson("Not found", 404);

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("etag", obj.httpEtag);

    if (!headers.get("content-type")) {
      headers.set("content-type", "application/octet-stream");
    }

    headers.set("content-disposition", `attachment; filename="${key}"`);
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new Response(obj.body, { headers });
  } catch (error) {
    console.error("/api/font-download error", error);
    return errJson("Failed to download font file", 500);
  }
});

app.post("/api/admin/login", async (c) => {
  try {
    const body = await c.req.json<LoginBody>();

    const admin = c.env.ADMIN_USERNAME;
    const hash = c.env.ADMIN_PASSWORD_HASH;
    const secret = c.env.SESSION_SECRET;

    if (!admin || !hash || !secret) {
      return errJson("Admin environment is not configured", 500);
    }

    if (!body.username || !body.password) {
      return errJson("Username and password are required", 400);
    }

    const passwordHash = await sha256Hex(body.password);

    if (body.username !== admin || passwordHash !== hash) {
      return errJson("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    const token = await signSession(body.username, secret);
    const secure = isHttps(c.req.url);

    setCookie(c, "admin_user", body.username, {
      httpOnly: true,
      secure,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    setCookie(c, "admin_token", token, {
      httpOnly: true,
      secure,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return okJson({ ok: true, authenticated: true });
  } catch (error) {
    console.error("/api/admin/login error", error);
    return errJson("Login failed", 500);
  }
});

app.post("/api/admin/logout", (c) => {
  deleteCookie(c, "admin_user", { path: "/" });
  deleteCookie(c, "admin_token", { path: "/" });
  return okJson({ ok: true });
});

app.get("/api/admin/me", async (c) => {
  return okJson({
    ok: true,
    authenticated: await isAuthed(c),
  });
});

app.get("/api/check-secrets", (c) => {
  return okJson({
    hasAdminUsername: !!c.env.ADMIN_USERNAME,
    hasAdminPasswordHash: !!c.env.ADMIN_PASSWORD_HASH,
    hasSessionSecret: !!c.env.SESSION_SECRET,
    adminUsernameValue: c.env.ADMIN_USERNAME ?? null,
    hashLength: c.env.ADMIN_PASSWORD_HASH?.length ?? 0,
    secretLength: c.env.SESSION_SECRET?.length ?? 0,
  });
});

app.use("/api/admin/fonts", requireAuth);
app.use("/api/admin/fonts/*", requireAuth);
app.use("/api/admin/contact-messages", requireAuth);

app.post("/api/admin/fonts", async (c) => {
  try {
    if (!c.env.DB) return errJson("Database is not configured", 500);
    if (!c.env.FONT_BUCKET) return errJson("Font bucket is not configured", 500);

    const form = await c.req.formData();

    const name = String(form.get("name") || "").trim();
    const style = String(form.get("style") || "Regular").trim();
    const owner = String(form.get("owner") || "").trim();
    const characteristics = String(form.get("characteristics") || "").trim();
    const details = String(form.get("details") || "").trim();
    const file = form.get("file");

    if (!name || !owner || !characteristics || !(file instanceof File)) {
      return errJson("Missing required fields", 400);
    }

    const allowed = [
      "font/ttf",
      "font/otf",
      "font/woff",
      "font/woff2",
      "application/font-sfnt",
      "application/x-font-ttf",
      "application/x-font-otf",
      "application/font-woff",
      "application/octet-stream",
    ];

    if (file.type && !allowed.includes(file.type)) {
      return errJson("ชนิดไฟล์ฟอนต์ไม่รองรับ", 400);
    }

    const id = crypto.randomUUID();
    const ext = file.name.split(".").pop()?.toLowerCase() || "ttf";
    const fileKey = `${id}.${ext}`;
    const mimeType = file.type || "font/ttf";

    await c.env.FONT_BUCKET.put(fileKey, await file.arrayBuffer(), {
      httpMetadata: { contentType: mimeType },
    });

    await c.env.DB.prepare(
      `INSERT INTO fonts
      (id, name, style, owner, characteristics, details, is_custom, source_url, file_key, mime_type)
      VALUES (?, ?, ?, ?, ?, ?, 1, '', ?, ?)`
    )
      .bind(id, name, style, owner, characteristics, details, fileKey, mimeType)
      .run();

    return okJson({ ok: true, id });
  } catch (error) {
    console.error("/api/admin/fonts POST error", error);
    return errJson(`Failed to create font: ${String(error)}`, 500);
  }
});

app.patch("/api/admin/fonts/:id", async (c) => {
  try {
    if (!c.env.DB) return errJson("Database is not configured", 500);

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

    if (!name || !style || !owner || !characteristics) {
      return errJson("Missing required fields", 400);
    }

    const existing = await c.env.DB.prepare(
      `SELECT id, is_custom FROM fonts WHERE id = ?`
    )
      .bind(id)
      .first<{ id: string; is_custom: number }>();

    if (!existing) {
      return errJson("Font not found", 404);
    }

    if (!existing.is_custom) {
      return errJson("Only custom fonts can be edited", 400);
    }

    await c.env.DB.prepare(
      `
      UPDATE fonts
      SET name = ?, style = ?, owner = ?, characteristics = ?, details = ?
      WHERE id = ?
      `
    )
      .bind(name, style, owner, characteristics, details, id)
      .run();

    return okJson({ ok: true });
  } catch (error) {
    console.error("/api/admin/fonts/:id PATCH error", error);
    return errJson(`Failed to update font: ${String(error)}`, 500);
  }
});

app.delete("/api/admin/fonts/:id", async (c) => {
  try {
    if (!c.env.DB) return errJson("Database is not configured", 500);

    const id = c.req.param("id");
    const row = await c.env.DB.prepare("SELECT * FROM fonts WHERE id = ?")
      .bind(id)
      .first<FontRow>();

    if (!row) return errJson("Not found", 404);

    if (row.file_key && c.env.FONT_BUCKET) {
      await c.env.FONT_BUCKET.delete(row.file_key);
    }

    await c.env.DB.prepare("DELETE FROM fonts WHERE id = ?").bind(id).run();

    return okJson({ ok: true });
  } catch (error) {
    console.error("/api/admin/fonts DELETE error", error);
    return errJson("Failed to delete font", 500);
  }
});


app.post("/api/contact", async (c) => {
  try {
    if (!c.env.DB) return errJson("Database is not configured", 500);

    const body = await c.req.json<ContactBody>();

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const subject = body.subject?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!firstName || !lastName || !email || !subject || !message) {
      return errJson("กรุณากรอกข้อมูลให้ครบทุกช่อง", 400);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return errJson("กรุณากรอกอีเมลให้ถูกต้อง", 400);
    }

    const id = crypto.randomUUID();

    await c.env.DB.prepare(
      `INSERT INTO contact_messages
       (id, first_name, last_name, email, subject, message)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(id, firstName, lastName, email, subject, message)
      .run();

    return okJson({
      ok: true,
      message: "ส่งข้อมูลเรียบร้อยแล้ว",
      id,
    });
  } catch (error) {
    console.error("/api/contact error", error);
    return errJson("ไม่สามารถส่งข้อมูลติดต่อได้", 500);
  }
});

app.get("/api/admin/contact-messages", async (c) => {
  try {
    if (!c.env.DB) return errJson("Database is not configured", 500);

    const result = await c.env.DB.prepare(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    ).all<ContactRow>();

    return okJson({
      ok: true,
      items: (result.results ?? []).map(mapContactRow),
    });
  } catch (error) {
    console.error("/api/admin/contact-messages error", error);
    return errJson("ไม่สามารถดึงข้อมูลข้อความติดต่อได้", 500);
  }
});

// ต้องอยู่ล่างสุด
app.all("*", async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return new Response("Not Found", { status: 404 });
});

export default app;