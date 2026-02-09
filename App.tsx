import React, { useState } from 'react';
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
import { INITIAL_NEWS, INITIAL_VILLAGERS, INITIAL_GALLERY, INITIAL_DONATIONS } from './constants';

import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  // State
  const [currentUser, setCurrentUser] = useState<AnyUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [villagers, setVillagers] = useState<Villager[]>(INITIAL_VILLAGERS);
  const [guests, setGuests] = useState<AnyUser[]>([]);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);

  // Reklam Durumları - 3 Bağımsız Alan
  const [area1Ad, setArea1Ad] = useState<string | null>(null); // Üst Alan
  const [area2AAd, setArea2AAd] = useState<string | null>(null); // Alt Alan A
  const [area2BAd, setArea2BAd] = useState<string | null>(null); // Alt Alan B

  // Handlers
  const handleLogin = (user: AnyUser) => {
    setCurrentUser(user);
    toast.success(`Hoşgeldin ${user.name}!`);
  };

  const handleRegister = (user: AnyUser) => {
    setCurrentUser(user);
    if (user.role === UserRole.VILLAGER) {
      setVillagers(prev => [...prev, user as Villager]);
      toast.success("Kayıt başarılı! Köy rehberine eklendiniz.");
    } else {
      setGuests(prev => [...prev, user]);
      toast.success("Misafir kaydı başarılı! Hoşgeldiniz.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
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

  const handleAddNews = (title: string, content: string, imageUrl?: string) => {
    const dateStr = new Date().toLocaleDateString('tr-TR');
    const newsId = Date.now().toString(); // Consistent ID
    const newNewsItem: NewsItem = {
      id: newsId,
      title,
      content,
      date: dateStr,
      author: currentUser?.name || 'Yönetici',
      imageUrl
    };
    setNews(prev => [newNewsItem, ...prev]);

    if (imageUrl) {
      const newGalleryItem: GalleryItem = {
        id: `news-${newsId}`, // Deterministic ID linked to news
        type: 'image',
        url: imageUrl,
        caption: title,
        date: dateStr
      };
      setGalleryItems(prev => [newGalleryItem, ...prev]);
    }
  };

  const handleDeleteNews = (id: string) => {
    setNews(prev => prev.filter(item => item.id !== id));
    // Also delete from gallery if it exists (using the deterministic ID)
    setGalleryItems(prev => prev.filter(item => item.id !== `news-${id}`));
  };

  const handleAddGalleryItem = (type: 'image' | 'video', url: string, caption: string) => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      type,
      url,
      caption,
      date: new Date().toLocaleDateString('tr-TR')
    };
    setGalleryItems(prev => [newItem, ...prev]);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRateVillager = (id: string, newRating: number) => {
    setVillagers(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, rating: newRating };
      }
      return v;
    }));
  };

  const handleAddDonation = (donorName: string, amount: number) => {
    const newDonation: Donation = {
      id: Date.now().toString(),
      donorName,
      amount,
      date: new Date().toLocaleDateString('tr-TR')
    };
    setDonations(prev => [newDonation, ...prev]);
  };

  const handleDeleteDonation = (id: string) => {
    setDonations(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteVillager = (id: string) => {
    setVillagers(prev => prev.filter(v => v.id !== id));
    toast.success("Köy sakini başarıyla silindi.");
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