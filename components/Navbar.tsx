import React, { useState } from 'react';
import { UserRole, AnyUser } from '../types';
import { LogOut, User, TreePine, Menu, X } from 'lucide-react';

import { EditableText } from './EditableText';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface NavbarProps {
  currentUser: AnyUser | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  scrollToSection: (id: string) => void;
  onLogoClick?: () => void;
  dynamicSections?: any[];
  refreshData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  onLogout, 
  onOpenAuth, 
  scrollToSection, 
  onLogoClick,
  dynamicSections = [],
  refreshData
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleMobileNav = (id: string) => {
    scrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  const isAdmin = currentUser?.role === UserRole.ADMIN || (currentUser?.role as string)?.toUpperCase() === 'ADMIN';

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    try {
      const newId = crypto.randomUUID();
      const { error } = await supabase.from('dynamic_sections').insert([{
        id: newId,
        title: newSectionTitle,
        content: '<p>Yeni sekme içeriği buraya gelecek...</p>',
        order_index: dynamicSections.length
      }]);
      if (error) {
        console.error("Insert error:", error);
        throw error;
      }
      toast.success('Yeni sekme eklendi!');
      setNewSectionTitle('');
      setIsAddingSection(false);
      if (refreshData) refreshData();
    } catch (err: any) {
      toast.error(`Hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
    }
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
            <div className="bg-white/10 p-1.5 rounded-full group-hover:scale-110 transition-transform shadow-sm flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Balcılar Köyü" 
                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://ui-avatars.com/api/?name=BK&background=0D8B41&color=fff';
                }}
              />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Balcılar Köyü</span>
          </div>

          {/* Desktop/Tablet Navigation - Centered */}
          <div className="hidden md:block flex-1 mx-4">
            <div className="flex items-center justify-center space-x-1 lg:space-x-4">
              <button onClick={() => scrollToSection('workers')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <EditableText textKey="nav.workers" defaultText="Köy Rehberi" />
              </button>
              <button onClick={() => scrollToSection('news')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <EditableText textKey="nav.news" defaultText="Haberler" />
              </button>
              <button onClick={() => scrollToSection('events')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <EditableText textKey="nav.events" defaultText="Etkinlikler" />
              </button>
              <button onClick={() => scrollToSection('gallery')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <EditableText textKey="nav.gallery" defaultText="Galeri" />
              </button>
              <button onClick={() => scrollToSection('donations')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <EditableText textKey="nav.donations" defaultText="Bağış" />
              </button>
              <button onClick={() => scrollToSection('about')} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <EditableText textKey="nav.about" defaultText="Hakkında" />
              </button>
              
              {dynamicSections.map(ds => (
                <button key={ds.id} onClick={() => scrollToSection(`ds-${ds.id}`)} className="whitespace-nowrap hover:bg-green-700 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <EditableText textKey={`ds.title.${ds.id}`} defaultText={ds.title} />
                </button>
              ))}

              {isAdmin && (
                <div className="relative flex items-center ml-2">
                  {isAddingSection ? (
                    <div className="flex items-center gap-2 bg-white p-1 rounded-md shadow-lg border border-green-300">
                      <input 
                        type="text" 
                        value={newSectionTitle}
                        onChange={e => setNewSectionTitle(e.target.value)}
                        placeholder="Sekme Adı..."
                        className="text-black text-sm px-2 py-1 rounded w-32 outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') handleAddSection(); if (e.key === 'Escape') setIsAddingSection(false); }}
                      />
                      <button onClick={handleAddSection} className="bg-green-600 text-white rounded px-2 py-1 text-xs font-bold hover:bg-green-700">Ekle</button>
                      <button onClick={() => setIsAddingSection(false)} className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-xs font-bold hover:bg-gray-300">İptal</button>
                    </div>
                  ) : (
                    <button onClick={() => setIsAddingSection(true)} title="Yeni Sekme Ekle" className="bg-green-700/50 hover:bg-green-600 text-white border border-green-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg transition-transform hover:scale-110 shadow">
                      +
                    </button>
                  )}
                </div>
              )}
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
            <button onClick={() => handleMobileNav('workers')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800"><EditableText textKey="nav.workers" defaultText="Köy Rehberi" /></button>
            <button onClick={() => handleMobileNav('news')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800"><EditableText textKey="nav.news" defaultText="Haberler" /></button>
            <button onClick={() => handleMobileNav('events')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800"><EditableText textKey="nav.events" defaultText="Etkinlikler" /></button>
            <button onClick={() => handleMobileNav('gallery')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800"><EditableText textKey="nav.gallery" defaultText="Galeri" /></button>
            <button onClick={() => handleMobileNav('donations')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800"><EditableText textKey="nav.donations" defaultText="Bağış" /></button>
            <button onClick={() => handleMobileNav('about')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800"><EditableText textKey="nav.about" defaultText="Hakkında" /></button>

            {dynamicSections.map(ds => (
              <button key={`mobile-ds-${ds.id}`} onClick={() => handleMobileNav(`ds-${ds.id}`)} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium hover:bg-green-800">
                <EditableText textKey={`ds.title.${ds.id}`} defaultText={ds.title} />
              </button>
            ))}

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