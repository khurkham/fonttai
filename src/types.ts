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
  fileUrl: string;
  downloadUrl: string;
  createdAt: string;
};

export type AuthResponse = {
  ok: boolean;
  authenticated?: boolean;
  message?: string;
};



export type ContactMessage = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export type VisitorCounter = {
  totalVisitors: number;
  todayVisitors: number;
  onlineNow: number;
};