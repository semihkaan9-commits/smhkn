import React from 'react';
import { Map, Info, User } from 'lucide-react';
import { EditableText } from './EditableText';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-[#805894] mb-6 flex items-center gap-2">
              <span className="text-[#805894]">
                <Info />
              </span>
              <EditableText textKey="about.title" defaultText="Köyümüz Hakkında" />
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                <EditableText textKey="about.desc" defaultText="Balcılar, doğanın tüm renklerini barındıran, tarihi dokusu ve misafirperver halkıyla bölgenin incisi konumundadır. Tarım ve hayvancılığın modern yöntemlerle yapıldığı köyümüzde, geleneksel yaşam kültürü de yaşatılmaya devam etmektedir." />
              </p>

              <div className="bg-[#805894]/10 p-6 rounded-xl border border-[#805894]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white p-2 rounded-full shadow-sm text-[#805894]">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900"><EditableText textKey="about.muhtar_title" defaultText="Köy Muhtarı" /></h4>
                    <p className="text-gray-600"><EditableText textKey="about.muhtar_name" defaultText="Ahmet Yılmaz" /></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-full shadow-sm text-[#805894]">
                    <Map size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900"><EditableText textKey="about.location_title" defaultText="Konum" /></h4>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Balcılar+Köyü+Taşkent+Konya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#805894] hover:underline transition-colors block"
                    >
                      <EditableText textKey="about.location_name" defaultText="Taşkent/Konya" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sabit Görsel Alanı */}
          <div className="order-1 md:order-2 h-80 md:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/img_4045.jpg"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              alt="Balcılar Köyü"
            />
          </div>
        </div>
      </div>
    </section>
  );
};