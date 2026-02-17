import React from 'react';
import { TreePine } from 'lucide-react';

export const Footer: React.FC = () => {
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
          <p>&copy; {new Date().getFullYear()} Balcılar Köyü. Tüm hakları saklıdır.</p>
        </div>
        <div className="text-sm text-green-200">
          <p>Acil Durumlar İçin: 112</p>
          <p>Muhtarlık: 0555 000 00 00</p>

        </div>
      </div>
    </footer>
  );
};