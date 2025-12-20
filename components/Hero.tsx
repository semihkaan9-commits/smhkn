import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div id="hero" className="relative h-[65vh] flex items-center justify-center text-white overflow-hidden bg-green-800">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          {/* Gradient Overlay: Dark green top to Transparent/White bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-700/80 to-stone-50"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl animate-fade-in-up text-white">
          Yeşilvadi'ye Hoşgeldiniz
        </h1>
        <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto drop-shadow-lg text-green-50 animate-fade-in-up animate-delay-100">
          Doğanın kalbinde, huzurun adresinde buluşuyoruz. Köyümüzün dijital meydanına adım atın.
        </p>
      </div>

      {/* Decorative Curve Blending into White */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
         <svg className="relative block w-full h-[100px] text-stone-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
           <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,101.3C960,96,1056,128,1152,154.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};