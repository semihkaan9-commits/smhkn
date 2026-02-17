import React from 'react';
import { CreditCard, Landmark } from 'lucide-react';

interface DonationSectionProps {
    bottomAAd?: string | null;
    bottomAAdLink?: string | null;
}

export const DonationSection: React.FC<DonationSectionProps> = ({
    bottomAAd,
    bottomAAdLink
}) => {
    return (
        <section id="donations" className="py-16 px-4 bg-stone-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center justify-center gap-2">
                        <Landmark className="text-green-600" />
                        Bağış Bilgileri
                    </h2>
                    <p className="text-stone-600">Köyümüzün ihtiyaçları ve gelişimi için desteklerinizi bekleriz.</p>
                </div>

                <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm mb-10">
                    <div className="flex items-start gap-4">
                        <div className="bg-yellow-100 p-3 rounded-full text-yellow-700 shrink-0">
                            <CreditCard size={32} />
                        </div>
                        <div className="w-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Bağış Hesabı Bilgileri</h3>
                            <div className="bg-white/60 p-3 rounded-md mb-2 font-mono text-gray-700 border border-yellow-100">
                                <p className="font-bold">Alıcı: Alata-Balcılar Yardımlaşma ve Dayanışma Derneği</p>
                                <p>IBAN: TR12 0000 0000 0000 0000 0000 00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donation Section Ad (Reusing Bottom A Slot) */}
                {bottomAAd && (
                    <div className="mt-8 flex justify-center animate-fade-in-up">
                        <div className="w-full max-w-3xl h-32 md:h-40 bg-stone-100 rounded-xl overflow-hidden shadow-sm border border-stone-200 relative group">
                            {bottomAAdLink ? (
                                <a href={bottomAAdLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                    <img src={bottomAAd} alt="Bağış Bölümü Reklamı" className="w-full h-full object-cover" />
                                </a>
                            ) : (
                                <img src={bottomAAd} alt="Bağış Bölümü Reklamı" className="w-full h-full object-cover" />
                            )}
                            <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">SPONSOR</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};