import React from 'react';
import { TreePine } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center md:text-left md:flex justify-between items-center">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <TreePine size={24} />
            <span className="text-xl font-bold">Balcılar Köyü</span>
          </div>
          <p className="text-green-200 text-sm">© 2026 Tüm Hakları Saklıdır.</p>
        </div>
        <div className="text-sm text-green-200">
          <p>Acil Durumlar İçin: 112</p>
          <p>Muhtarlık: 0555 000 00 00</p>

        </div>
      </div>
    </footer>
  );
};