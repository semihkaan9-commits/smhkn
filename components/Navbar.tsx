import React, { useState } from 'react';
import { UserRole, AnyUser } from '../types';
import { LogOut, User, TreePine, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentUser: AnyUser | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  scrollToSection: (id: string) => void;
  onLogoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, onOpenAuth, scrollToSection, onLogoClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (id: string) => {
    scrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-800/95 backdrop-blur-sm text-white shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => {
            if (onLogoClick) onLogoClick();
            scrollToSection('hero');
          }}>
            <div className="bg-white p-1 rounded-full group-hover:scale-110 transition-transform shadow-sm">
              <img src="/logo.png" alt="Balcılar Köyü" className="w-10 h-10 object-cover rounded-full" />
            </div>
            <span className="font-bold text-xl tracking-tight">Balcılar Köyü</span>
          </div>

          {/* Desktop/Tablet Navigation - Centered */}
          <div className="hidden md:block flex-1 mx-4">
            <div className="flex items-center justify-center space-x-1 lg:space-x-4">
              <button onClick={() => scrollToSection('workers')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">Köy Rehberi</button>
              <button onClick={() => scrollToSection('news')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">Haberler</button>
              <button onClick={() => scrollToSection('events')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">Etkinlikler</button>
              <button onClick={() => scrollToSection('gallery')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">Galeri</button>
              <button onClick={() => scrollToSection('donations')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">Bağış</button>
              <button onClick={() => scrollToSection('about')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">Hakkında</button>
            </div>
          </div>

          {/* Desktop/Tablet Auth */}
          <div className="hidden md:block flex-shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {(currentUser.role === UserRole.ADMIN || currentUser.role === 'admin') ? 'Hoşgeldin Yönetici' : `${currentUser.name} ${currentUser.surname}`}
                  </p>
                  <p className="text-xs text-green-200">
                    {(currentUser.role === UserRole.ADMIN || currentUser.role === 'admin') ? 'Yönetici' :
                      (currentUser.role === UserRole.VILLAGER || currentUser.role === 'villager') ? 'Köy Sakini' : 'Misafir'}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors flex items-center justify-center"
                  title="Çıkış Yap"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-white text-green-800 hover:bg-green-100 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md whitespace-nowrap"
              >
                <User size={18} />
                <span>Giriş / Kayıt</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-green-200 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-900 border-t border-green-700 absolute w-full left-0 animate-fade-in-up shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <button onClick={() => handleMobileNav('workers')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800">Köy Rehberi</button>
            <button onClick={() => handleMobileNav('news')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800">Haberler</button>
            <button onClick={() => handleMobileNav('events')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800">Etkinlikler</button>
            <button onClick={() => handleMobileNav('gallery')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800">Galeri</button>
            <button onClick={() => handleMobileNav('donations')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800">Bağış</button>
            <button onClick={() => handleMobileNav('about')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800">Hakkında</button>

            <div className="border-t border-green-800 my-2 pt-2">
              {currentUser ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {(currentUser.role === UserRole.ADMIN || currentUser.role === 'admin') ? 'Hoşgeldin Yönetici' : `${currentUser.name} ${currentUser.surname}`}
                    </p>
                    <p className="text-xs text-green-300">
                      {(currentUser.role === UserRole.ADMIN || currentUser.role === 'admin') ? 'Yönetici' :
                        (currentUser.role === UserRole.VILLAGER || currentUser.role === 'villager') ? 'Köy Sakini' : 'Misafir'}
                    </p>
                  </div>
                  <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <LogOut size={16} /> Çıkış
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-white text-green-800 px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-2"
                >
                  <User size={20} />
                  <span>Giriş / Kayıt</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};