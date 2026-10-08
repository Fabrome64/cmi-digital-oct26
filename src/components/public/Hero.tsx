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
  title = 'Nacimos para ir más lejos.',
  subtitle = 'La próxima gran idea empieza contigo. Impresiones, marketing digital y desarrollo web para llevar tu empresa al siguiente nivel.',
  whatsapp = '5493458659792',
}: HeroProps) {
  const [sayHiTrigger, setSayHiTrigger] = useState(0);
  const [responseText, setResponseText] = useState('');
  const waUrl = getWhatsAppUrl(whatsapp, 'GENERAL');

  const handleLaunch = () => {
    setSayHiTrigger((prev) => prev + 1);
    setResponseText('🚀 ¡Despegue iniciado! Kiro está listo para llevar tu proyecto al espacio.');
    setTimeout(() => setResponseText(''), 5000);
  };

  return (
    <section
      id="inicio"
      className="hero relative bg-[#243eff] text-white overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 min-h-[92vh] flex items-center"
    >
      {/* Background Radial Halos & Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-[#d2ff32] opacity-20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[650px] h-[650px] bg-sky-300 opacity-25 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[25%] left-[35%] w-[450px] h-[450px] bg-white opacity-15 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top Header Navigation matching reference mockup */}
        <div className="flex items-center justify-between pb-8 lg:pb-12">
          <div className="flex items-center space-x-3">
            <span className="text-[#d2ff32] text-2xl font-black">✳</span>
            <span className="font-poppins font-extrabold text-2xl tracking-wider text-white uppercase">
              CMI DIGITAL
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 font-dmsans text-sm font-medium text-blue-100">
            <a href="#servicios" className="hover:text-white transition-colors">Concepto</a>
            <a href="#nosotros" className="hover:text-white transition-colors">Experiencia</a>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full border border-white/40 hover:border-white text-white font-dmsans text-sm font-semibold transition-all hover:bg-white/10"
          >
            Descubrir
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left z-10">
            <div className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-md border border-[#d2ff32]/30 text-[#d2ff32] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide font-dmsans">
              <Sparkles className="w-4 h-4 text-[#d2ff32]" />
              <span>CMI DIGITAL · ROBOT 3D ANIMADO</span>
            </div>

            {/* H1 Title with Poppins Bold font */}
            <h1
              className="font-poppins font-extrabold text-white tracking-tight leading-[0.92]"
              style={{ fontSize: 'clamp(46px, 6.2vw, 98px)' }}
            >
              Nacimos <br />
              para <span className="text-[#d2ff32]">ir más</span> <br />
              <span className="text-[#d2ff32]">lejos.</span>
            </h1>

            {/* Subtitle */}
            <p className="font-dmsans text-[19px] sm:text-[22px] text-blue-100 font-normal max-w-lg leading-relaxed pt-1">
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
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

          {/* Right Column: 3D Kiro Robot Canvas on Right Margin */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[550px] lg:max-w-[650px] relative">
              <KiroCanvas sayHiTrigger={sayHiTrigger} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
