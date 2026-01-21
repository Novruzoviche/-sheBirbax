
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import DocCard from '../components/DocCard';
import { storageService } from '../services/storageService';
import { DocumentItem } from '../types';

const HomePage: React.FC = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);

  useEffect(() => {
    setDocs(storageService.getDocuments());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bütün Nailiyyətlər</h2>
          <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <p className="text-gray-500 text-lg">Hələ heç bir sənəd əlavə edilməyib.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-start">
            {docs.map(doc => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
