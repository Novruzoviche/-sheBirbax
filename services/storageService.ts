
import { DocumentItem, Category, ItemStatus, ServiceItem } from '../types';

const DOCS_STORAGE_KEY = 'ise_bir_bax_docs_v2';
const SERVICES_STORAGE_KEY = 'ise_bir_bax_services_v1';

const initialDocs: DocumentItem[] = [
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
  }
];

const initialServices: ServiceItem[] = [
  {
    id: 's1',
    title: 'Diplom Çapı',
    description: 'Yüksək keyfiyyətli kağızlarda diplomların peşəkar çapı.',
    highlights: ['Laminasiya PULSUZ', 'Yüksək Keyfiyyət'],
    createdAt: Date.now()
  },
  {
    id: 's2',
    title: 'Sertifikat Çapı',
    description: 'Beynəlxalq standartlara uyğun sertifikatların dizaynı və çapı.',
    highlights: ['Sürətli Çatdırılma', 'Xüsusi Dizayn'],
    createdAt: Date.now()
  }
];

export const storageService = {
  // Document Management
  getDocuments: (): DocumentItem[] => {
    const data = localStorage.getItem(DOCS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(initialDocs));
      return initialDocs;
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
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
    return newDoc;
  },

  updateDocument: (id: string, updates: Partial<DocumentItem>): void => {
    const docs = storageService.getDocuments();
    const updated = docs.map(d => d.id === id ? { ...d, ...updates } : d);
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
  },

  setStatus: (id: string, status: ItemStatus): void => {
    storageService.updateDocument(id, { status });
  },

  hardDeleteDocument: (id: string): void => {
    const docs = storageService.getDocuments();
    const updated = docs.filter(d => d.id !== id);
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
  },

  // Service Management
  getServices: (): ServiceItem[] => {
    const data = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(initialServices));
      return initialServices;
    }
    return JSON.parse(data);
  },

  addService: (service: Omit<ServiceItem, 'id' | 'createdAt'>): ServiceItem => {
    const services = storageService.getServices();
    const newService: ServiceItem = {
      ...service,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    const updated = [newService, ...services];
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updated));
    return newService;
  },

  updateService: (id: string, updates: Partial<ServiceItem>): void => {
    const services = storageService.getServices();
    const updated = services.map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updated));
  },

  deleteService: (id: string): void => {
    const services = storageService.getServices();
    const updated = services.filter(s => s.id !== id);
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updated));
  }
};
