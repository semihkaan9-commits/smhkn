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
            <span className="hidden md:inline text-sm text-green-100/60 ml-4 border-l border-white/20 pl-4">Muhtarlık: 0555 055 55 55</span>
          </div>
          <div className="md:hidden text-sm text-green-100/60 mt-2">Muhtarlık: 0555 055 55 55</div>
          {/* Original copyright line removed from here */}
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
        </div>
      </div>
    </footer>
  );
};