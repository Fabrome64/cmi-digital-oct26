'use client';

import { useState, useEffect } from 'react';
import {
  Share2, Image, Calendar, Video, Heart, MessageCircle, Target, Compass,
  Users, BarChart3, Palette, UserCheck, Sparkles, CheckCircle
} from 'lucide-react';
import { MarketingServiceType } from '@/types';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface MarketingSectionProps {
  whatsapp?: string;
}

export default function MarketingSection({ whatsapp = '5493437421589' }: MarketingSectionProps) {
  const [services, setServices] = useState<MarketingServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  const waUrl = getWhatsAppUrl(whatsapp, 'MARKETING');

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error('Error cargando servicios de marketing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const features = [
    { icon: Share2, title: 'Administración de Redes', desc: 'Gestión profesional de perfiles de Instagram & Facebook.' },
    { icon: Image, title: 'Diseño de Contenido', desc: 'Gráficas atractivas alineadas a la identidad de tu marca.' },
    { icon: Calendar, title: 'Calendario Editorial', desc: 'Planificación estratégica semanal y mensual.' },
    { icon: Video, title: 'Edición de Reels', desc: 'Videos dinámicos para maximizar alcance orgánico.' },
    { icon: Heart, title: 'Historias Interactivas', desc: 'Fidelización y conversación diaria con tu audiencia.' },
    { icon: Target, title: 'Campañas Meta Ads', desc: 'Publicidad efectiva para captar clientes en tu ciudad.' },
    { icon: Compass, title: 'Estrategia Digital', desc: 'Plan de acción adaptado a los objetivos de tu empresa.' },
    { icon: Users, title: 'Community Management', desc: 'Respuestas oportunas a comentarios y mensajes directos.' },
    { icon: BarChart3, title: 'Analítica & Métricas', desc: 'Informes mensuales de crecimiento y ventas.' },
    { icon: Palette, title: 'Branding & Manual', desc: 'Identidad visual consistente para todas tus plataformas.' },
    { icon: UserCheck, title: 'Generación de Leads', desc: 'Captación directa de prospectos cualificados.' },
    { icon: Sparkles, title: 'Contenido Viral', desc: 'Tendencias aplicadas a tu sector comercial.' },
  ];

  return (
    <section id="marketing-redes" className="py-20 bg-gradient-to-b from-white via-[#E8FCFF] to-white border-t border-cyan-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#00BCD4] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 shadow">
            <Share2 className="w-4 h-4 text-cyan-100" />
            <span>Redes Sociales & Pauta Digital</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            MARKETING EN REDES
          </h2>
          <p className="text-xl font-bold text-[#00ACC1] mt-2">
            Convertimos tus redes en una herramienta activa de ventas.
          </p>
        </div>

        {/* TWO COLUMNS PRESENTATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Column: Commercial Text & CTAs & Client Logos */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-3xl font-extrabold text-gray-900 leading-snug">
              Administramos, diseñamos y planificamos contenido para que tu marca destaque.
            </h3>
            <p className="text-base text-gray-700 font-normal leading-relaxed">
              No dejes tus redes inactivas. Desarrollamos una estrategia integral para atraer clientes locales en San José de Feliciano y la región, con piezas publicitarias creativas, gestión de mensajes y campañas de anuncios de alto retorno.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 text-base"
              >
                <MessageCircle className="w-5 h-5" />
                <span>QUIERO POTENCIAR MIS REDES</span>
              </a>

              <a
                href="#servicios-marketing"
                className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-cyan-50 text-[#00ACC1] border-2 border-[#00ACC1] font-extrabold px-6 py-3.5 rounded-xl shadow transition-all text-base"
              >
                <span>VER SERVICIOS</span>
              </a>
            </div>

            {/* MARCAS CLIENTES DESTACADAS */}
            <div className="pt-6 border-t border-cyan-200/80 mt-8 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00BCD4] animate-pulse"></span>
                <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  MARCAS QUE CONFÍAN EN NOSOTROS
                </h4>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {/* Logo 1: San José Negocios Inmobiliarios */}
                <div className="h-16 bg-white rounded-xl border border-cyan-100 p-1.5 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[#00BCD4] transition-all group">
                  <img
                    src="/clients/san-jose-inmobiliaria.jpg"
                    alt="San José Negocios Inmobiliarios"
                    className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                    title="San José Negocios Inmobiliarios"
                  />
                </div>

                {/* Logo 2: PC Store */}
                <div className="h-16 bg-white rounded-xl border border-cyan-100 p-1.5 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[#00BCD4] transition-all group">
                  <img
                    src="/clients/pc-store.png"
                    alt="PC Store"
                    className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                    title="PC Store"
                  />
                </div>

                {/* Logo 3: LM Quiropraxia */}
                <div className="h-16 bg-white rounded-xl border border-cyan-100 p-1.5 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[#00BCD4] transition-all group">
                  <img
                    src="/clients/lm-quiropraxia.jpg"
                    alt="LM Quiropraxia"
                    className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                    title="LM Quiropraxia"
                  />
                </div>

                {/* Logo 4: Elizabeth González Inmobiliaria */}
                <div className="h-16 bg-white rounded-xl border border-cyan-100 p-1.5 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[#00BCD4] transition-all group">
                  <img
                    src="/clients/elizabeth-gonzalez-inmobiliaria.jpg"
                    alt="Elizabeth González Inmobiliaria"
                    className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                    title="Elizabeth González Inmobiliaria"
                  />
                </div>

                {/* 4 Espacios reservados para futuras marcas */}
                {[1, 2, 3, 4].map((slot) => (
                  <div
                    key={slot}
                    className="h-16 rounded-xl border border-dashed border-cyan-200/80 bg-white/60 flex flex-col items-center justify-center text-center p-1 group hover:border-[#00BCD4] hover:bg-cyan-50/50 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-[#00ACC1]/70 group-hover:text-[#00BCD4] transition-colors">
                      + Tu Marca
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: 12 Advantage Boxes Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-cyan-100 shadow-sm hover:shadow-md hover:border-[#00BCD4] transition-all card-hover group"
                >
                  <div className="w-10 h-10 bg-[#E8FCFF] group-hover:bg-[#00BCD4] text-[#00ACC1] group-hover:text-white rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-gray-900 text-sm mb-1">{feat.title}</h4>
                  <p className="text-xs text-gray-600 leading-snug">{feat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* DYNAMIC MARKETING SERVICES SUBSECTION */}
        <div id="servicios-marketing" className="pt-12 border-t border-cyan-200">
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold text-gray-900">
              SERVICIOS DE MARKETING Y PAUTAS DINÁMICAS
            </h3>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Abonos y paquetes disponibles (Gestión dinámica desde la base de datos)
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 font-medium animate-pulse">
              Cargando servicios de marketing...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
              No hay servicios registrados en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-white p-6 rounded-2xl border border-cyan-200 shadow-sm hover:shadow-xl transition-all card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 bg-[#E8FCFF] text-[#00ACC1] rounded-2xl flex items-center justify-center mb-4">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-xl text-gray-900 mb-2">
                      {svc.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {svc.descripcion}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    {svc.precioOpcional && (
                      <span className="inline-block bg-cyan-50 text-[#00ACC1] font-extrabold text-xs px-3 py-1 rounded-full border border-cyan-200">
                        {svc.precioOpcional}
                      </span>
                    )}

                    <a
                      href={getWhatsAppUrl(whatsapp, 'MARKETING', `Hola CMI Digital, me interesa consultar por el servicio: ${svc.titulo}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-2 bg-[#00BCD4] hover:bg-[#00ACC1] text-[#ffffff] font-bold py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>CONSULTAR</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
