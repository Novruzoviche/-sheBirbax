
import React, { useState } from 'react';
import { DocumentItem, Category } from '../types';

interface DocCardProps {
  doc: DocumentItem;
}

const DocCard: React.FC<DocCardProps> = ({ doc }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)]">
        <div 
          className="relative h-56 w-full overflow-hidden cursor-zoom-in"
          onClick={() => setShowModal(true)}
        >
          <img 
            src={doc.imageUrl} 
            alt={doc.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full shadow-md text-white ${
              doc.category === Category.DIPLOMA ? 'bg-indigo-600' : 'bg-emerald-500'
            }`}>
              {doc.category}
            </span>
          </div>
        </div>
        <div className="flex flex-col p-6 flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2 leading-snug">
            {doc.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 flex-grow italic">
            {doc.description}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <span className="text-xs text-gray-400">
              {new Date(doc.createdAt).toLocaleDateString('az-AZ')}
            </span>
            <button 
              onClick={() => setShowModal(true)}
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              Görüntülə &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-all"
          onClick={() => setShowModal(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[110] p-2"
            onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
            aria-label="Bağla"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="relative max-w-5xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={doc.imageUrl} 
              alt={doc.title} 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fade-in"
            />
            <div className="absolute -bottom-10 left-0 right-0 text-center">
              <h4 className="text-white font-bold text-lg">{doc.title}</h4>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocCard;
