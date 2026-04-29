import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Landmark, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    donorName: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, donorName }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState(donorName);
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Ödemeniz başarıyla gerçekleştirildi. Allah kabul etsin!");
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in pointer-events-auto">
            {/* Centered Popup Container */}
            <div className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[95vh]">
                
                {/* Form Container Container (Right Side conceptually, we put form first so it can be handled, but visually form is on the right) */}
                <div className="relative w-full md:w-[45%] lg:w-[40%] bg-[#0A0D1E] p-6 md:p-10 text-white flex flex-col justify-between overflow-hidden shrink-0 z-10">
                    {/* Abstracts Background */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#805894] rounded-full mix-blend-screen filter blur-[80px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center md:items-start w-full text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg">Güvenli Ödeme</h2>
                        <p className="text-xs md:text-sm text-white/80 max-w-sm border-b border-white/20 pb-6 leading-relaxed mx-auto md:mx-0">
                            Köyümüz için yaptığınız değerli katkılardan dolayı teşekkür ederiz.
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

                    {/* Bottom visual - Elegant modern Card Layout */}
                    <div className="hidden md:flex relative z-10 mt-auto w-full max-w-[320px] h-[190px] bg-gradient-to-br from-[#1b1c31] to-[#0A0D1E] rounded-2xl p-5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex-col justify-between border border-white/10 group mx-auto">
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="w-10 h-7 bg-white/10 rounded shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <div className="w-3 h-3 rounded-full bg-white/40 shadow-inner"></div>
                            </div>
                            <div className="text-xl font-black italic tracking-widest text-[#BBA0CC] drop-shadow-md">VISA</div>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <div className="text-lg tracking-[0.15em] font-mono text-white mb-4 font-medium">
                                {cardNumber.length > 0 ? cardNumber : '#### #### #### ####'}
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-[8px] uppercase tracking-widest text-gray-400 mb-1">Kart Sahibi</div>
                                    <div className="font-bold tracking-widest text-[10px] uppercase drop-shadow-lg text-white">
                                        {cardName || 'AD SOYAD'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] uppercase tracking-widest text-gray-400 mb-1">Tarih</div>
                                    <div className="font-bold tracking-widest text-[10px] drop-shadow-lg text-white">
                                        {(expiryMonth || 'MM')}/{(expiryYear || 'YY')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Payment Form) */}
                <div className="w-full md:w-[55%] lg:w-[60%] h-full bg-white overflow-y-auto px-6 py-8 md:p-10 flex flex-col justify-center relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="max-w-[420px] w-full mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-[#805894]/10 p-2.5 rounded-xl text-[#805894]">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-900">Kart Bilgileri</h3>
                                <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                                    <Lock size={10} /> 256-bit SSL Güvenlikli Ödeme
                                </p>
                            </div>
                        </div>
                    
                        <form onSubmit={handlePayment} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Kartın Üstündeki İsim</label>
                                <input 
                                    required 
                                    type="text" 
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="w-full bg-stone-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#805894] focus:border-transparent outline-none transition-all uppercase placeholder-gray-400" 
                                    placeholder="Örn: Ali Yılmaz"
                                />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Kart Numarası</label>
                                <input 
                                    required 
                                    type="text" 
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    className="w-full bg-stone-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#805894] focus:border-transparent outline-none transition-all font-mono tracking-wider placeholder-gray-400" 
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Son Kullanım</label>
                                    <div className="flex gap-2">
                                        <select 
                                            required 
                                            value={expiryMonth}
                                            onChange={(e) => setExpiryMonth(e.target.value)}
                                            className="w-full bg-stone-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-2 focus:ring-2 focus:ring-[#805894] outline-none cursor-pointer appearance-none font-medium"
                                        >
                                            <option value="">Ay</option>
                                            {Array.from({length: 12}, (_, i) => i + 1).map(n => (
                                                <option key={n} value={n.toString().padStart(2, '0')}>{n.toString().padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                        <select 
                                            required 
                                            value={expiryYear}
                                            onChange={(e) => setExpiryYear(e.target.value)}
                                            className="w-full bg-stone-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-2 focus:ring-2 focus:ring-[#805894] outline-none cursor-pointer appearance-none font-medium"
                                        >
                                            <option value="">Yıl</option>
                                            {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i - 2000).map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">CVV Kodu</label>
                                    <input 
                                        required 
                                        type="password" 
                                        maxLength={3}
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-stone-50 border border-gray-200 text-gray-900 text-lg rounded-xl py-2 px-4 focus:ring-2 focus:ring-[#805894] focus:border-transparent outline-none transition-all text-center tracking-[0.5em] font-mono" 
                                        placeholder="•••"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-gradient-to-r from-[#805894] to-[#604270] hover:from-[#6b477c] hover:to-[#4e355b] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(128,88,148,0.5)] transition-all active:scale-[0.98] text-[13px] tracking-widest uppercase flex justify-center items-center gap-2">
                                    <Lock size={16} />
                                    Ödemeyi Tamamla
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-6 flex justify-center space-x-6 text-gray-400">
                            {/* Trust badges visually */}
                            <div className="flex items-center gap-1.5"><ShieldCheck size={14}/><span className="text-xs font-medium">256-bit SSL</span></div>
                            <div className="flex items-center gap-1.5"><Lock size={14}/><span className="text-xs font-medium">3D Secure</span></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
