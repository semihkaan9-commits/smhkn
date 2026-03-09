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
      
      let role: UserRole = UserRole.GUEST;
      let userData: AnyUser = {
        id: userId,
        name: 'Kullanıcı',
        surname: '',
        role: role,
        email: undefined
      };

      if (!error && profile) {
        const dbRole = profile.role?.toUpperCase();
        if (dbRole === 'ADMIN') role = UserRole.ADMIN;
        else if (dbRole === 'VILLAGER') role = UserRole.VILLAGER;

        userData.name = profile.full_name?.split(' ')[0] || 'Kullanıcı';
        userData.surname = profile.full_name?.split(' ').slice(1).join(' ') || '';
        userData.role = role;

        if (profile.role === UserRole.VILLAGER) {
          const { data: villagerData } = await supabase.from('villagers').select('*').eq('user_id', userId).single();
          if (villagerData) {
            userData = { ...userData, ...villagerData, id: userId, role: UserRole.VILLAGER };
          }
        }
      } else if (error && error.code !== 'PGRST116') {
         console.error('Error fetching profile but setting default:', error);
      }

      setCurrentUser(userData);
    } catch (error) {
      console.error('General error fetching profile:', error);
      // Ensure user is still logged in as guest if everything fails
      setCurrentUser({
        id: userId,
        name: 'Kullanıcı',
        surname: '',
        role: UserRole.GUEST,
        email: undefined
      });
    }
  };

  const refreshData = async () => {
    try {
      // Individual try-catches for each table to prevent one failure from blocking everything
      try {
        const { data: villagersData } = await supabase.from('villagers').select('*').order('name');
        if (villagersData) setVillagers(villagersData);
      } catch (e) { console.error('Error fetching villagers:', e); }

      try {
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
      } catch (e) { console.error('Error fetching guests:', e); }

      try {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name');
        const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

        const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (newsData) {
          const mappedNews = newsData.map((item: any) => ({
            ...item,
            imageUrl: item.image_url || item.imageUrl,
            author: profileMap.get(item.author_id) || item.author || 'Bilinmiyor'
          }));
          setNews(mappedNews);
        }

        const { data: eventsData } = await supabase.from('events').select('*').order('created_at', { ascending: false });
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
      } catch (e) { console.error('Error fetching CMS data:', e); }

      try {
        const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (galleryData) setGalleryItems(galleryData);
      } catch (e) { console.error('Error fetching gallery:', e); }

      try {
        const { data: donationsData } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
        if (donationsData) setDonations(donationsData);
      } catch (e) { console.error('Error fetching donations:', e); }

      try {
        const { data: adsData } = await supabase.from('ads').select('*');
        if (adsData) {
          adsData.forEach((ad: any) => {
            if (ad.area === 'top') {
              setArea1Ad(ad.url);
              setArea1AdLink(ad.link);
            } else if (ad.area === 'bottomA') {
              setArea2AAd(ad.url);
              setArea2AAdLink(ad.link);
            } else if (ad.area === 'hero') {
              setHeroAd(ad.url);
              setHeroAdLink(ad.link);
            }
          });
        }
      } catch (e) { console.error('Error fetching ads:', e); }

    } catch (error) {
      console.error('Critical internal error in refreshData:', error);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-close modal when user is logged in
  useEffect(() => {
    if (currentUser) {
      setIsAuthOpen(false);
    }
  }, [currentUser]);

  // Handlers
  const handleLogin = (user: AnyUser) => {
    console.log('handleLogin called with:', user.role);
    setCurrentUser(user);
    setIsAuthOpen(false);

    if (user.role === UserRole.ADMIN || (user.role as string).toUpperCase() === 'ADMIN') {
      toast.success('Hoşgeldin Yönetici');
    } else {
      toast.success(`Hoş geldin, ${user.name}!`);
    }

    // Refresh data in background without awaiting to keep UI responsive
    refreshData();
    
    // Also trigger profile fetch to ensure role is correct from DB
    fetchUserProfile(user.id);
  };

  const handleRegister = (user: AnyUser) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
    toast.success('Kayıt başarılı! Hoş geldiniz.');
    refreshData();
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

  const handleUpdateAd = async (area: 'top' | 'bottomA' | 'hero', url: string | null, link: string | null) => {
    try {
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

      const { error } = await supabase.from('ads').upsert({
        area,
        url,
        link,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      toast.success('Reklam alanı güncellendi ve kaydedildi.');
    } catch (error) {
      console.error('Error saving ad:', error);
      toast.error('Reklam güncellendi ama kaydedilemedi (Yetki Yok).');
    }
  };

  const handleAddNews = async (title: string, content: string, imageUrl?: string) => {
    try {
      if (!currentUser) {
        toast.error('Lütfen önce giriş yapın.');
        return;
      }

      const newNews = {
        title,
        content,
        image_url: imageUrl || '',
        date: new Date().toISOString().split('T')[0],
        author_id: currentUser.id,
      };

      const { data, error } = await supabase.from('news').insert([newNews]).select();
      if (error) {
        if (error.code === '42501') {
          await supabase.auth.signOut();
          setCurrentUser(null);
          toast.error('Oturum süreniz dolmuş veya geçersiz. Lütfen tekrar giriş yapın.');
          return;
        }
        throw error;
      }

      // Fotoğrafı galeriye de ekle
      if (imageUrl) {
        const galleryItem = {
          type: 'image',
          url: imageUrl,
          caption: `Haber: ${title}`,
          date: new Date().toISOString().split('T')[0]
        };
        await supabase.from('gallery').insert([galleryItem]);
      }

      toast.success('Haber başarıyla eklendi!');
      await refreshData();
    } catch (error: any) {
      console.error('Error adding news:', error);
      toast.error(`Haber eklenirken hata: ${error?.message || 'Bilinmeyen hata'}`);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      const { data, error } = await supabase.from('news').delete().eq('id', id).select();
      if (error) {
        if (error.code === '42501') {
          await supabase.auth.signOut();
          setCurrentUser(null);
          toast.error('Oturum süreniz dolmuş veya geçersiz. Lütfen tekrar giriş yapın.');
          return;
        }
        throw error;
      }
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
        date: new Date().toISOString().split('T')[0],
        start_date: startDate,
        end_date: endDate,
        author_id: currentUser.id,
      };

      const { error } = await supabase.from('events').insert([newEvent]);
      if (error) {
        if (error.code === '42501') {
          await supabase.auth.signOut();
          setCurrentUser(null);
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          return;
        }
        throw error;
      }

      if (imageUrl) {
        const galleryItem = {
          type: 'image',
          url: imageUrl,
          caption: `Etkinlik: ${title}`,
          date: new Date().toISOString().split('T')[0]
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

  const handleAddGalleryItem = async (type: 'image' | 'video', url: string, caption: string) => {
    try {
      const newItem = {
        type,
        url,
        caption,
        date: new Date().toISOString().split('T')[0]
      };
      const { error } = await supabase.from('gallery').insert([newItem]);
      if (error) throw error;
      toast.success('Medya galeriye eklendi.');
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