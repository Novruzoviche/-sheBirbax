
export enum Category {
  DIPLOMA = 'Diploma',
  CERTIFICATE = 'Sertifikat'
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: Category;
  createdAt: number;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
}
