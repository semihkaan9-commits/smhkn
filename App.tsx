import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkerSearch } from './components/WorkerSearch';
import { NewsSection } from './components/NewsSection';
import { GallerySection } from './components/GallerySection';
import { DonationSection } from './components/DonationSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { InstallPWA } from './components/InstallPWA';
import { EventSection } from './components/EventSection';
import { AdManager } from './components/AdManager';
import { Villager, NewsItem, GalleryItem, Donation, UserRole, AnyUser, EventItem } from './types';
import { supabase } from './lib/supabase';

import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  // State - initialized empty, filled from Supabase via refreshData()
  const [currentUser, setCurrentUser] = useState<AnyUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [guests, setGuests] = useState<AnyUser[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  // Reklam Durumları - 3 Bağımsız Alan + Hero
  const [area1Ad, setArea1Ad] = useState<string | null>(null);
  const [area1AdLink, setArea1AdLink] = useState<string | null>(null);
  const [area2AAd, setArea2AAd] = useState<string | null>(null);
  const [area2AAdLink, setArea2AAdLink] = useState<string | null>(null);
  const [heroAd, setHeroAd] = useState<string | null>(null);
  const [heroAdLink, setHeroAdLink] = useState<string | null>(null);

  // View State
  const [currentView, setCurrentView] = useState<'home' | 'all-news' | 'all-events' | 'all-gallery'>('home');

  // Helper to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;

      let role: UserRole = UserRole.GUEST;
      const dbRole = profile.role?.toUpperCase();
      if (dbRole === 'ADMIN') role = UserRole.ADMIN;
      else if (dbRole === 'VILLAGER') role = UserRole.VILLAGER;

      let userData: AnyUser = {
        id: profile.id,
        name: profile.full_name?.split(' ')[0] || '',
        surname: profile.full_name?.split(' ').slice(1).join(' ') || '',
        role: role,
        email: undefined
      };

      if (profile.role === UserRole.VILLAGER) {
        const { data: villagerData } = await supabase.from('villagers').select('*').eq('user_id', userId).single();
        if (villagerData) {
          userData = { ...userData, ...villagerData, id: userId, role: UserRole.VILLAGER };
        }
      }

      setCurrentUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshData = async () => {
    try {
      const { data: villagersData } = await supabase.from('villagers').select('*').order('name');
      if (villagersData) {
        setVillagers(villagersData);
      }

      const { data: guestsData } = await supabase.from('profiles').select('*').eq('role', 'guest');
      if (guestsData) {
        const mappedGuests: AnyUser[] = guestsData.map((g: any) => ({
          id: g.id,
          name: g.full_name?.split(' ')[0] || '',
          surname: g.full_name?.split(' ').slice(1).join(' ') || '',
          role: UserRole.GUEST,
          email: undefined
        }));
        setGuests(mappedGuests);
      }

      // Fetch profiles for mapping
      const { data: profiles } = await supabase.from('profiles').select('id, full_name');
      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      const { data: newsData } = await supabase.from('news').select('*').order('date', { ascending: false });
      if (newsData) {
        const mappedNews = newsData.map((item: any) => ({
          ...item,
          imageUrl: item.image_url || item.imageUrl,
          author: profileMap.get(item.author_id) || item.author || 'Bilinmiyor'
        }));
        setNews(mappedNews);
      }

      const { data: galleryData } = await supabase.from('gallery').select('*').order('date', { ascending: false });
      if (galleryData) setGalleryItems(galleryData);

      const { data: eventsData } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (eventsData) {
        const mappedEvents = eventsData.map((item: any) => ({
          ...item,
          imageUrl: item.image_url || item.imageUrl,
          startDate: item.start_date || item.startDate,
          endDate: item.end_date || item.endDate,
          author: profileMap.get(item.author_id) || item.author || 'Bilinmiyor'
        }));
        setEvents(mappedEvents);
      }

      const { data: donationsData } = await supabase.from('donations').select('*').order('date', { ascending: false });
      if (donationsData) setDonations(donationsData);

    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      await refreshData();
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handlers
  const handleLogin = async (user: AnyUser) => {
    setCurrentUser(user);
    setIsAuthOpen(false);

    if (user.role === UserRole.ADMIN || (user.role as string) === 'admin') {
      toast.success('Hoşgeldin Yönetici');
    } else {
      toast.success(`Hoş geldin, ${user.name}!`);
    }

    await refreshData();
  };

  const handleRegister = async (user: AnyUser) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
    toast.success('Kayıt başarılı! Hoş geldiniz.');
    await refreshData();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.reload();
    }
  };

  const handleUpdateAd = (area: 'top' | 'bottomA' | 'hero', url: string | null, link: string | null) => {
    if (area === 'top') {
      setArea1Ad(url);
      setArea1AdLink(link);
    } else if (area === 'bottomA') {
      setArea2AAd(url);
      setArea2AAdLink(link);
    } else if (area === 'hero') {
      setHeroAd(url);
      setHeroAdLink(link);
    }
  };

  const handleAddNews = async (title: string, content: string, imageUrl?: string) => {
    try {
      if (!currentUser) return;

      const newNews = {
        title,
        content,
        image_url: imageUrl,
        date: new Date().toLocaleDateString('tr-TR'),
        author_id: currentUser.id,
      };

      const { error } = await supabase.from('news').insert([newNews]);
      if (error) throw error;

      toast.success('Haber başarıyla eklendi!');
      await refreshData();
    } catch (error) {
      console.error('Error adding news:', error);
      toast.error('Haber eklenirken bir hata oluştu.');
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      const { data, error } = await supabase.from('news').delete().eq('id', id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Silinemedi (Yetki Yok)');

      toast.success('Haber silindi.');
      setNews(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Error deleting news:', error);
      toast.error(`Haber silinemedi: ${error.message || 'Bilinmeyen hata'}`);
    }
  };

  const handleAddEvent = async (title: string, content: string, imageUrl?: string, startDate?: string, endDate?: string) => {
    try {
      if (!currentUser) return;

      const newEvent = {
        title,
        content,
        image_url: imageUrl,
        date: new Date().toLocaleDateString('tr-TR'),
        start_date: startDate,
        end_date: endDate,
        author_id: currentUser.id
      };

      const { error } = await supabase.from('events').insert([newEvent]);
      if (error) throw error;

      if (imageUrl) {
        const galleryItem = {
          title: `Etkinlik: ${title}`,
          imageUrl,
          date: new Date().toLocaleDateString('tr-TR'),
          category: 'Etkinlik'
        };
        await supabase.from('gallery').insert([galleryItem]);
      }

      toast.success('Etkinlik başarıyla oluşturuldu!');
      await refreshData();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Etkinlik oluşturulurken hata oluştu.');
    }
  };

  const handleDeleteEvent = async (id: string, title?: string) => {
    try {
      // 1. Delete the Event from database and verify
      const { data, error } = await supabase.from('events').delete().eq('id', id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Silinemedi (Yetki Yok)');

      // 2. Best-effort: Delete associated Gallery item
      if (title) {
        const galleryTitle = `Etkinlik: ${title}`;
        await supabase.from('gallery').delete().eq('title', galleryTitle).eq('category', 'Etkinlik');
      }

      toast.success('Etkinlik ve ilişkili dosyalar silindi.');
      // Remove from UI immediately
      setEvents(prev => prev.filter(item => item.id !== id));
      setGalleryItems(prev => prev.filter(g => !(title && g.caption && g.caption.includes(title))));
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(`Silme başarısız: ${error.message || 'Yetki sorunu veya bağlantı hatası'}`);
    }
  };

  const handleAddGalleryItem = async (title: string, imageUrl: string, category: string) => {
    try {
      const newItem = {
        title,
        imageUrl,
        category,
        date: new Date().toLocaleDateString('tr-TR')
      };
      const { error } = await supabase.from('gallery').insert([newItem]);
      if (error) throw error;
      toast.success('Fotoğraf galeriye eklendi.');
      await refreshData();
    } catch (error) {
      console.error('Error adding gallery item:', error);
      toast.error('Galeri güncellenemedi.');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    try {
      const { data, error } = await supabase.from('gallery').delete().eq('id', id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Silinemedi (Yetki Yok)');

      toast.success('Fotoğraf silindi.');
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      toast.error(`Silme işlemi başarısız: ${error.message || 'Bilinmeyen hata'}`);
    }
  };

  const handleRateVillager = async (villagerId: string, rating: number) => {
    toast.success('Oylama işlemi kaydedildi.');
  };

  const handleDeleteVillager = async (id: string) => {
    try {
      const { data, error } = await supabase.from('villagers').delete().eq('id', id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Silinemedi (Yetki Yok)');

      toast.success('Kişi listeden silindi.');
      setVillagers(prev => prev.filter(v => v.id !== id));
    } catch (error: any) {
      console.error('Error deleting villager:', error);
      toast.error(`Silme işlemi başarısız: ${error.message || 'Bilinmeyen hata'}`);
    }
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleUpdateNews = async (id: string, title: string, content: string, date: string) => {
    try {
      setNews(prev => prev.map(n => n.id === id ? { ...n, title, content, date } : n));

      const { data, error } = await supabase.from('news').update({
        title,
        content,
        date
      }).eq('id', id).select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Güncellenemedi (Yetki Yok)');

      toast.success('Haber başarıyla güncellendi.');
      await refreshData();
    } catch (error: any) {
      console.error('Error updating news:', error);
      toast.error(`Haber güncellenemedi: ${error.message || 'Yetki Yok'}`);
      await refreshData();
    }
  };

  const handleUpdateEvent = async (id: string, title: string, content: string, startDate?: string, endDate?: string) => {
    try {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, title, content, startDate, endDate } : e));

      const { data, error } = await supabase.from('events').update({
        title,
        content,
        start_date: startDate,
        end_date: endDate
      }).eq('id', id).select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Güncellenemedi (Yetki Yok)');

      toast.success('Etkinlik başarıyla güncellendi.');
      await refreshData();
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(`Etkinlik güncellenemedi: ${error.message || 'Yetki Yok'}`);
      await refreshData();
    }
  };

  const handleUpdateVillager = async (updatedVillager: Villager) => {
    try {
      setVillagers(prev => prev.map(v => v.id === updatedVillager.id ? updatedVillager : v));

      const { data, error } = await supabase.from('villagers').update({
        name: updatedVillager.name,
        surname: updatedVillager.surname,
        nickname: updatedVillager.nickname,
        profession: updatedVillager.profession,
        address: updatedVillager.address,
        contact: updatedVillager.contact
      }).eq('id', updatedVillager.id).select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Güncellenemedi (Yetki Yok)');

      toast.success('Kişi başarıyla güncellendi.');
      await refreshData();

    } catch (error: any) {
      console.error('Error updating villager:', error);
      toast.error(`Güncelleme başarısız: ${error.message || 'Yetki Yok'}`);
      await refreshData();
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <InstallPWA />
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        scrollToSection={scrollToSection}
        onLogoClick={handleLogoClick}
      />

      {/* Admin Reklam Paneli */}
      {currentUser?.role === UserRole.ADMIN && currentView === 'home' && (
        <AdManager
          onUpdateAd={handleUpdateAd}
          currentTopAd={area1Ad}
          currentTopAdLink={area1AdLink}
          currentBottomAAd={area2AAd}
          currentBottomAAdLink={area2AAdLink}
          currentHeroAd={heroAd}
          currentHeroAdLink={heroAdLink}
        />
      )}

      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero heroAd={heroAd} heroAdLink={heroAdLink} />

            <WorkerSearch
              villagers={villagers}
              onRateVillager={handleRateVillager}
              topAd={area1Ad}
              topAdLink={area1AdLink}
              currentUser={currentUser}
              onDeleteVillager={handleDeleteVillager}
              onUpdateVillager={handleUpdateVillager}
            />

            <NewsSection
              news={news}
              currentUser={currentUser}
              onAddNews={handleAddNews}
              onDeleteNews={handleDeleteNews}
              onUpdateNews={handleUpdateNews}
              limit={2}
              onShowAll={() => setCurrentView('all-news')}
            />

            <EventSection
              events={events}
              currentUser={currentUser}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
              onUpdateEvent={handleUpdateEvent}
              limit={3}
              onShowAll={() => setCurrentView('all-events')}
            />

            <GallerySection
              items={galleryItems}
              currentUser={currentUser}
              onAddItem={handleAddGalleryItem}
              onDeleteItem={handleDeleteGalleryItem}
              limit={4}
              onShowAll={() => setCurrentView('all-gallery')}
            />

            <DonationSection
              bottomAAd={area2AAd}
              bottomAAdLink={area2AAdLink}
            />

            <AboutSection />
          </>
        )}

        {currentView === 'all-news' && (
          <div className="pt-24 pb-10">
            <div className="max-w-7xl mx-auto px-4 mb-6">
              <button onClick={() => setCurrentView('home')} className="flex items-center text-green-700 font-bold hover:underline mb-4">
                ← Ana Sayfaya Dön
              </button>
            </div>
            <NewsSection
              news={news}
              currentUser={currentUser}
              onAddNews={handleAddNews}
              onDeleteNews={handleDeleteNews}
              onUpdateNews={handleUpdateNews}
            />
          </div>
        )}

        {currentView === 'all-events' && (
          <div className="pt-24 pb-10">
            <div className="max-w-7xl mx-auto px-4 mb-6">
              <button onClick={() => setCurrentView('home')} className="flex items-center text-green-700 font-bold hover:underline mb-4">
                ← Ana Sayfaya Dön
              </button>
            </div>
            <EventSection
              events={events}
              currentUser={currentUser}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
              onUpdateEvent={handleUpdateEvent}
            />
          </div>
        )}

        {currentView === 'all-gallery' && (
          <div className="pt-24 pb-10">
            <div className="max-w-7xl mx-auto px-4 mb-6">
              <button onClick={() => setCurrentView('home')} className="flex items-center text-green-700 font-bold hover:underline mb-4">
                ← Ana Sayfaya Dön
              </button>
            </div>
            <GallerySection
              items={galleryItems}
              currentUser={currentUser}
              onAddItem={handleAddGalleryItem}
              onDeleteItem={handleDeleteGalleryItem}
            />
          </div>
        )}

      </main>

      <Footer currentUser={currentUser} />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        villagers={villagers}
        guests={guests}
      />
    </div>
  );
};

export default App;