export const GOOGLE_FONT_LINKS = [
  "https://fonts.googleapis.com/css2?family=Tai+Heritage+Pro&display=swap",
  "https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Mali:wght@300;400;500;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;700&display=swap",
];

export function makeId() {
  return crypto.randomUUID();
}

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getFamily(fontName: string, isCustom: boolean) {
  if (isCustom) return `'${fontName}'`;
  return `'${fontName}', sans-serif`;
}
