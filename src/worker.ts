import { Hono } from "hono";
import { cors } from "hono/cors";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sha256Hex } from "./lib";

type Bindings = {
  DB?: D1Database;
  FONT_BUCKET?: R2Bucket;
  ASSETS?: Fetcher;
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

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", cors({ origin: "*", credentials: true }));

function okJson(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function errJson(message: string, status = 400) {
  return okJson({ ok: false, message }, status);
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
  if (!(await isAuthed(c))) return errJson("Unauthorized", 401);
  return next();
}

app.get("/api/health", (c) => {
  return okJson({
    ok: true,
    message: "worker is running",
    hasDB: Boolean(c.env.DB),
    hasBucket: Boolean(c.env.FONT_BUCKET),
  });
});

app.get("/api/fonts", async (c) => {
  try {
    if (!c.env.DB) {
      return okJson({ items: [] });
    }

    const result = await c.env.DB.prepare(
      "SELECT * FROM fonts ORDER BY created_at DESC"
    ).all<FontRow>();

    const rows = result.results ?? [];

    const items = rows.map((row) => ({
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
        row.is_custom && row.file_key ? `/api/font-file/${row.file_key}` : "",
    }));

    return okJson({ items });
  } catch (error) {
    console.error("/api/fonts error", error);
    return okJson({ items: [], error: "Failed to load fonts" }, 200);
  }
});

app.get("/api/font-file/:key", async (c) => {
  try {
    if (!c.env.FONT_BUCKET)
      return errJson("Font bucket is not configured", 500);

    const key = c.req.param("key");
    const obj = await c.env.FONT_BUCKET.get(key);

    if (!obj) return errJson("Not found", 404);

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("etag", obj.httpEtag);
    if (!headers.get("content-type")) headers.set("content-type", "font/woff2");

    return new Response(obj.body, { headers });
  } catch (error) {
    console.error("/api/font-file error", error);
    return errJson("Failed to load font file", 500);
  }
});

app.post("/api/admin/login", async (c) => {
  try {
    const body = await c.req.json<{ username?: string; password?: string }>();

    const admin = c.env.ADMIN_USERNAME;
    const hash = c.env.ADMIN_PASSWORD_HASH;
    const secret = c.env.SESSION_SECRET;

    if (!body.username || !body.password) {
      return errJson("Username and password are required", 400);
    }

    if (!admin || !hash || !secret) {
      return errJson("Admin environment is not configured", 500);
    }

    const passwordHash = await sha256Hex(body.password);

    if (body.username !== admin || passwordHash !== hash) {
      return errJson("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    const token = await signSession(body.username, secret);
    const secure = c.req.url.startsWith("https://");

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
  return okJson({ ok: true, authenticated: await isAuthed(c) });
});

app.use("/api/admin/fonts/*", requireAuth);
app.use("/api/admin/fonts", requireAuth);

app.post("/api/admin/fonts", async (c) => {
  try {
    if (!c.env.DB) return errJson("Database is not configured", 500);
    if (!c.env.FONT_BUCKET)
      return errJson("Font bucket is not configured", 500);

    const form = await c.req.formData();
    const name = String(form.get("name") || "");
    const style = String(form.get("style") || "Regular");
    const owner = String(form.get("owner") || "");
    const characteristics = String(form.get("characteristics") || "");
    const details = String(form.get("details") || "");
    const file = form.get("file");

    if (!name || !owner || !characteristics || !(file instanceof File)) {
      return errJson("Missing required fields", 400);
    }

    const id = crypto.randomUUID();
    const ext = file.name.split(".").pop() || "woff2";
    const fileKey = `${id}.${ext}`;
    const mimeType = file.type || "font/woff2";

    await c.env.FONT_BUCKET.put(fileKey, await file.arrayBuffer(), {
      httpMetadata: { contentType: mimeType },
    });

    await c.env.DB.prepare(
      `INSERT INTO fonts
      (id, name, style, owner, characteristics, details, is_custom, file_key, mime_type)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`
    )
      .bind(id, name, style, owner, characteristics, details, fileKey, mimeType)
      .run();

    return okJson({ ok: true, id });
  } catch (error) {
    console.error("/api/admin/fonts POST error", error);
    return errJson("Failed to create font", 500);
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

// ต้องอยู่ล่างสุด
app.all("*", async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return new Response("Not Found", { status: 404 });
});

export default app;
