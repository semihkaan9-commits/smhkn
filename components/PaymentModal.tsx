import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Landmark, Lock, Loader2, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    donorName: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, donorName }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [iyzicoHtml, setIyzicoHtml] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            initializeIyzico();
        } else {
            document.body.style.overflow = 'unset';
            // Reset states when closed
            setIsLoading(true);
            setIyzicoHtml(null);
            setError(null);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, amount, donorName]);

    const initializeIyzico = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // TODO: IYZICO BACKEND ENTEGRASYONU BURAYA YAPILACAK
            // Supabase Edge Function veya kendi NodeJS backend'inize bir istek atacaksınız.
            // Örnek API çağrısı:
            /*
            const response = await fetch('https://your-project-id.supabase.co/functions/v1/iyzico-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, donorName })
            });
            const data = await response.json();
            if (data.checkoutFormContent) {
                setIyzicoHtml(data.checkoutFormContent);
                // Iyzico scriptini sayfa yüklendiğinde çalıştırmak için:
                const script = document.createElement('script');
                script.innerHTML = data.checkoutFormContent + "\\n iyziInit.init();";
                document.getElementById('iyzico-container')?.appendChild(script);
            }
            */

            // ŞİMDİLİK: Backend henüz entegre edilmediği için geçici (placeholder) ekran gösteriyoruz.
            setTimeout(() => {
                setError("Iyzico entegrasyonu için backend (Supabase Edge Function) gerekmektedir. Lütfen plan dokümanındaki talimatları izleyin.");
                setIsLoading(false);
            }, 1500);

        } catch (err: any) {
            console.error('Iyzico Init Error:', err);
            setError("Ödeme sistemi yüklenirken bir hata oluştu.");
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in pointer-events-auto">
            {/* Centered Popup Container */}
            <div className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[95vh]">
                
                {/* Left Side (Visuals) */}
                <div className="relative w-full md:w-[45%] lg:w-[40%] bg-[#0A0D1E] p-6 md:p-10 text-white flex flex-col justify-between overflow-hidden shrink-0 z-10">
                    {/* Abstracts Background */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#805894] rounded-full mix-blend-screen filter blur-[80px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center md:items-start w-full text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg">Güvenli Ödeme</h2>
                        <p className="text-xs md:text-sm text-white/80 max-w-sm border-b border-white/20 pb-6 leading-relaxed mx-auto md:mx-0">
                            Köyümüz için yaptığınız değerli katkılardan dolayı teşekkür ederiz. İşleminiz Iyzico güvencesiyle gerçekleşmektedir.
                        </p>

                        <div className="mt-6 w-full max-w-sm mx-auto md:mx-0">
                            <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#805894]/80 p-2.5 rounded-full text-white shadow-inner">
                                        <Landmark size={20} />
                                    </div>
                                    <p className="text-xs font-semibold text-white/90 tracking-wide uppercase">Ödenecek Tutar</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white">{amount} <span className="text-lg text-[#BBA0CC]">₺</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom visual */}
                    <div className="hidden md:flex relative z-10 mt-auto w-full max-w-[320px] p-5 text-white flex-col justify-between mx-auto items-center">
                        <div className="flex items-center gap-2 mb-2 text-white/60">
                            <ShieldCheck size={24} />
                            <span className="text-sm tracking-widest uppercase font-bold">iyzico Koruması</span>
                        </div>
                        <p className="text-xs text-center text-white/40">PCI-DSS 1. Seviye Sertifikalı Güvenli Altyapı</p>
                    </div>
                </div>

                {/* Right Column (Iyzico Area) */}
                <div className="w-full md:w-[55%] lg:w-[60%] h-[500px] md:h-auto bg-stone-50 overflow-y-auto px-4 py-8 md:p-10 flex flex-col justify-center relative items-center">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-white shadow-md hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="max-w-[420px] w-full mx-auto flex flex-col items-center justify-center min-h-[300px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center space-y-4 text-[#805894] animate-fade-in">
                                <Loader2 size={48} className="animate-spin text-[#805894]" />
                                <h3 className="text-lg font-bold text-gray-800">Güvenli Ödeme Sayfası Hazırlanıyor...</h3>
                                <p className="text-sm text-gray-500 text-center">Iyzico altyapısı ile güvenli bağlantı kuruluyor.</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center space-y-4 text-center bg-white p-6 rounded-2xl shadow-sm border border-red-100 animate-fade-in-up">
                                <div className="bg-red-50 p-4 rounded-full text-red-500 mb-2">
                                    <ShieldCheck size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Kurulum Gerekli</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {error}
                                </p>
                                <button onClick={onClose} className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                                    Kapat
                                </button>
                            </div>
                        ) : (
                            <div id="iyzico-checkout-form" className="w-full w-min-300px">
                                {/* Iyzico script content will be injected here via backend response */}
                                <div id="iyzico-container"></div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
