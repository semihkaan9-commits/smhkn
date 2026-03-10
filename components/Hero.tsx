import React from 'react';

interface HeroProps {
  heroAd?: string | null;
  heroAdLink?: string | null;
}

export const Hero: React.FC<HeroProps> = ({ heroAd, heroAdLink }) => {
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
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/98 via-green-950/95 to-black"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center mt-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-2xl animate-fade-in-up text-white">
          Balcılar'a Hoşgeldiniz
        </h1>
        <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto drop-shadow-lg text-green-50 animate-fade-in-up animate-delay-100">
          Doğanın kalbinde, huzurun adresinde buluşuyoruz. Köyümüzün dijital meydanına adım atın.
        </p>

        {/* Hero Ad Area - Minimized and stable */}
        <div className="relative z-50 animate-fade-in-up animate-delay-200 px-4 flex justify-center w-full mt-4">
          {heroAd ? (
            <div className="bg-white/10 backdrop-blur-sm p-1 rounded-lg border border-white/20 shadow-xl w-full max-w-[180px] overflow-hidden">
              {heroAdLink ? (
                <a href={heroAdLink} target="_blank" rel="noopener noreferrer" className="block cursor-pointer w-full">
                  <img src={heroAd} alt="Giriş Reklamı" className="w-full h-auto rounded-md" />
                </a>
              ) : (
                <img src={heroAd} alt="Giriş Reklamı" className="w-full h-auto rounded-md" />
              )}
              <div className="text-center">
                <span className="block text-[7px] text-white/50 uppercase tracking-widest mt-0.5">Sponsor</span>
              </div>
            </div>
          ) : null}
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