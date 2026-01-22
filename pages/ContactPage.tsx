
import React, { useState } from 'react';
import { storageService } from '../services/storageService';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Artificial delay to simulate network
    setTimeout(() => {
      storageService.addMessage(formData);
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Bizimlə Əlaqə</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hər hansı bir sualınız və ya təklifiniz var? Formu doldurun, biz sizinlə ən qısa zamanda əlaqə saxlayacağıq.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
          {showSuccess ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mesajınız Göndərildi!</h2>
              <p className="text-gray-500">Təşəkkür edirik. Biz sizinlə tezliklə əlaqə saxlayacağıq.</p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="mt-8 text-blue-600 font-bold hover:underline"
              >
                Yeni mesaj göndər
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Məsələn: Əli Məmmədov"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">E-poçt ünvanı</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="nümunə@mail.com"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Mövzu</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Mesajınızın mövzusu"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Mesajınız</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Bura yazın..."
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50/50 resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-200'
                }`}
              >
                {isSubmitting ? 'Göndərilir...' : 'Mesajı Göndər'}
                {!isSubmitting && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
