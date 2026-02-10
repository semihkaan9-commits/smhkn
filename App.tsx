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
import { AdManager } from './components/AdManager';
import { AnyUser, NewsItem, UserRole, Villager, GalleryItem, Donation } from './types';
import { supabase } from './lib/supabase';

import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  // State
  const [currentUser, setCurrentUser] = useState<AnyUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [guests, setGuests] = useState<AnyUser[]>([]); // Not really used for Guests list but keeping for type compatibility if needed
  const [news, setNews] = useState<NewsItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  // Reklam Durumları - 3 Bağımsız Alan
  const [area1Ad, setArea1Ad] = useState<string | null>(null); // Üst Alan
  const [area2AAd, setArea2AAd] = useState<string | null>(null); // Alt Alan A
  const [area2BAd, setArea2BAd] = useState<string | null>(null); // Alt Alan B

  // Helper to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;

      let userData: AnyUser = {
        id: profile.id,
        name: profile.full_name?.split(' ')[0] || '',
        surname: profile.full_name?.split(' ').slice(1).join(' ') || '',
        role: profile.role as UserRole,
        email: undefined // Supabase user object has email, profile doesn't usually store it redundant
      };

      if (profile.role === UserRole.VILLAGER) {
        const { data: villagerData } = await supabase.from('villagers').select('*').eq('user_id', userId).single();
        if (villagerData) {
          userData = { ...userData, ...villagerData, id: userId, role: UserRole.VILLAGER };
        }
      }

      // Admin override check if needed, but role from profile is source of truth
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Auth Subscription
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchUserProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data Fetching
  const refreshData = async () => {
    const { data: v } = await supabase.from('villagers').select('*');
    if (v) setVillagers(v as Villager[]);

    const { data: n } = await supabase.from('news').select('*').order('date', { ascending: false });
    if (n) {
      setNews(n.map((item: any) => ({
        ...item,
        imageUrl: item.image_url, // Map snake_case to camelCase
        author: item.author_id ? 'Admin' : 'Anonim' // Temporary fix until we join profiles
      })) as NewsItem[]);
    }

    const { data: g } = await supabase.from('gallery').select('*').order('date', { ascending: false });
    if (g) setGalleryItems(g as unknown as GalleryItem[]);

    const { data: d } = await supabase.from('donations').select('*').order('date', { ascending: false });
    if (d) {
      setDonations(d.map((item: any) => ({
        ...item,
        donorName: item.donor_name || 'Anonim' // Map snake_case to camelCase and handle defaults
      })) as Donation[]);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);


  // Handlers
  const handleLogin = (user: AnyUser) => {
    // This is now purely for UI feedback if needed, but AuthModal handles the actual login
    // and onAuthStateChange handles the state update.
    // We can keep it to show the toast or let AuthModal do it.
    // AuthModal already shows toast.
  };

  const handleRegister = (user: AnyUser) => {
    // Handled by AuthModal and Supabase Auth
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Çıkış yapıldı.");
  };

  const handleUpdateAd = (area: 'top' | 'bottomA' | 'bottomB', url: string | null) => {
    if (area === 'top') {
      setArea1Ad(url);
    } else if (area === 'bottomA') {
      setArea2AAd(url);
    } else if (area === 'bottomB') {
      setArea2BAd(url);
    }
  };

  const handleAddNews = async (title: string, content: string, imageUrl?: string) => {
    const { error } = await supabase.from('news').insert({
      title,
      content,
      image_url: imageUrl,
      author_id: currentUser?.id
    });

    if (error) {
      toast.error('Haber eklenirken hata oluştu.');
      console.error(error);
    } else {
      // If there is an image, add it to the gallery as well
      if (imageUrl) {
        const { error: galleryError } = await supabase.from('gallery').insert({
          type: 'image',
          url: imageUrl,
          caption: title // Use news title as caption
        });

        if (galleryError) {
          console.error('Error adding news image to gallery:', galleryError);
          // Optional: toast warning that gallery sync failed, but news succeeded
        }
      }

      toast.success('Haber eklendi.');
      refreshData();
    }
  };

  const handleDeleteNews = async (id: string) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      toast.error('Haber silinirken hata oluştu.');
    } else {
      toast.success('Haber silindi.');
      refreshData();
    }
  };

  const handleAddGalleryItem = async (type: 'image' | 'video', url: string, caption: string) => {
    const { error } = await supabase.from('gallery').insert({
      type,
      url,
      caption
    });
    if (error) {
      toast.error('Galeri öğesi eklenirken hata oluştu.');
    } else {
      toast.success('Galeri öğesi eklendi.');
      refreshData();
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      toast.error('Silinirken hata oluştu.');
    } else {
      refreshData();
    }
  };

  const handleRateVillager = async (id: string, newRating: number) => {
    const { error } = await supabase.from('villagers').update({ rating: newRating }).eq('id', id);
    if (!error) refreshData();
  };

  const handleAddDonation = async (donorName: string, amount: number) => {
    const { error } = await supabase.from('donations').insert({
      donor_name: donorName,
      amount
    });
    if (error) toast.error('Bağış eklenirken hata oluştu.');
    else {
      toast.success('Bağış eklendi!');
      refreshData();
    }
  };

  const handleDeleteDonation = async (id: string) => {
    const { error } = await supabase.from('donations').delete().eq('id', id);
    if (!error) refreshData();
  };

  const handleDeleteVillager = async (id: string) => {
    const { error } = await supabase.from('villagers').delete().eq('id', id);
    if (error) toast.error('Silinirken hata oluştu.');
    else {
      toast.success('Köy sakini silindi.');
      refreshData();
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        scrollToSection={scrollToSection}
      />

      {/* Admin Reklam Paneli */}
      {currentUser?.role === UserRole.ADMIN && (
        <AdManager
          onUpdateAd={handleUpdateAd}
          currentTopAd={area1Ad}
          currentBottomAAd={area2AAd}
          currentBottomBAd={area2BAd}
        />
      )}

      <main className="flex-grow">
        <Hero />

        {/* Üst Reklam Alanı 1 */}
        <WorkerSearch
          villagers={villagers}
          onRateVillager={handleRateVillager}
          topAd={area1Ad}
          currentUser={currentUser}
          onDeleteVillager={handleDeleteVillager}
        />

        <NewsSection
          news={news}
          currentUser={currentUser}
          onAddNews={handleAddNews}
          onDeleteNews={handleDeleteNews}
        />

        <GallerySection
          items={galleryItems}
          currentUser={currentUser}
          onAddItem={handleAddGalleryItem}
          onDeleteItem={handleDeleteGalleryItem}
        />

        {/* Alt Reklam Alanları (A ve B) */}
        <DonationSection
          donations={donations}
          currentUser={currentUser}
          onAddDonation={handleAddDonation}
          onDeleteDonation={handleDeleteDonation}
          bottomAAd={area2AAd}
          bottomBAd={area2BAd}
        />

        <AboutSection />
      </main>

      <Footer />

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