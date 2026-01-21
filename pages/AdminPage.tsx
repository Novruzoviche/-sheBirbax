
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { DocumentItem, Category, ItemStatus } from '../types';

type AdminTab = 'dashboard' | 'add' | 'manage' | 'hidden' | 'deleted';

const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Category>(Category.DIPLOMA);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session');
    if (session === 'active') {
      setIsLoggedIn(true);
      refreshDocs();
    }
  }, []);

  const refreshDocs = () => {
    setDocs(storageService.getDocuments());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_session', 'active');
      refreshDocs();
      setError('');
    } else {
      setError('İstifadəçi adı və ya şifrə yanlışdır!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_session');
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    refreshDocs();
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCategory(Category.DIPLOMA);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditClick = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setDescription(doc.description);
    setImageUrl(doc.imageUrl);
    setCategory(doc.category);
    setActiveTab('add');
  };

  const updateStatus = (id: string, status: ItemStatus) => {
    storageService.setStatus(id, status);
    refreshDocs();
  };

  const hardDelete = (id: string) => {
    if (window.confirm('Bu sənədi tamamilə bazadan silmək istədiyinizə əminsiniz?')) {
      storageService.hardDeleteDocument(id);
      refreshDocs();
    }
  };

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
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="İstifadəçi adı"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrə"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
            >
              Daxil Ol
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    const total = docs.length;
    const visible = docs.filter(d => d.status === ItemStatus.VISIBLE).length;
    const hidden = docs.filter(d => d.status === ItemStatus.HIDDEN).length;
    const deleted = docs.filter(d => d.status === ItemStatus.DELETED).length;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Cəmi Sənəd', value: total, color: 'bg-blue-500' },
          { label: 'Görünən', value: visible, color: 'bg-emerald-500' },
          { label: 'Gizlədilmiş', value: hidden, color: 'bg-amber-500' },
          { label: 'Silinmişlər', value: deleted, color: 'bg-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h4 className="text-3xl font-bold mt-1">{stat.value}</h4>
            </div>
            <div className={`${stat.color} w-12 h-12 rounded-2xl opacity-20`}></div>
          </div>
        ))}
      </div>
    );
  };

  const renderForm = () => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-3xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        {editingDoc ? 'Sənədi Redaktə Et' : 'Yeni Sənəd Əlavə Et'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Başlıq</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Məs: Magistr Diplomu"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none"
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-bold text-gray-700 mb-2">Kateqoriya</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none bg-white"
            >
              <option value={Category.DIPLOMA}>Diploma</option>
              <option value={Category.CERTIFICATE}>Sertifikat</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Şəkil URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Təsvir (Məlumat)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Sənəd haqqında qısa məlumat..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none"
          ></textarea>
        </div>

        {success && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">{success}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            {editingDoc ? 'Yenilə' : 'Əlavə Et'}
          </button>
          {editingDoc && (
            <button
              type="button"
              onClick={() => { setEditingDoc(null); setActiveTab('manage'); setTitle(''); setDescription(''); setImageUrl(''); }}
              className="bg-gray-100 text-gray-600 font-bold py-4 px-10 rounded-2xl hover:bg-gray-200"
            >
              Ləğv Et
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderTable = (filterStatus: ItemStatus | 'all') => {
    const filtered = filterStatus === 'all' 
      ? docs.filter(d => d.status === ItemStatus.VISIBLE) 
      : docs.filter(d => d.status === filterStatus);

    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ön Baxış</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Məlumat</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Kateqoriya</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={doc.imageUrl} className="h-16 w-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{doc.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{doc.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${
                      doc.category === Category.DIPLOMA ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {doc.status !== ItemStatus.DELETED && (
                        <>
                          <button onClick={() => handleEditClick(doc)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Redaktə et">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          {doc.status === ItemStatus.VISIBLE ? (
                            <button onClick={() => updateStatus(doc.id, ItemStatus.HIDDEN)} className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" title="Gizlət">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                            </button>
                          ) : (
                            <button onClick={() => updateStatus(doc.id, ItemStatus.VISIBLE)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Göstər">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                          )}
                          <button onClick={() => updateStatus(doc.id, ItemStatus.DELETED)} className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors" title="Zibil qutusuna at">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </>
                      )}
                      {doc.status === ItemStatus.DELETED && (
                        <>
                          <button onClick={() => updateStatus(doc.id, ItemStatus.VISIBLE)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Bərpa et">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                          </button>
                          <button onClick={() => hardDelete(doc.id)} className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors" title="Tamamilə sil">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">Məlumat tapılmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-16">
      {/* AdminLTE style Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-xl font-black text-blue-400 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            İBİB ADMIN
          </h2>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { id: 'add', label: 'Yeni Əlavə Et', icon: 'M12 4v16m8-8H4' },
            { id: 'manage', label: 'Məzmun İdarəetməsi', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { id: 'hidden', label: 'Gizlədilmişlər', icon: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18' },
            { id: 'deleted', label: 'Zibil Qutusu', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-slate-800 text-rose-400 hover:bg-rose-900 hover:text-white rounded-2xl transition-all font-bold"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>Çıxış</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Admin Panel</p>
              <p className="text-xs text-slate-400">admin@isebirbax.az</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'add' && renderForm()}
          {activeTab === 'manage' && renderTable(ItemStatus.VISIBLE)}
          {activeTab === 'hidden' && renderTable(ItemStatus.HIDDEN)}
          {activeTab === 'deleted' && renderTable(ItemStatus.DELETED)}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
