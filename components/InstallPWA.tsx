import React, { useState, useEffect } from 'react';
import { MonitorDown, X, Share } from 'lucide-react';

export const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSModal, setShowIOSModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const checkStandalone = () => {
            const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true || 
                          document.referrer.includes('android-app://');
            setIsStandalone(isPWA);
            return isPWA;
        };

        checkStandalone();

        const ua = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(ua);
        setIsIOS(isIOSDevice);

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkStandalone);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSModal(true);
            return;
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else {
            // Fallback for Android/Chrome if prompt isn't ready
            alert("Lütfen tarayıcı menüsünden 'Ana Ekrana Ekle' (Add to Home Screen) seçeneğini kullanın.");
        }
    };

    if (!mounted) return null;
    if (isStandalone) return null;
    
    // Only show if prompt is available OR it's an iOS device
    if (!deferredPrompt && !isIOS) return null;

    return (
        <>
            {/* Pure Floating Action Button instead of banner */}
            <div className="fixed bottom-6 right-6 z-[80] animate-fade-in-up">
                <button 
                    onClick={handleInstallClick}
                    className="relative bg-gradient-to-br from-[#805894] to-[#5A3E68] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(128,88,148,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
                >
                    <MonitorDown size={28} strokeWidth={2.5}/>
                    {/* Pulsing ring effect */}
                    <span className="absolute inset-0 rounded-full animate-ping bg-[#805894] opacity-40"></span>
                </button>
            </div>

            {/* iOS Custom Install Modal */}
            {showIOSModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center">
                        <button 
                            onClick={() => setShowIOSModal(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="mx-auto w-16 h-16 bg-[#805894]/10 text-[#805894] rounded-2xl flex items-center justify-center mb-6">
                            <Share size={32} />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Uygulamayı iPhone'a Yükle</h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Köyümüzün uygulamasına anında erişmek için Ana Ekrana ekleyin.
                        </p>
                        
                        <div className="space-y-4 text-left bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="bg-white w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-[#805894] font-bold text-sm shrink-0">1</div>
                                <p className="text-sm text-gray-600">Tarayıcının alt menüsündeki <b className="text-gray-900">Paylaş</b> (<Share size={14} className="inline mb-1"/>) ikonuna dokunun.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-white w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-[#805894] font-bold text-sm shrink-0">2</div>
                                <p className="text-sm text-gray-600">Menüyü kaydırın ve <b className="text-gray-900">Ana Ekrana Ekle</b> seçeneğine dokunun.</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowIOSModal(false)}
                            className="w-full mt-6 bg-[#805894] hover:bg-[#6c487e] text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Anladım
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
