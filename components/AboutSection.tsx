import React from 'react';
import { Map, Info, User } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-green-900 mb-6 flex items-center gap-2">
              <span className="text-green-600">
                <Info />
              </span>
              Köyümüz Hakkında
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Balcılar, doğanın tüm renklerini barındıran, tarihi dokusu ve misafirperver halkıyla bölgenin incisi konumundadır.
                Tarım ve hayvancılığın modern yöntemlerle yapıldığı köyümüzde, geleneksel yaşam kültürü de yaşatılmaya devam etmektedir.
              </p>

              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white p-2 rounded-full shadow-sm text-green-700">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Köy Muhtarı</h4>
                    <p className="text-gray-600">Ahmet Yılmaz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-full shadow-sm text-green-700">
                    <Map size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Konum</h4>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Balcılar+Köyü+Taşkent+Konya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-700 hover:underline transition-colors block"
                    >
                      Taşkent/Konya
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sabit Görsel Alanı */}
          <div className="order-1 md:order-2 h-80 md:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://picsum.photos/id/10/1200/800"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              alt="Balcılar Köyü"
            />
          </div>
        </div>
      </div>
    </section>
  );
};