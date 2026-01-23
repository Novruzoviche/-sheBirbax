
import { DocumentItem, Category, ItemStatus, ServiceItem, ContactMessage, MessageStatus } from '../types';

// Stable keys to prevent data loss during code updates
const DOCS_STORAGE_KEY = 'ise_bir_bax_documents_stable';
const SERVICES_STORAGE_KEY = 'ise_bir_bax_services_stable';
const MESSAGES_STORAGE_KEY = 'ise_bir_bax_messages_stable';
const ADMIN_CREDS_KEY = 'ise_bir_bax_admin_creds_stable';

// Legacy keys for migration
const LEGACY_KEYS = {
  docs: ['ise_bir_bax_docs_v2', 'ise_bir_bax_docs_v1'],
  services: ['ise_bir_bax_services_v1'],
  messages: ['ise_bir_bax_messages_v1'],
  creds: ['ise_bir_bax_admin_creds_v1']
};

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

/**
 * Migrates data from older versioned keys to the stable key if the stable key is empty.
 */
const migrateData = () => {
  const migrate = (stableKey: string, legacyKeys: string[]) => {
    if (!localStorage.getItem(stableKey)) {
      for (const legacyKey of legacyKeys) {
        const oldData = localStorage.getItem(legacyKey);
        if (oldData) {
          localStorage.setItem(stableKey, oldData);
          console.log(`Migrated data from ${legacyKey} to ${stableKey}`);
          break; // Stop after first successful migration
        }
      }
    }
  };

  migrate(DOCS_STORAGE_KEY, LEGACY_KEYS.docs);
  migrate(SERVICES_STORAGE_KEY, LEGACY_KEYS.services);
  migrate(MESSAGES_STORAGE_KEY, LEGACY_KEYS.messages);
  migrate(ADMIN_CREDS_KEY, LEGACY_KEYS.creds);
};

// Run migration immediately
migrateData();

export const storageService = {
  // Admin Credentials
  getAdminCreds: () => {
    try {
      const data = localStorage.getItem(ADMIN_CREDS_KEY);
      return data ? JSON.parse(data) : { username: 'admin', password: 'admin123' };
    } catch (e) {
      return { username: 'admin', password: 'admin123' };
    }
  },

  updateAdminCreds: (creds: { username: string; password: string }) => {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
  },

  // Document Management
  getDocuments: (): DocumentItem[] => {
    try {
      const data = localStorage.getItem(DOCS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(initialDocs));
        return initialDocs;
      }
      return JSON.parse(data);
    } catch (e) {
      return initialDocs;
    }
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
    try {
      const data = localStorage.getItem(SERVICES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(initialServices));
        return initialServices;
      }
      return JSON.parse(data);
    } catch (e) {
      return initialServices;
    }
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
  },

  // Message Management
  getMessages: (): ContactMessage[] => {
    try {
      const data = localStorage.getItem(MESSAGES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): void => {
    const messages = storageService.getMessages();
    const newMessage: ContactMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      status: MessageStatus.UNREAD,
      createdAt: Date.now()
    };
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([newMessage, ...messages]));
  },

  updateMessageStatus: (id: string, status: MessageStatus): void => {
    const messages = storageService.getMessages();
    const updated = messages.map(m => m.id === id ? { ...m, status } : m);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
  },

  deleteMessage: (id: string): void => {
    const messages = storageService.getMessages();
    const updated = messages.filter(m => m.id !== id);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
  }
};
