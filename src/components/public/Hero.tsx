'use client';

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
  whatsapp = '5493437421589',
}: HeroProps) {
  const waUrl = getWhatsAppUrl(whatsapp, 'GENERAL');

  return (
    <section id="inicio" className="relative bg-gradient-to-b from-[#FFD400] via-[#FFE566] to-white pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-gray-900 text-[#FFD400] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>IMPRESIONES · MARKETING · DESARROLLO WEB</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-none">
              {title}
            </h1>

            <p className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-snug">
              {subtitle}
            </p>

            <p className="text-lg sm:text-xl text-gray-700 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {text}
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left font-semibold text-sm text-gray-800 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-gray-900 flex-shrink-0" />
                <span>Diseño Profesional</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-gray-900 flex-shrink-0" />
                <span>Gran Formato</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-gray-900 flex-shrink-0" />
                <span>Estrategia Digital</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
              <a
                href="#diseno-web"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-gray-900 hover:bg-black text-[#FFD400] font-extrabold px-8 py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-1 text-base sm:text-lg"
              >
                <span>CONOCÉ NUESTROS SERVICIOS</span>
                <ArrowRight className="w-5 h-5 text-yellow-400" />
              </a>

              <a
                href="#contacto"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-900 font-extrabold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-base sm:text-lg"
              >
                <MessageSquare className="w-5 h-5 text-gray-900" />
                <span>CONTACTANOS</span>
              </a>
            </div>
          </div>

          {/* Right Hero Graphic Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Card Wrapper */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-gray-900 space-y-6 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#FFD400] text-gray-900 rounded-lg flex items-center justify-center font-extrabold">
                      CMI
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-base">CMI DIGITAL</h4>
                      <p className="text-xs text-gray-500 font-medium">San José de Feliciano, Entre Ríos</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    ● En línea
                  </span>
                </div>

                {/* 3 Service Cards preview */}
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Desarrollo Web</span>
                      <h5 className="font-extrabold text-gray-900 text-sm">Sitios Web & PWA 24/7</h5>
                    </div>
                    <span className="text-blue-600 font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-blue-200">Moderno</span>
                  </div>

                  <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Marketing Digital</span>
                      <h5 className="font-extrabold text-gray-900 text-sm">Gestión de Redes & Ads</h5>
                    </div>
                    <span className="text-cyan-600 font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-cyan-200">Alcance</span>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Impresión Gran Formato</span>
                      <h5 className="font-extrabold text-gray-900 text-sm">Cartelería, Lonas & Ploteos</h5>
                    </div>
                    <span className="text-yellow-800 font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-yellow-300">Calidad</span>
                  </div>
                </div>

                {/* WhatsApp Quick Link */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 rounded-xl shadow transition-colors text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Consultar por WhatsApp Directo</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
