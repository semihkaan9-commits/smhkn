import React from 'react';
import { TreePine } from 'lucide-react';

interface FooterProps {
  currentUser: any;
}

export const Footer: React.FC<FooterProps> = ({ currentUser }) => {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center md:text-left md:flex justify-between items-center">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="bg-white/10 p-1.5 rounded-full">
              <img src="/logo.png" alt="Balcılar Köyü" className="w-8 h-8 object-cover rounded-full" />
            </div>
            <span className="text-xl font-bold">Balcılar Köyü</span>
          </div>
          {/* Original copyright line removed from here */}
        </div>
        <div className="text-sm text-green-200">
          <p>Acil Durumlar İçin: 112</p>
          <p>Muhtarlık: 0555 000 00 00</p>

        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Balcılar Köyü. Tüm hakları saklıdır.</p>
        <div className="flex items-center gap-4">
          <span className="opacity-10 text-[10px]" title="Debug Info">
            {currentUser?.role || 'Guest'}
          </span>
          <a href="#" className="hover:text-blue-600 transition-colors">KVKK</a>
          <a href="#" className="hover:text-blue-600 transition-colors">İletişim</a>
        </div>
      </div>
    </footer>
  );
};