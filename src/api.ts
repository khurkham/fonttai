import type { AuthResponse, ContactMessage, FontItem } from "./types";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<T>;
}

export const api = {
  getFonts: () => request<{ items: FontItem[] }>("/api/fonts"),

  login: (username: string, password: string) =>
    request<AuthResponse>("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    request<AuthResponse>("/api/admin/logout", {
      method: "POST",
    }),

  me: () => request<AuthResponse>("/api/admin/me"),

  createFont: (formData: FormData) =>
    request<{ ok: boolean; id: string }>("/api/admin/fonts", {
      method: "POST",
      body: formData,
    }),

  updateFont: (
    id: string,
    payload: {
      name: string;
      style: string;
      owner: string;
      characteristics: string;
      details: string;
    }
  ) =>
    request<{ ok: boolean }>("/api/admin/fonts/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  deleteFont: (id: string) =>
    request<{ ok: boolean }>("/api/admin/fonts/" + id, {
      method: "DELETE",
    }),

  sendContactMessage: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
  }) =>
    request<{ ok: boolean; message?: string; id?: string }>("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  getContactMessages: () =>
    request<{ items: ContactMessage[] }>("/api/admin/contact-messages"),

  markContactAsRead: (id: string) =>
    request<{ ok: boolean }>("/api/admin/contact-messages/" + id + "/read", {
      method: "PATCH",
    }),

  deleteContactMessage: (id: string) =>
    request<{ ok: boolean }>("/api/admin/contact-messages/" + id, {
      method: "DELETE",
    }),
};