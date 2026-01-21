
import { DocumentItem, Category, ItemStatus } from '../types';

const STORAGE_KEY = 'ise_bir_bax_docs_v2'; // Bumped version for status support

const initialData: DocumentItem[] = [
  {
    id: '1',
    title: 'Bakı Dövlət Universiteti - Bakalavr',
    description: 'İnformasiya Texnologiyaları üzrə fərqlənmə diplomu.',
    imageUrl: 'https://picsum.photos/seed/diploma1/800/600',
    category: Category.DIPLOMA,
    status: ItemStatus.VISIBLE,
    createdAt: Date.now() - 1000000
  },
  {
    id: '2',
    title: 'Google Data Analytics Professional',
    description: 'Data analitikası üzrə beynəlxalq dərəcəli sertifikat.',
    imageUrl: 'https://picsum.photos/seed/cert1/800/600',
    category: Category.CERTIFICATE,
    status: ItemStatus.VISIBLE,
    createdAt: Date.now() - 500000
  },
  {
    id: '3',
    title: 'Microsoft Azure Fundamentals',
    description: 'Cloud computing əsasları və AZ-900 sertifikatı.',
    imageUrl: 'https://picsum.photos/seed/cert2/800/600',
    category: Category.CERTIFICATE,
    status: ItemStatus.VISIBLE,
    createdAt: Date.now() - 200000
  }
];

export const storageService = {
  getDocuments: (): DocumentItem[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data);
  },

  getVisibleDocuments: (): DocumentItem[] => {
    return storageService.getDocuments().filter(d => d.status === ItemStatus.VISIBLE);
  },

  addDocument: (doc: Omit<DocumentItem, 'id' | 'createdAt' | 'status'>): DocumentItem => {
    const docs = storageService.getDocuments();
    const newDoc: DocumentItem = {
      ...doc,
      id: Math.random().toString(36).substr(2, 9),
      status: ItemStatus.VISIBLE,
      createdAt: Date.now()
    };
    const updated = [newDoc, ...docs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newDoc;
  },

  updateDocument: (id: string, updates: Partial<DocumentItem>): void => {
    const docs = storageService.getDocuments();
    const updated = docs.map(d => d.id === id ? { ...d, ...updates } : d);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  setStatus: (id: string, status: ItemStatus): void => {
    storageService.updateDocument(id, { status });
  },

  hardDeleteDocument: (id: string): void => {
    const docs = storageService.getDocuments();
    const updated = docs.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
