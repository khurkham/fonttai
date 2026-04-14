export type FontItem = {
  id: string;
  name: string;
  style: string;
  owner: string;
  characteristics: string;
  details: string;
  isCustom: boolean;
  sourceUrl: string;
  fileKey: string;
  mimeType: string;
  fileUrl?: string;
  createdAt: string;
};

export type AuthResponse = {
  ok: boolean;
  authenticated?: boolean;
  message?: string;
};
