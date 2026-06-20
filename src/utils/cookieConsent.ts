export const CONSENT_STORAGE_KEY = "fonttai_cookie_consent_v2";
export const OPEN_COOKIE_SETTINGS_EVENT = "fonttai:open-cookie-settings";
export const COOKIE_CONSENT_CHANGED_EVENT = "fonttai:cookie-consent-changed";

export type CookieConsentSettings = {
  necessary: true;
  analytics: boolean;
  functional: boolean;
};

export type CookieConsentRecord = {
  status: "accepted" | "rejected" | "customized";
  settings: CookieConsentSettings;
  updatedAt: string;
};

export const DEFAULT_COOKIE_SETTINGS: CookieConsentSettings = {
  necessary: true,
  analytics: false,
  functional: false,
};

export function readCookieConsent(): CookieConsentRecord | null {
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CookieConsentRecord;

    return {
      status: parsed?.status || "customized",
      updatedAt: parsed?.updatedAt || new Date().toISOString(),
      settings: {
        necessary: true,
        analytics: Boolean(parsed?.settings?.analytics),
        functional: Boolean(parsed?.settings?.functional),
      },
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(record: CookieConsentRecord) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));

  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT, {
      detail: record,
    })
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT));
}

export function hasAnalyticsConsent() {
  return Boolean(readCookieConsent()?.settings.analytics);
}

export function hasFunctionalConsent() {
  return Boolean(readCookieConsent()?.settings.functional);
}
