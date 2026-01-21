
import React, { useEffect, useState } from 'react';
import DocCard from '../components/DocCard';
import { storageService } from '../services/storageService';
import { DocumentItem, Category } from '../types';

interface CategoryPageProps {
  category: Category;
  title: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, title }) => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);

  useEffect(() => {
    const visibleDocs = storageService.getVisibleDocuments();
    setDocs(visibleDocs.filter(d => d.category === category));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Bu kateqoriyada sənəd tapılmadı.</p>
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

export default CategoryPage;
