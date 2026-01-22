
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { DocumentItem, Category, ItemStatus, ServiceItem, ContactMessage, MessageStatus } from '../types';

type AdminTab = 'dashboard' | 'inbox' | 'services' | 'add' | 'manage' | 'hidden' | 'deleted';

const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  
  // Document Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Category>(Category.DIPLOMA);
  
  // Service Form States
  const [sTitle, setSTitle] = useState('');
  const [sDescription, setSDescription] = useState('');
  const [sHighlights, setSHighlights] = useState(''); // comma separated
  
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session');
    if (session === 'active') {
      setIsLoggedIn(true);
      refreshData();
    }
  }, []);

  const refreshData = () => {
    setDocs(storageService.getDocuments());
    setServices(storageService.getServices());
    setMessages(storageService.getMessages());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_session', 'active');
      refreshData();
      setError('');
    } else {
      setError('İstifadəçi adı və ya şifrə yanlışdır!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_session');
  };

  // Inbox Handlers
  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === MessageStatus.UNREAD) {
      storageService.updateMessageStatus(msg.id, MessageStatus.READ);
      refreshData();
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Bu mesajı silmək istəyirsiniz?')) {
      storageService.deleteMessage(id);
      setSelectedMessage(null);
      refreshData();
    }
  };

  const handleReplyMessage = (msg: ContactMessage) => {
    storageService.updateMessageStatus(msg.id, MessageStatus.REPLIED);
    refreshData();
    window.location.href = `mailto:${msg.email}?subject=Re: ${msg.subject}&body=Salam ${msg.name},%0D%0A%0D%0A`;
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    if (editingDoc) {
      storageService.updateDocument(editingDoc.id, {
        title,
        description,
        imageUrl,
        category
      });
      setSuccess('Sənəd yeniləndi!');
      setEditingDoc(null);
      setActiveTab('manage');
    } else {
      storageService.addDocument({
        title,
        description,
        imageUrl,
        category
      });
      setSuccess('Yeni sənəd əlavə edildi!');
    }

    refreshData();
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCategory(Category.DIPLOMA);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle || !sDescription) return;

    const highlightsArray = sHighlights.split(',').map(h => h.trim()).filter(h => h !== '');

    if (editingService) {
      storageService.updateService(editingService.id, {
        title: sTitle,
        description: sDescription,
        highlights: highlightsArray
      });
      setSuccess('Xidmət yeniləndi!');
      setEditingService(null);
    } else {
      storageService.addService({
        title: sTitle,
        description: sDescription,
        highlights: highlightsArray
      });
      setSuccess('Yeni xidmət əlavə edildi!');
    }

    refreshData();
    setSTitle('');
    setSDescription('');
    setSHighlights('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditDoc = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setDescription(doc.description);
    setImageUrl(doc.imageUrl);
    setCategory(doc.category);
    setActiveTab('add');
  };

  const handleEditService = (service: ServiceItem) => {
    setEditingService(service);
    setSTitle(service.title);
    setSDescription(service.description);
    setSHighlights(service.highlights.join(', '));
    setActiveTab('services');
  };

  const updateDocStatus = (id: string, status: ItemStatus) => {
    storageService.setStatus(id, status);
    refreshData();
  };

  const hardDeleteDoc = (id: string) => {
    if (window.confirm('Bu sənədi tamamilə silmək istəyirsiniz?')) {
      storageService.hardDeleteDocument(id);
      refreshData();
    }
  };

  const deleteService = (id: string) => {
    if (window.confirm('Bu xidməti silmək istəyirsiniz?')) {
      storageService.deleteService(id);
      refreshData();
    }
  };

  const unreadMessagesCount = messages.filter(m => m.status === MessageStatus.UNREAD).length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-10">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Xoş Gəlmisiniz</h2>
            <p className="text-gray-500 mt-2 italic">İşə Bir Bax Admin Girişi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="İstifadəçi adı"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none bg-gray-50"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrə"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none bg-gray-50"
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all"
            >
              Daxil Ol
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm font-medium">Cəmi Sənəd</p>
        <h4 className="text-3xl font-bold mt-1">{docs.length}</h4>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative">
        <p className="text-gray-500 text-sm font-medium">Yeni Mesaj</p>
        <h4 className={`text-3xl font-bold mt-1 ${unreadMessagesCount > 0 ? 'text-rose-600' : ''}`}>
          {unreadMessagesCount}
        </h4>
        {unreadMessagesCount > 0 && (
          <div className="absolute top-6 right-6 w-3 h-3 bg-rose-500 rounded-full animate-ping"></div>
        )}
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm font-medium">Xidmətlər</p>
        <h4 className="text-3xl font-bold mt-1 text-blue-600">{services.length}</h4>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm font-medium">Zibil Qutusu</p>
        <h4 className="text-3xl font-bold mt-1 text-slate-400">{docs.filter(d => d.status === ItemStatus.DELETED).length}</h4>
      </div>
    </div>
  );

  const renderInbox = () => (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-220px)]">
      {/* Message List */}
      <div className="w-full lg:w-96 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Mesajlar</h3>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">
            {messages.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic text-sm">Mesaj yoxdur.</div>
          ) : (
            messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-6 border-b border-gray-50 transition-all hover:bg-gray-50 group relative ${
                  selectedMessage?.id === msg.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm truncate pr-4 ${msg.status === MessageStatus.UNREAD ? 'font-black text-gray-900' : 'text-gray-600'}`}>
                    {msg.name}
                  </span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-xs truncate ${msg.status === MessageStatus.UNREAD ? 'font-bold text-gray-800' : 'text-gray-400'}`}>
                  {msg.subject}
                </p>
                {msg.status === MessageStatus.UNREAD && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
                {msg.status === MessageStatus.REPLIED && (
                  <div className="absolute right-4 bottom-4">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z"/></svg>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {selectedMessage ? (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-8 border-b border-gray-50 flex justify-between items-start">
              <div className="min-w-0">
                <h2 className="text-2xl font-black text-gray-900 mb-2 truncate">{selectedMessage.subject}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-bold text-blue-600">{selectedMessage.name}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">{selectedMessage.email}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400">{new Date(selectedMessage.createdAt).toLocaleString('az-AZ')}</span>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteMessage(selectedMessage.id)}
                className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Sil"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div className="p-10 flex-1 overflow-y-auto leading-relaxed text-gray-700 whitespace-pre-wrap text-lg">
              {selectedMessage.message}
            </div>
            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex gap-4">
              <button 
                onClick={() => handleReplyMessage(selectedMessage)}
                className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Cavabla
              </button>
              <button 
                onClick={() => {
                  storageService.updateMessageStatus(selectedMessage.id, MessageStatus.UNREAD);
                  refreshData();
                  setSelectedMessage(null);
                }}
                className="bg-white border border-gray-200 text-gray-600 font-bold py-4 px-8 rounded-2xl hover:bg-gray-50 transition-all"
              >
                Oxunmamış kimi işarələ
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-12">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-bold text-gray-400">Oxumaq üçün soldan mesaj seçin</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocForm = () => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-3xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingDoc ? 'Sənədi Redaktə Et' : 'Yeni Sənəd Əlavə Et'}</h3>
      <form onSubmit={handleDocSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlıq" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" required />
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none">
            <option value={Category.DIPLOMA}>Diploma</option>
            <option value={Category.CERTIFICATE}>Sertifikat</option>
          </select>
        </div>
        <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Şəkil URL" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Təsvir..." rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"></textarea>
        {success && <div className="text-emerald-600 font-bold">{success}</div>}
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-blue-700 transition-all">{editingDoc ? 'Yenilə' : 'Əlavə Et'}</button>
          {editingDoc && <button type="button" onClick={() => { setEditingDoc(null); setActiveTab('manage'); }} className="bg-gray-100 px-10 rounded-2xl font-bold">Ləğv Et</button>}
        </div>
      </form>
    </div>
  );

  const renderServiceManager = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-3xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingService ? 'Xidməti Redaktə Et' : 'Yeni Xidmət Əlavə Et'}</h3>
        <form onSubmit={handleServiceSubmit} className="space-y-6">
          <input type="text" value={sTitle} onChange={(e) => setSTitle(e.target.value)} placeholder="Xidmət Adı" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" required />
          <textarea value={sDescription} onChange={(e) => setSDescription(e.target.value)} placeholder="Xidmət Təsviri..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" required></textarea>
          <input type="text" value={sHighlights} onChange={(e) => setSHighlights(e.target.value)} placeholder="Özəlliklər (vergüllə ayırın: Laminasiya PULSUZ, Ucuz, ...)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
          <button type="submit" className="bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-blue-700 transition-all">
            {editingService ? 'Yenilə' : 'Xidmət Əlavə Et'}
          </button>
          {editingService && <button type="button" onClick={() => { setEditingService(null); setSTitle(''); setSDescription(''); setSHighlights(''); }} className="ml-4 bg-gray-100 px-10 py-4 rounded-2xl font-bold">Ləğv Et</button>}
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Xidmət</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Özəlliklər</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map(s => (
              <tr key={s.id}>
                <td className="px-6 py-4 font-bold">{s.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.highlights.join(', ')}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEditService(s)} className="text-blue-600 font-bold hover:underline">Redaktə</button>
                  <button onClick={() => deleteService(s.id)} className="text-red-600 font-bold hover:underline">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDocTable = (status: ItemStatus | 'visible') => {
    const filtered = docs.filter(d => status === 'visible' ? d.status === ItemStatus.VISIBLE : d.status === status);
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Ön Baxış</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Başlıq</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><img src={d.imageUrl} className="h-12 w-16 object-cover rounded-lg" /></td>
                <td className="px-6 py-4 font-bold">{d.title}</td>
                <td className="px-6 py-4 text-right space-x-2">
                   <button onClick={() => handleEditDoc(d)} className="text-blue-600 font-bold">Edit</button>
                   <button onClick={() => updateDocStatus(d.id, d.status === ItemStatus.VISIBLE ? ItemStatus.HIDDEN : ItemStatus.VISIBLE)} className="text-amber-600 font-bold">
                     {d.status === ItemStatus.VISIBLE ? 'Gizlət' : 'Göstər'}
                   </button>
                   <button onClick={() => updateDocStatus(d.id, ItemStatus.DELETED)} className="text-rose-600 font-bold">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-16">
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-xl font-black text-blue-400">İBİB ADMIN</h2>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'inbox', label: 'Mesajlar', icon: '✉️', badge: unreadMessagesCount },
            { id: 'services', label: 'Xidmətlər', icon: '🛠️' },
            { id: 'add', label: 'Sənəd Əlavə Et', icon: '➕' },
            { id: 'manage', label: 'Sənədləri İdarə Et', icon: '📄' },
            { id: 'hidden', label: 'Gizlədilmişlər', icon: '👁️‍🗨️' },
            { id: 'deleted', label: 'Zibil Qutusu', icon: '🗑️' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as AdminTab); setSelectedMessage(null); }}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-slate-900">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-6">
          <button onClick={handleLogout} className="w-full p-4 bg-slate-800 text-rose-400 rounded-2xl font-bold">Çıxış</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-800 capitalize">
            {activeTab === 'inbox' ? 'Gələnlər Qutusu' : activeTab}
          </h1>
        </header>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'inbox' && renderInbox()}
        {activeTab === 'services' && renderServiceManager()}
        {activeTab === 'add' && renderDocForm()}
        {activeTab === 'manage' && renderDocTable('visible')}
        {activeTab === 'hidden' && renderDocTable(ItemStatus.HIDDEN)}
        {activeTab === 'deleted' && renderDocTable(ItemStatus.DELETED)}
      </main>
    </div>
  );
};

export default AdminPage;
