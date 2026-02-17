import React, { useState } from 'react';
import { Layout, Image as ImageIcon, Upload, Link as LinkIcon, Trash2, CheckCircle2 } from 'lucide-react';

interface AdManagerProps {
  onUpdateAd: (area: 'top' | 'bottomA' | 'hero', url: string | null, link: string | null) => void;
  currentTopAd: string | null;
  currentTopAdLink: string | null;
  currentBottomAAd: string | null;
  currentBottomAAdLink: string | null;
  currentHeroAd: string | null;
  currentHeroAdLink: string | null;
}

export const AdManager: React.FC<AdManagerProps> = ({
  onUpdateAd,
  currentTopAd,
  currentTopAdLink,
  currentBottomAAd,
  currentBottomAAdLink,
  currentHeroAd,
  currentHeroAdLink
}) => {
  const [selectedArea, setSelectedArea] = useState<'top' | 'bottomA' | 'hero'>('hero');
  const [uploadMode, setUploadMode] = useState<'URL' | 'FILE'>('URL');
  const [url, setUrl] = useState('');
  const [linkInput, setLinkInput] = useState('');

  // Update link input when area changes
  React.useEffect(() => {
    if (selectedArea === 'hero') setLinkInput(currentHeroAdLink || '');
    else if (selectedArea === 'top') setLinkInput(currentTopAdLink || '');
    else if (selectedArea === 'bottomA') setLinkInput(currentBottomAAdLink || '');
  }, [selectedArea, currentHeroAdLink, currentTopAdLink, currentBottomAAdLink]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onUpdateAd(selectedArea, result, linkInput.trim() || null);
        e.target.value = ""; // Reset input
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUpdateAd(selectedArea, url.trim(), linkInput.trim() || null);
      setUrl('');
    }
  };

  const getCurrentPreviewAd = () => {
    if (selectedArea === 'hero') return currentHeroAd;
    if (selectedArea === 'top') return currentTopAd;
    return currentBottomAAd;
  };

  const getAreaLabel = () => {
    if (selectedArea === 'hero') return 'GİRİŞ ALANI (HERO)';
    if (selectedArea === 'top') return '1. ALAN (ÜST)';
    return '2. ALAN (A)';
  };

  return (
    <div className="bg-white border-b-4 border-orange-400 py-8 px-4 shadow-xl relative z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-200">
              <Layout size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Reklam Kontrol Paneli</h2>
              <p className="text-sm text-gray-500 font-medium">Sitedeki ilan alanlarını buradan anlık yönetin.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-white bg-green-500 px-3 py-1.5 rounded-full shadow-sm animate-pulse">
            <CheckCircle2 size={12} /> SİSTEM ÇALIŞIYOR
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ad Alanı Seçimi */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">1. ALAN SEÇİMİ</h3>
            <div className="flex flex-col gap-3">

              <button
                type="button"
                onClick={() => setSelectedArea('hero')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${selectedArea === 'hero' ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100 scale-[1.02]' : 'border-gray-100 bg-white hover:border-gray-300 shadow-sm'}`}
              >
                <div className="text-left">
                  <span className={`block font-black text-lg ${selectedArea === 'hero' ? 'text-orange-700' : 'text-gray-700'}`}>GİRİŞ ALANI</span>
                  <span className="text-xs text-gray-500 font-medium">Hero / Karşılama</span>
                </div>
                {selectedArea === 'hero' ? <CheckCircle2 className="text-orange-600" size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>}
              </button>

              <button
                type="button"
                onClick={() => setSelectedArea('top')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${selectedArea === 'top' ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100 scale-[1.02]' : 'border-gray-100 bg-white hover:border-gray-300 shadow-sm'}`}
              >
                <div className="text-left">
                  <span className={`block font-black text-lg ${selectedArea === 'top' ? 'text-orange-700' : 'text-gray-700'}`}>1. ALAN</span>
                  <span className="text-xs text-gray-500 font-medium">Üst (İş Arama)</span>
                </div>
                {selectedArea === 'top' ? <CheckCircle2 className="text-orange-600" size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>}
              </button>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedArea('bottomA')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${selectedArea === 'bottomA' ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100 scale-[1.02]' : 'border-gray-100 bg-white hover:border-gray-300 shadow-sm'}`}
                >
                  <div className="text-left">
                    <span className={`block font-black text-sm ${selectedArea === 'bottomA' ? 'text-orange-700' : 'text-gray-700'}`}>BAĞIŞ / ALT SOL</span>
                    <span className="text-[10px] text-gray-500 font-medium">Bağış Bölümü</span>
                  </div>
                  {selectedArea === 'bottomA' && <CheckCircle2 className="text-orange-600" size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Yükleme Formu */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">2. FOTOĞRAF VE LİNK</h3>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4 h-full shadow-inner">

              {/* Link Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">HEDEF URL (OPSİYONEL)</label>
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl px-3 focus-within:border-orange-400 transition-colors">
                  <LinkIcon size={14} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="https://örnek.com"
                    className="w-full p-2.5 text-sm outline-none font-medium bg-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2 p-1 bg-gray-200 rounded-xl">
                <button
                  onClick={() => setUploadMode('URL')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all ${uploadMode === 'URL' ? 'bg-white shadow-md text-orange-600' : 'text-gray-500'}`}
                >
                  <LinkIcon size={14} /> URL GİR
                </button>
                <button
                  onClick={() => setUploadMode('FILE')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all ${uploadMode === 'FILE' ? 'bg-white shadow-md text-orange-600' : 'text-gray-500'}`}
                >
                  <Upload size={14} /> DOSYA SEÇ
                </button>
              </div>

              {uploadMode === 'URL' ? (
                <form onSubmit={handleUrlSubmit} className="space-y-3">
                  <input
                    type="url"
                    placeholder="Görsel bağlantısını buraya yapıştırın..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-sm outline-none focus:border-orange-500 transition-all font-medium"
                    required
                  />
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-orange-100 transition-all active:scale-95 uppercase tracking-wider">
                    REKLAMI GÜNCELLE
                  </button>
                </form>
              ) : (
                <div className="relative h-32 flex items-center justify-center border-3 border-dashed border-gray-300 rounded-2xl bg-white hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer group shadow-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="text-center pointer-events-none">
                    <ImageIcon className="mx-auto text-gray-300 group-hover:text-orange-500 transition-colors mb-2" size={40} />
                    <span className="text-xs font-black text-gray-400 group-hover:text-orange-600 uppercase">DOSYA SEÇ</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => onUpdateAd(selectedArea, null, null)}
                className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200"
              >
                <Trash2 size={16} /> REKLAMI TAMAMEN KALDIR
              </button>
            </div>
          </div>

          {/* Canlı Önizleme */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">3. CANLI ÖNİZLEME</h3>
            <div className="bg-stone-900 rounded-3xl border-4 border-white overflow-hidden h-[210px] relative shadow-2xl group">
              {getCurrentPreviewAd() ? (
                <img src={getCurrentPreviewAd()!} className="w-full h-full object-cover animate-fade-in" alt="Preview" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-gray-500">
                  <ImageIcon size={48} className="mb-2 opacity-20" />
                  <span className="font-black italic text-sm uppercase">{selectedArea === 'hero' ? 'Giriş Alanı' : selectedArea + ' Alanı'} Boş</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 bg-orange-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-black uppercase text-center shadow-lg">
                Şu an: {getAreaLabel()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};