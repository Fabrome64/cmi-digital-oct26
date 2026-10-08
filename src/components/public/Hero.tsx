'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, MessageSquare } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

// Dynamic import for Three.js canvas to avoid SSR issues
const KiroCanvas = dynamic(() => import('./KiroCanvas'), { ssr: false });

interface HeroProps {
  title?: string;
  subtitle?: string;
  text?: string;
  whatsapp?: string;
}

export default function Hero({
  title = 'La próxima gran idea empieza contigo.',
  subtitle = 'Impresiones, marketing digital y desarrollo web para llevar tu marca al próximo nivel.',
  whatsapp = '5493458659792',
}: HeroProps) {
  const [sayHiTrigger, setSayHiTrigger] = useState(0);
  const [responseText, setResponseText] = useState('');
  const waUrl = getWhatsAppUrl(whatsapp, 'GENERAL');

  const handleLaunch = () => {
    setSayHiTrigger((prev) => prev + 1);
    setResponseText('🚀 ¡Despegue iniciado! Kiro está listo para llevar tu proyecto al próximo nivel.');
    setTimeout(() => setResponseText(''), 5000);
  };

  return (
    <section
      id="inicio"
      className="hero relative bg-[#243eff] text-white overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28 min-h-[90vh] flex items-center"
    >
      {/* Halos & Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d2ff32] opacity-20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-sky-300 opacity-25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-white opacity-15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-md border border-[#d2ff32]/30 text-[#d2ff32] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide font-dmsans">
              <Sparkles className="w-4 h-4 text-[#d2ff32]" />
              <span>CMI DIGITAL · IMPRESIONES · MARKETING · WEB</span>
            </div>

            {/* H1 Title with clamp font size, Manrope 800, line-height .89 */}
            <h1
              className="font-manrope font-extrabold text-white tracking-tight leading-[0.89]"
              style={{ fontSize: 'clamp(52px, 7.5vw, 120px)' }}
            >
              {title.includes('empieza contigo') ? (
                <>
                  La próxima gran idea <span className="text-[#d2ff32]">empieza contigo.</span>
                </>
              ) : (
                title
              )}
            </h1>

            {/* Subtitle in DM Sans font */}
            <p className="font-dmsans text-[20px] lg:text-[24px] text-blue-100 font-normal max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                id="action"
                onClick={handleLaunch}
                className="w-full sm:w-auto h-[60px] lg:h-[66px] px-8 bg-[#d2ff32] hover:bg-[#c2ef22] text-[#101b22] font-dmsans font-extrabold text-lg sm:text-xl rounded-2xl shadow-2xl hover:shadow-[#d2ff32]/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center border-none cursor-pointer"
              >
                Iniciar despegue
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-[60px] lg:h-[66px] px-8 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-dmsans font-bold text-lg rounded-2xl backdrop-blur-sm transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 text-center"
              >
                <MessageSquare className="w-5 h-5 text-[#d2ff32]" />
                <span>Contactar ahora</span>
              </a>
            </div>

            {/* Response status paragraph */}
            {responseText && (
              <p id="response" className="font-dmsans text-sm font-semibold text-[#d2ff32] animate-fade-in pt-1">
                {responseText}
              </p>
            )}

            {/* Hidden metrics element as requested by spec */}
            <span id="metrics" className="sr-only">
              Cargando métricas de renderizado...
            </span>
          </div>

          {/* Right Column: 3D Kiro Character Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full relative">
              <KiroCanvas sayHiTrigger={sayHiTrigger} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
