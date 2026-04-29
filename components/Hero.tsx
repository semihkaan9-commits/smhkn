import React from 'react';
import { EditableText } from './EditableText';

interface AdData { url: string; link: string | null; }

interface HeroProps {
  adsMap?: Record<string, AdData>;
}

export const Hero: React.FC<HeroProps> = ({ adsMap = {} }) => {
  const heroAds = [1, 2, 3, 4, 5].map(n => adsMap[`hero${n}`]).filter(Boolean);
  // Duplicate for smooth marquee effect
  const displayAds = heroAds.length > 0 ? [...heroAds, ...heroAds, ...heroAds, ...heroAds] : [];

  return (
    <div id="hero" className="relative min-h-[65vh] flex flex-col items-center justify-center text-white overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="/img_8255.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#805894]/95 via-[#805894]/90 to-black/90"></div>
      </div>

      <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center pt-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-2xl animate-fade-in-up text-white">
          <EditableText textKey="hero.title" defaultText="Balcılar'a Hoşgeldiniz" />
        </h1>
        <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto drop-shadow-lg text-white animate-fade-in-up animate-delay-100">
          <EditableText textKey="hero.subtitle" defaultText="Doğanın kalbinde, huzurun adresinde buluşuyoruz. Köyümüzün dijital meydanına adım atın." />
        </p>

        {/* Hero Ad Area - Responsive sizing: wider on mobile, small on desktop */}
        <div className="relative z-50 animate-fade-in-up animate-delay-200 px-4 w-full flex justify-center overflow-hidden max-w-[100vw]">
          {heroAds.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-lg border border-white/20 shadow-xl overflow-hidden group w-full max-w-[1020px]">
              <div className="flex animate-marquee gap-3">
                {displayAds.map((ad, idx) => (
                  <div key={idx} className="shrink-0 w-[240px]">
                    {ad.link ? (
                      <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block cursor-pointer w-full">
                        {ad.url && ad.url.trim() !== '' ? (
                          <img src={ad.url} alt={`Giriş Reklamı`} className="w-full h-[160px] sm:h-[180px] rounded-md object-contain bg-black/20" />
                        ) : (
                          <div className="w-full h-[160px] sm:h-[180px] rounded-md bg-white/5 border border-white/10 flex items-center justify-center p-2">
                             <span className="text-white/50 text-[10px] sm:text-xs text-center font-bold uppercase tracking-wider">Reklam Vermek İçin İletişime Geçin</span>
                          </div>
                        )}
                      </a>
                    ) : (
                      <>
                        {ad.url && ad.url.trim() !== '' ? (
                          <img src={ad.url} alt={`Giriş Reklamı`} className="w-full h-[160px] sm:h-[180px] rounded-md object-contain bg-black/20" />
                        ) : (
                          <div className="w-full h-[160px] sm:h-[180px] rounded-md bg-white/5 border border-white/10 flex items-center justify-center p-2 cursor-pointer">
                             <span className="text-white/50 text-[10px] sm:text-xs text-center font-bold uppercase tracking-wider">Reklam Vermek İçin İletişime Geçin</span>
                          </div>
                        )}
                      </>
                    )}
                    <span className="block text-[8px] text-white/60 mt-0.5 uppercase tracking-widest text-center">Sponsorlu Bağlantı</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Curve Blending into White */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[60px] text-stone-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,101.3C960,96,1056,128,1152,154.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};