
export enum Category {
  DIPLOMA = 'Diploma',
  CERTIFICATE = 'Sertifikat'
}

export enum ItemStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  DELETED = 'deleted'
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

export interface User {
  username: string;
  isLoggedIn: boolean;
}
