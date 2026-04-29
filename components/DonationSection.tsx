import React, { useState } from 'react';
import { Landmark, ArrowRight, Building, Copy, Plus, Minus } from 'lucide-react';
import { EditableText } from './EditableText';
import { toast } from 'react-hot-toast';
import { PaymentModal } from './PaymentModal';

interface AdData { url: string; link: string | null; }

interface DonationSectionProps {
    adsMap?: Record<string, AdData>;
}

const DonationForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('');
    const [otherType, setOtherType] = useState('');
    const [amount, setAmount] = useState(500);
    const [showModal, setShowModal] = useState(false);

    const isFormValid = name.trim().length > 0 && phone.trim().length >= 10 && (type === 'diger' ? otherType.trim().length > 0 : type.length > 0) && amount > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            setShowModal(true);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            setAmount(val);
        } else {
            setAmount(0);
        }
    };

    const increaseAmount = () => setAmount(prev => prev + 500);
    const decreaseAmount = () => setAmount(prev => Math.max(0, prev - 500));

    return (
        <div className="relative w-full max-w-md mx-auto pt-8 pb-4">
            {/* Form Container Container */}
            <div className="bg-white rounded-3xl py-8 px-6 sm:px-8 shadow-2xl relative z-0 border border-gray-100">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-[#805894]">Kredi Kartı ile Hızlı Kurum Bağışı</h3>
                    <p className="text-xs text-gray-400 mt-1">Lütfen bağışcı bilgilerinizi doldurun</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Ad Soyad</label>
                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#805894] outline-none transition-all placeholder:text-gray-400" placeholder="Örn: Ali Yılmaz" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Telefon Numarası</label>
                        <input required type="tel" maxLength={11} value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#805894] outline-none transition-all placeholder:text-gray-400" placeholder="05XXXXXXXXX" />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Bağış Türü</label>
                        <select required value={type} onChange={e => setType(e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-3 focus:ring-2 focus:ring-[#805894] outline-none transition-all cursor-pointer">
                            <option value="">Seçiniz</option>
                            <option value="genel">Genel Bağış</option>
                            <option value="zekat">Zekat</option>
                            <option value="sadaka">Sadaka</option>
                            <option value="fitre">Fitre</option>
                            <option value="diger">Diğer (Lütfen Belirtin)</option>
                        </select>
                    </div>

                    {type === 'diger' && (
                        <div className="space-y-1.5 animate-fade-in">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Bağış Amacı Detayı</label>
                            <input required type="text" value={otherType} onChange={e => setOtherType(e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#805894] outline-none transition-all placeholder:text-gray-400" placeholder="Örn: Cami Yapımı, Erzak vb." />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Miktar (₺)</label>
                        <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#805894] transition-all bg-gray-50/50">
                            <button type="button" onClick={decreaseAmount} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors border-r border-gray-200 flex items-center justify-center">
                                <Minus size={16} />
                            </button>
                            <input 
                                required 
                                type="number" 
                                min="1" 
                                value={amount || ''}
                                onChange={handleAmountChange}
                                className="flex-1 w-full bg-transparent text-center text-gray-900 text-lg font-bold py-3 px-2 outline-none" 
                            />
                            <button type="button" onClick={increaseAmount} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors border-l border-gray-200 flex items-center justify-center">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {isFormValid && (
                        <button type="submit" className="w-full mt-6 bg-gradient-to-r from-[#805894] to-[#604270] hover:from-[#6b477c] hover:to-[#4e355b] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(128,88,148,0.5)] transition-all active:scale-[0.98] flex justify-center items-center gap-2 text-[13px] uppercase tracking-widest animate-fade-in group">
                            <span>Ödeme Yap</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </form>
            </div>

            <PaymentModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                amount={amount}
                donorName={name}
            />
        </div>
    );
};

export const DonationSection: React.FC<DonationSectionProps> = ({
    adsMap = {}
}) => {
    const bottomAds = [1, 2, 3].map(n => adsMap[`bottomA${n}`]).filter(Boolean);

    const handleCopy = (e: React.MouseEvent) => {
        const text = e.currentTarget.parentElement?.querySelector('p')?.innerText || "TR12 0000 0000 0000 0000 0000 00";
        navigator.clipboard.writeText(text);
        toast.success("IBAN Kopyalandı!");
    };
    
    return (
        <section id="donations" className="py-20 px-4 bg-stone-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-[400px] bg-gradient-to-b from-[#805894]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#805894] mb-4 flex items-center justify-center gap-3">
                        <Landmark size={36} className="text-[#805894]" />
                        <EditableText textKey="donations.title" defaultText="Köyümüze Destek Olun" />
                    </h2>
                    <p className="text-stone-500 text-lg max-w-2xl mx-auto">
                        <EditableText textKey="donations.desc" defaultText="Köyümüzün ihtiyaçları, gelişimi ve yardımlaşma faaliyetleri için desteklerinizi güvenle iletebilirsiniz." />
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 max-w-6xl mx-auto mb-16 items-center">
                    
                    {/* Left Column: IBAN Info */}
                    <div className="lg:col-span-2 space-y-6 self-center">
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#805894]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                            
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-yellow-200/50">
                                <Building size={28} className="text-yellow-600" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                <EditableText textKey="donations.box_title" defaultText="EFT / Havale ile Bağış" />
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Banka hesabımıza doğrudan transfer yaparak derneğimize katkıda bulunabilirsiniz. Lütfen açıklama kısmına adınızı soyadınızı yazın.
                            </p>
                            
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Alıcı Ünvanı</p>
                                <p className="text-sm font-semibold text-gray-800 mb-4 leading-snug">
                                    <EditableText textKey="donations.recipient" defaultText="Alata-Balcılar Yardımlaşma ve Dayanışma Derneği" />
                                </p>
                                
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">IBAN Numarası</p>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-[13px] sm:text-sm font-mono font-bold text-[#805894] break-all">
                                        <EditableText textKey="donations.iban" defaultText="TR12 0000 0000 0000 0000 0000 00" />
                                    </p>
                                    <button 
                                        className="p-2 text-gray-400 hover:text-[#805894] hover:bg-[#805894]/10 rounded-lg transition-colors cursor-pointer shrink-0"
                                        title="Kopyala"
                                        onClick={handleCopy}
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Donation Form */}
                    <div className="lg:col-span-3 w-full animate-fade-in-up">
                        <DonationForm />
                    </div>

                </div>

                {/* Donation Section Ad (Static Grid) */}
                {bottomAds.length > 0 && (
                    <div className="mt-16 flex justify-center animate-fade-in-up w-full">
                        <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                            {bottomAds.map((ad, idx) => (
                                <div key={idx} className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-4 border-white bg-gray-100 group">
                                    {ad.link ? (
                                        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block cursor-pointer w-full h-[220px] md:h-[260px]">
                                            <img src={ad.url} alt={`Sponsor Reklam ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </a>
                                    ) : (
                                        <div className="block w-full h-[220px] md:h-[260px]">
                                            <img src={ad.url} alt={`Sponsor Reklam ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    )}
                                    <span className="absolute top-3 right-3 bg-black/80 text-white text-[10px] px-3 py-1.5 font-bold tracking-widest rounded-full backdrop-blur-md shadow-lg border border-white/10 uppercase">Sponsor</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};