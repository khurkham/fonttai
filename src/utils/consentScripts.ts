import {
  COOKIE_CONSENT_CHANGED_EVENT,
  hasAnalyticsConsent,
  hasMarketingConsent,
} from "./cookieConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}

let analyticsLoaded = false;
let adsenseLoaded = false;

function appendScript(src: string, id: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function loadGoogleAnalytics(measurementId: string) {
  if (!measurementId || analyticsLoaded) return;

  appendScript(
    `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    "fonttai-ga-script"
  );

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  analyticsLoaded = true;
}

export function loadGoogleAdSense(clientId: string) {
  if (!clientId || adsenseLoaded) return;

  appendScript(
    `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`,
    "fonttai-adsense-script"
  );

  adsenseLoaded = true;
}

export function applyConsentBasedScripts() {
  if (hasAnalyticsConsent()) {
    loadGoogleAnalytics("G-XXXXXXXXXX");
  }

  if (hasMarketingConsent()) {
    loadGoogleAdSense("ca-pub-XXXXXXXXXXXXXXXX");
  }
}

export function bindConsentScriptLoader() {
  applyConsentBasedScripts();

  const handler = () => applyConsentBasedScripts();
  window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, handler);

  return () => {
    window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, handler);
  };
}