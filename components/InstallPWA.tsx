import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, MonitorDown } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showIOSModal, setShowIOSModal] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://');

        setIsStandalone(isInStandaloneMode);

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // If already installed, don't show anything
        if (isInStandaloneMode) return;

        // Show button after a delay to not be intrusive
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        // Android: Listen for beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            // iOS doesn't support programmatic install, show instructions
            setShowIOSModal(true);
        } else if (deferredPrompt) {
            // Android/Chrome: Trigger the install prompt
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setIsVisible(false);
            }
        } else {
            // Fallback for desktop or non-supported browsers
            alert("Uygulamayı yüklemek için tarayıcınızın menüsünden 'Ana Ekrana Ekle' veya 'Uygulamayı Yükle' seçeneğini kullanabilirsiniz.");
        }
    };

    // Don't render if installed
    if (isStandalone || !isVisible) return null;

    return (
        <>
            {/* Floating Install Button */}
            <button
                onClick={handleInstallClick}
                className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl flex items-center gap-2 transition-all hover:scale-110 animate-fade-in-up"
                title="Uygulamayı Yükle"
            >
                <MonitorDown size={24} />
                <span className="hidden md:inline font-bold">Uygulamayı Yükle</span>
            </button>

            {/* iOS Instruction Modal */}
            {showIOSModal && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-stone-50 rounded-t-2xl sm:rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setShowIOSModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 bg-gray-200 rounded-full p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Download size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ana Ekrana Ekle</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                iPhone ve iPad cihazlarda uygulamayı yüklemek için aşağıdaki adımları izleyin:
                            </p>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full font-bold">1</span>
                                    <div className="text-sm text-gray-700">
                                        Tarayıcı altındaki <span className="font-bold text-blue-600 inline-flex items-center mx-1"><Share size={14} /> Paylaş</span> butonuna basın.
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full font-bold">2</span>
                                    <div className="text-sm text-gray-700">
                                        Açılan menüde aşağı kaydırıp <span className="font-bold text-gray-800 inline-flex items-center mx-1"><PlusSquare size={14} /> Ana Ekrana Ekle</span> seçeneğine dokunun.
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full font-bold">3</span>
                                    <div className="text-sm text-gray-700">
                                        Sağ üst köşedeki <span className="font-bold text-blue-600">Ekle</span> butonuna basarak tamamlayın.
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setShowIOSModal(false)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    Anladım
                                </button>
                            </div>
                        </div>
                        {/* iOS Pointer Arrow */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-stone-50 rotate-45 translate-y-2 sm:hidden"></div>
                    </div>
                </div>
            )}
        </>
    );
};
