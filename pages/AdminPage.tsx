
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { DocumentItem, Category } from '../types';

const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Category>(Category.DIPLOMA);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session');
    if (session === 'active') {
      setIsLoggedIn(true);
      setDocs(storageService.getDocuments());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo credentials: admin / admin123
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_session', 'active');
      setDocs(storageService.getDocuments());
      setError('');
    } else {
      setError('İstifadəçi adı və ya şifrə yanlışdır!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_session');
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    storageService.addDocument({
      title,
      description,
      imageUrl,
      category
    });

    setDocs(storageService.getDocuments());
    setTitle('');
    setDescription('');
    setImageUrl('');
    setSuccess('Sənəd uğurla əlavə edildi!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu sənədi silmək istədiyinizə əminsiniz?')) {
      storageService.deleteDocument(id);
      setDocs(storageService.getDocuments());
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-blue-600">Admin Giriş</h2>
            <p className="text-gray-500 mt-2">Daxil olmaq üçün məlumatlarınızı daxil edin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">İstifadəçi adı (admin)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Şifrə (admin123)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm italic">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
            >
              Daxil Ol
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col min-h-[auto] md:min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">Dashboard</h2>
          <nav className="flex flex-col space-y-2">
            <button className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-600 rounded-xl font-medium text-left">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span>Sənəd İdarəetməsi</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Çıxış Et</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto flex flex-col space-y-8">
          
          {/* Add Form */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Yeni Sənəd Əlavə Et</h3>
            <form onSubmit={handleAddDoc} className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Başlıq</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Məs: Magistr Diplomu"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kateqoriya</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value={Category.DIPLOMA}>Diploma</option>
                    <option value={Category.CERTIFICATE}>Sertifikat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Şəkil URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Təsvir</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Sənəd haqqında qısa məlumat..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>

              {success && <p className="text-emerald-500 font-medium">{success}</p>}

              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 self-start transition-all shadow-md"
              >
                Yadda Saxla
              </button>
            </form>
          </section>

          {/* List of Docs */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Mövcud Sənədlər ({docs.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şəkil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlıq</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kateqoriya</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {docs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={doc.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover border border-gray-100" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{doc.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          doc.category === Category.DIPLOMA ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-lg"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
