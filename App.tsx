
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import CategoryPage from './pages/CategoryPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { Category } from './types';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/xidmetlerimiz" element={<ServicesPage />} />
            <Route path="/elaqe" element={<ContactPage />} />
            <Route 
              path="/diplomlar" 
              element={<CategoryPage category={Category.DIPLOMA} title="Diplomlar" />} 
            />
            <Route 
              path="/sertifikatlar" 
              element={<CategoryPage category={Category.CERTIFICATE} title="Sertifikatlar" />} 
            />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
        <footer className="bg-gray-900 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <div>
              <h3 className="text-2xl font-bold text-blue-400">İşə Bir Bax</h3>
              <p className="text-gray-400 mt-2">Diplom və Sertifikat Çapı | Peşəkar Çap Xidmətləri</p>
              <p className="text-gray-400 mt-2">Tel : +994771718614</p>
              <p className="text-gray-400 mt-2">whatsapp : +994771718614</p>
              <p className="text-gray-400 mt-2">e-mail : snovruzov@outlook.com</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Haqqımızda</a>
              <a href="/#/elaqe" className="hover:text-blue-400 transition-colors">Əlaqə</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Məxfilik Siyasəti</a>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} İşə Bir Bax. Bütün hüquqlar qorunur.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
