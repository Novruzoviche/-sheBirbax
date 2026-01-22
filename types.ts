
export enum Category {
  DIPLOMA = 'Diploma',
  CERTIFICATE = 'Sertifikat'
}

export enum ItemStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  DELETED = 'deleted'
}

export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  REPLIED = 'replied'
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: Category;
  status: ItemStatus;
  createdAt: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  highlights: string[]; // e.g. ["Laminasiya PULSUZ", "Ucuz qiymət"]
  createdAt: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: number;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
}
