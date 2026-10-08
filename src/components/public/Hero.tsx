'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface HeroProps {
  title?: string;
  subtitle?: string;
  text?: string;
  whatsapp?: string;
}

export default function Hero({
  title = 'CMI DIGITAL',
  subtitle = 'Soluciones que hacen visible tu negocio.',
  text = 'Impresiones, marketing digital y desarrollo web para llevar tu empresa al próximo nivel.',
  whatsapp = '5493458659792',
}: HeroProps) {
  const waUrl = getWhatsAppUrl(whatsapp, 'GENERAL');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Smooth progress from 0 (top of page) to 1 (scrolled down ~380px)
      const progress = Math.min(1, Math.max(0, scrollY / 380));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="inicio" className="relative bg-[#00008B] text-white pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      
      {/* Background Radial Accents & Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-40 pointer-events-none" />

      {/* Left Margin Vector Memphis Geometric Line Pattern (Line Art Overlay) */}
      <div className="absolute top-0 left-0 bottom-0 w-72 sm:w-96 lg:w-[38%] opacity-40 pointer-events-none z-0 overflow-hidden">
        <svg
          className="w-full h-full text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 400 800"
          preserveAspectRatio="xMinYMin slice"
        >
          {/* Triangles (Outlined Lines) */}
          <polygon points="40,60 90,140 10,140" stroke="rgba(255, 212, 0, 0.6)" strokeWidth="2" strokeDasharray="4 2" />
          <polygon points="280,220 340,310 220,310" stroke="rgba(0, 229, 255, 0.7)" strokeWidth="2.5" />
          <polygon points="120,480 180,570 60,570" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
          <polygon points="260,640 310,720 210,720" stroke="rgba(255, 212, 0, 0.5)" strokeWidth="2" />

          {/* Concentric Circles & Rings */}
          <circle cx="210" cy="100" r="45" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
          <circle cx="210" cy="100" r="30" stroke="rgba(0, 229, 255, 0.6)" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="80" cy="340" r="38" stroke="rgba(255, 212, 0, 0.6)" strokeWidth="2" />
          <circle cx="330" cy="520" r="50" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2.5" />

          {/* Zigzag Lines & Waves */}
          <path d="M 20,220 L 50,240 L 80,220 L 110,240 L 140,220" stroke="rgba(0, 229, 255, 0.8)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 190,390 L 220,410 L 250,390 L 280,410 L 310,390" stroke="rgba(255, 212, 0, 0.8)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 30,620 L 60,640 L 90,620 L 120,640 L 150,620" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Crosses & Plus Line Art */}
          <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2.5" strokeLinecap="round">
            <line x1="140" y1="40" x2="160" y2="40" /><line x1="150" y1="30" x2="150" y2="50" />
            <line x1="300" y1="150" x2="320" y2="150" /><line x1="310" y1="140" x2="310" y2="160" />
            <line x1="40" y1="440" x2="60" y2="440" /><line x1="50" y1="430" x2="50" y2="450" />
            <line x1="160" y1="700" x2="180" y2="700" /><line x1="170" y1="690" x2="170" y2="710" />
          </g>

          {/* Grid Dots */}
          <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="rgba(0, 229, 255, 0.5)" />
          </pattern>
          <rect x="230" y="20" width="100" height="80" fill="url(#dot-grid)" />
          <rect x="20" y="700" width="120" height="80" fill="url(#dot-grid)" />
        </svg>

        {/* Horizontal gradient fade mask on right edge for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#00008B]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-yellow-400 text-gray-950 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-lg">
              <Sparkles className="w-4 h-4 text-gray-950" />
              <span>IMPRESIONES · MARKETING · DESARROLLO WEB</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none">
              {title}
            </h1>

            <p className="text-2xl sm:text-3xl font-extrabold text-[#FFD400] leading-snug">
              {subtitle}
            </p>

            <p className="text-lg sm:text-xl text-blue-100 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {text}
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left font-semibold text-sm text-cyan-100 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-[#FFD400] flex-shrink-0" />
                <span>Diseño Profesional</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-[#FFD400] flex-shrink-0" />
                <span>Gran Formato</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-[#FFD400] flex-shrink-0" />
                <span>Estrategia Digital</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
              <a
                href="#diseno-web"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-[#FFD400] hover:bg-yellow-300 text-gray-950 font-extrabold px-8 py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-1 text-base sm:text-lg"
              >
                <span>CONOCÉ NUESTROS SERVICIOS</span>
                <ArrowRight className="w-5 h-5 text-gray-950" />
              </a>

              <a
                href="#contacto"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 font-extrabold px-8 py-4 rounded-xl shadow-lg backdrop-blur-sm transition-all transform hover:-translate-y-1 text-base sm:text-lg"
              >
                <MessageSquare className="w-5 h-5 text-cyan-300" />
                <span>CONTACTANOS</span>
              </a>
            </div>
          </div>

          {/* Right Hero Graphic Showcase: Robot with Laptop & Scroll Lifted Gaze Animation */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              
              {/* Outer Glow Halo behind Robot */}
              <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-3xl rounded-full transform scale-90 pointer-events-none" />

              {/* Robot Image Container with Dynamic Scroll Lifted Gaze Transform */}
              <div
                className="relative z-10 flex justify-center items-center p-4 transition-transform duration-200 ease-out"
                style={{
                  transform: `perspective(900px) rotateX(${scrollProgress * 14}deg) rotate(-${scrollProgress * 7}deg) translateY(${-scrollProgress * 26}px) scale(${1 + scrollProgress * 0.05})`,
                  transformOrigin: 'bottom center',
                }}
              >
                <img
                  src="/robot-laptop.png"
                  alt="CMI Digital Robot Asistente"
                  className="w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-float"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
