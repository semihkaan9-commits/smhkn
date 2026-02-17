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
  // Mock Villagers
  const INITIAL_VILLAGERS: Villager[] = [
    {
      id: 'vil-1',
      name: 'Mehmet',
      surname: 'Öztürk',
      role: UserRole.VILLAGER,
      profession: 'Elektrikçi',
      address: 'Cumhuriyet Cad. No:12',
      contact: '0532 555 11 22',
      rating: 5,
      nickname: 'Kablocu Mehmet'
    },
    {
      id: 'vil-2',
      name: 'Ayşe',
      surname: 'Yılmaz',
      role: UserRole.VILLAGER,
      profession: 'Terzi',
      address: 'Menekşe Sok. No:4',
      contact: '0544 555 33 44',
      rating: 4,
      nickname: 'Makas Ayşe'
    },
    {
      id: 'vil-3',
      name: 'Ahmet',
      surname: 'Demir',
      role: UserRole.VILLAGER,
      profession: 'Su Tesisatçısı',
      address: 'Merkez Mah. Okul Yolu No:8',
      contact: '0535 555 66 77',
      rating: 5,
      nickname: 'Muslukçu Ahmet'
    },
    {
      id: 'vil-4',
      name: 'Fatma',
      surname: 'Kaya',
      role: UserRole.VILLAGER,
      profession: 'Ev Yemekleri & Mantı',
      address: 'Çınar Altı Meydanı No:2',
      contact: '0555 555 88 99',
      rating: 5,
      nickname: 'Hamarat Abla'
    },
    {
      id: 'vil-5',
      name: 'Mustafa',
      surname: 'Çelik',
      role: UserRole.VILLAGER,
      profession: 'Demir Doğrama & Kaynak',
      address: 'Sanayi Girişi No:1',
      contact: '0533 555 00 11',
      rating: 4,
      nickname: 'Demirci'
    },
    {
      id: 'vil-6',
      name: 'Ali',
      surname: 'Vural',
      role: UserRole.VILLAGER,
      profession: 'Traktör & Tarım Aletleri Tamiri',
      address: 'Ova Yolu Üzeri',
      contact: '0542 555 22 33',
      rating: 5,
      nickname: 'Usta Ali'
    },
    {
      id: 'vil-7',
      name: 'Zeynep',
      surname: 'Arslan',
      role: UserRole.VILLAGER,
      profession: 'Süt ve Süt Ürünleri',
      address: 'Yaylak Mevkii No:15',
      contact: '0536 555 44 55',
      rating: 5,
    },
    {
      id: 'vil-8',
      name: 'Hüseyin',
      surname: 'Polat',
      role: UserRole.VILLAGER,
      profession: 'İnşaat Ustası',
      address: 'Tepe Mah. Cami Yanı',
      contact: '0537 555 66 88',
      rating: 3,
      nickname: 'Kalfa'
    },
    {
      id: 'vil-9',
      name: 'Emine',
      surname: 'Koç',
      role: UserRole.VILLAGER,
      profession: 'Yufka & Bazlama',
      address: 'Dere Kenarı No:7',
      contact: '0541 555 99 00',
      rating: 5,
    },
    {
      id: 'vil-10',
      name: 'İbrahim',
      surname: 'Acar',
      role: UserRole.VILLAGER,
      profession: 'Nakliye & Taşımacılık',
      address: 'Giriş Yolu No:5',
      contact: '0539 555 11 33',
      rating: 4,
      nickname: 'Kamyoncu İbo'
    }
  ];

  const [currentUser, setCurrentUser] = useState<AnyUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [villagers, setVillagers] = useState<Villager[]>(INITIAL_VILLAGERS);
  const [guests, setGuests] = useState<AnyUser[]>([]); // Not really used for Guests list but keeping for type compatibility if needed

  // Dummy Data for Initial State / Fallback
  const INITIAL_NEWS: NewsItem[] = [
    {
      id: 'mock-1',
      title: 'Köy Kahvesi Yenilendi',
      content: 'Köyümüzün emektar kahvesi, muhtarlığımızın öncülüğünde yeni yüzüne kavuştu. Tüm köylülerimizi çayımızı içmeye bekleriz.',
      date: new Date().toLocaleDateString('tr-TR'),
      author: 'Muhtar Ahmet Yılmaz',
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'mock-2',
      title: 'Yeni Sulama Kanalı Projesi',
      content: 'Tarımsal verimliliği artırmak amacıyla DSİ ile ortaklaşa yürütülen sulama kanalı projesi onaylandı. İnşaat önümüzdeki ay başlıyor.',
      date: new Date().toLocaleDateString('tr-TR'),
      author: 'Köy Meclisi',
      imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'mock-3',
      title: 'Geleneksel Hasat Şenliği',
      content: 'Bu yıl bolluk ve bereket içinde geçen hasat dönemimizi kutlamak için köy meydanında toplanıyoruz. Tüm halkımız davetlidir.',
      date: new Date().toLocaleDateString('tr-TR'),
      author: 'Tertip Komitesi',
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-58f26c0dc835?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'mock-4',
      title: 'Köy Okulu Boyandı',
      content: 'Gönüllü gençlerimizin desteğiyle köy okulumuzun dış cephesi ve sınıfları boyandı. Emeği geçen herkese teşekkürler.',
      date: new Date().toLocaleDateString('tr-TR'),
      author: 'Okul Aile Birliği',
      imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'mock-5',
      title: 'Sağlık Ocağı Doktorumuz Göreve Başladı',
      content: 'Haftanın 3 günü köyümüzde hizmet verecek olan Doktor Ayşe Kaya görevine başlamıştır. Hayırlı olsun.',
      date: new Date().toLocaleDateString('tr-TR'),
      author: 'Muhtar Ahmet Yılmaz',
      imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  const INITIAL_EVENTS: EventItem[] = [
    {
      id: 'mock-event-1',
      title: 'Bahar Şenliği',
      content: 'Baharın gelişini kutlamak için düzenlediğimiz şenlikte yarışmalar, konserler ve yemek ikramı olacaktır.',
      date: new Date().toLocaleDateString('tr-TR'),
      startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 5 + 7200000).toISOString(),
      author: 'Köy Gençliği',
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop' // Fixed URL
    },
    {
      id: 'mock-event-2',
      title: 'Köy Hayırı',
      content: 'Geleneksel köy hayırımız Cuma namazı çıkışında cami avlusunda yapılacaktır.',
      date: new Date().toLocaleDateString('tr-TR'),
      startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 10 + 10800000).toISOString(),
      author: 'Muhtarlık',
      imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'mock-event-3',
      title: 'Futbol Turnuvası',
      content: 'Köyler arası futbol turnuvası başlıyor! Takımını kur, turnuvaya katıl.',
      date: new Date().toLocaleDateString('tr-TR'),
      startDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 15 + 7200000).toISOString(),
      author: 'Spor Kulübü',
      imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop' // Fixed URL
    },
    {
      id: 'mock-event-4',
      title: 'Sağlık Taraması',
      content: 'İlçe Sağlık Müdürlüğü ekipleri tarafından köy meydanında ücretsiz sağlık taraması yapılacaktır.',
      date: new Date().toLocaleDateString('tr-TR'),
      startDate: new Date(Date.now() + 86400000 * 20).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 20 + 14400000).toISOString(),
      author: 'Sağlık Ocağı',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'mock-event-5',
      title: 'Açık Hava Sineması',
      content: 'Yaz akşamlarının vazgeçilmezi açık hava sineması etkinliğimizde "Selvi Boylum Al Yazmalım" filmi gösterilecektir.',
      date: new Date().toLocaleDateString('tr-TR'),
      startDate: new Date(Date.now() + 86400000 * 25).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 25 + 10800000).toISOString(),
      author: 'Kültür Komitesi',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  // Combine Images for Initial Gallery
  const INITIAL_GALLERY: GalleryItem[] = [
    ...INITIAL_NEWS.filter(n => n.imageUrl).map(n => ({
      id: `gal-${n.id}`,
      type: 'image' as const,
      url: n.imageUrl!,
      caption: n.title,
      date: n.date
    })),
    ...INITIAL_EVENTS.filter(e => e.imageUrl).map(e => ({
      id: `gal-${e.id}`,
      type: 'image' as const,
      url: e.imageUrl!,
      caption: e.title,
      date: e.date
    }))
  ];

  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [donations, setDonations] = useState<Donation[]>([]);

  // Reklam Durumları - 3 Bağımsız Alan + Hero (Area 2B Removed)
  const [area1Ad, setArea1Ad] = useState<string | null>(null); // Üst Alan
  const [area1AdLink, setArea1AdLink] = useState<string | null>(null);

  const [area2AAd, setArea2AAd] = useState<string | null>(null); // Alt Alan A (Donation)
  const [area2AAdLink, setArea2AAdLink] = useState<string | null>(null);

  const [heroAd, setHeroAd] = useState<string | null>(null); // Giriş Alanı
  const [heroAdLink, setHeroAdLink] = useState<string | null>(null);

  // View State
  const [currentView, setCurrentView] = useState<'home' | 'all-news' | 'all-events' | 'all-gallery'>('home');



  // Helper to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    // ... (fetchUserProfile logic remains the same)
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
      // If we are connected and fetching data, we should update the state even if it's empty
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
        // Map database columns to frontend interface
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

    // Check both enum and string "admin" for robustness
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
      // Force reload to clear all state and ensure clean logout
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
        image_url: imageUrl, // Database expects snake_case
        date: new Date().toLocaleDateString('tr-TR'),
        author_id: currentUser.id, // Database expects ID
        // author field is optional/legacy in DB if it exists, but we rely on joins now
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
      // Check for mock data
      if (id.startsWith('mock-') || id.length < 20) {
        setNews(prev => prev.filter(item => item.id !== id));
        toast.success('Haber silindi (Demo).');
        return;
      }

      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      toast.success('Haber silindi.');
      await refreshData();
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
      // Check for mock events
      if (id.startsWith('mock-') || id.length < 20) {
        setEvents(prev => prev.filter(item => item.id !== id));

        // Also remove associated gallery mock items if possible (best effort local)
        if (title) {
          setGalleryItems(prev => prev.filter(g => !g.caption.includes(title)));
        }

        toast.success('Etkinlik silindi (Demo).');
        return;
      }

      // 1. Delete the Event
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;

      // 2. Best-effort: Delete associated Gallery item (if it exists)
      if (title) {
        const galleryTitle = `Etkinlik: ${title}`;
        await supabase.from('gallery').delete().eq('title', galleryTitle).eq('category', 'Etkinlik');
      }

      toast.success('Etkinlik ve ilişkili dosyalar silindi.');
      await refreshData();
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
      if (id.startsWith('gal-') || id.startsWith('mock-') || id.length < 20) {
        setGalleryItems(prev => prev.filter(item => item.id !== id));
        toast.success('Fotoğraf silindi (Demo).');
        return;
      }

      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      toast.success('Fotoğraf silindi.');
      await refreshData();
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      toast.error(`Silme işlemi başarısız: ${error.message || 'Bilinmeyen hata'}`);
    }
  };

  const handleRateVillager = async (villagerId: string, rating: number) => {
    toast.success('Oylama işlemi kaydedildi (Demo).');
  };

  const handleDeleteVillager = async (id: string) => {
    try {
      if (id.startsWith('vil-') || id.length < 20) {
        setVillagers(prev => prev.filter(v => v.id !== id));
        toast.success('Kişi silindi (Demo).');
        return;
      }

      const { error } = await supabase.from('villagers').delete().eq('id', id);
      if (error) throw error;
      toast.success('Kişi listeden silindi.');
      await refreshData();
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
      // Optimistic update
      setNews(prev => prev.map(n => n.id === id ? { ...n, title, content, date } : n));

      if (id.startsWith('mock-')) {
        toast.success('Haber güncellendi (Demo Veri)');
        return;
      }

      const { error } = await supabase.from('news').update({
        title,
        content,
        date
      }).eq('id', id);

      if (error) throw error;
      toast.success('Haber başarıyla güncellendi.');
      await refreshData();
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Haber güncellenemedi.');
      await refreshData();
    }
  };

  const handleUpdateEvent = async (id: string, title: string, content: string, startDate?: string, endDate?: string) => {
    try {
      // Optimistic update
      setEvents(prev => prev.map(e => e.id === id ? { ...e, title, content, startDate, endDate } : e));

      if (id.startsWith('mock-')) {
        toast.success('Etkinlik güncellendi (Demo Veri)');
        return;
      }

      const { error } = await supabase.from('events').update({
        title,
        content,
        start_date: startDate,
        end_date: endDate
      }).eq('id', id);

      if (error) throw error;
      toast.success('Etkinlik başarıyla güncellendi.');
      await refreshData();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Etkinlik güncellenemedi.');
      await refreshData();
    }
  };

  const handleUpdateVillager = async (updatedVillager: Villager) => {
    try {
      // 1. Update list locally immediately (optimistic UI)
      setVillagers(prev => prev.map(v => v.id === updatedVillager.id ? updatedVillager : v));

      // 2. Try to update in Supabase if it's a real record (has UUID) and NOT a mock id
      if (updatedVillager.id.includes('-')) {
        // It's likely a mock ID if it's simple like "vil-1", but real UUIDs also have dashes.
        // However, our mocks specifically use "vil-" prefix.
        if (updatedVillager.id.startsWith('vil-')) {
          toast.success('Kişi güncellendi (Demo Veri)');
          return;
        }
      }

      // Real update
      const { error } = await supabase.from('villagers').update({
        name: updatedVillager.name,
        surname: updatedVillager.surname,
        nickname: updatedVillager.nickname,
        profession: updatedVillager.profession,
        address: updatedVillager.address,
        contact: updatedVillager.contact
      }).eq('id', updatedVillager.id);

      if (error) throw error;

      toast.success('Kişi başarıyla güncellendi.');
      await refreshData();

    } catch (error) {
      console.error('Error updating villager:', error);
      toast.error('Güncelleme sırasında hata oluştu.');
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

      {/* Admin Reklam Paneli - Only show on Home for simplicity or keep global depending on preference */}
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

            {/* Üst Reklam Alanı 1 */}
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

            {/* Alt Reklam Alanları (A) */}
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