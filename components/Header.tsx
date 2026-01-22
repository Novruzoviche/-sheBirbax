
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative bg-gradient-to-r from-blue-700 to-blue-500 text-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in">
          Peşəkar diplom və sertifikat çapı
        </h1>
        <p className="text-lg md:text-xl opacity-90 font-light mb-8">
          Yüksək keyfiyyət, rəsmi dizayn və sürətli çatdırılma.
          Kurslar, məktəblər və şirkətlər üçün ideal həllər
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#explore" className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-50 transition-all">
            Kəşf Et
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50 rounded-t-[50px] md:rounded-t-[100px]"></div>
    </header>
  );
};

export default Header;
