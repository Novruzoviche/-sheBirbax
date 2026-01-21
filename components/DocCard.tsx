
import React from 'react';
import { DocumentItem, Category } from '../types';

interface DocCardProps {
  doc: DocumentItem;
}

const DocCard: React.FC<DocCardProps> = ({ doc }) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)]">
      <div className="relative h-56 w-full overflow-hidden">
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
          <button className="text-blue-600 text-sm font-semibold hover:underline">
            Görüntülə &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocCard;
