'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registrado:', reg.scope))
        .catch((err) => console.error('PWA Service Worker error:', err));
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar PWA CMI DIGITAL');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-gray-900 text-white p-5 rounded-2xl shadow-2xl border-2 border-[#FFD400] flex items-center justify-between space-x-4 animate-bounce">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#FFD400] text-gray-900 font-black rounded-xl flex items-center justify-center text-lg flex-shrink-0">
          CMI
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-[#FFD400]">CMI DIGITAL App</h4>
          <p className="text-xs text-gray-300">Instalá la aplicación en tu celular o PC</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstallClick}
          className="bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold text-xs px-3 py-2 rounded-xl flex items-center space-x-1 shadow transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>INSTALAR</span>
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
