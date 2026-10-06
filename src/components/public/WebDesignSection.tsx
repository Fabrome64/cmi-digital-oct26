'use client';

import { useState, useEffect } from 'react';
import {
  Monitor, Smartphone, Zap, Search, MessageSquare, Mail, ShoppingBag,
  Share2, ShieldCheck, Download, Sliders, TrendingUp, ExternalLink, Globe, Filter
} from 'lucide-react';
import { WebPortfolioType } from '@/types';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface WebDesignSectionProps {
  whatsapp?: string;
}

export default function WebDesignSection({ whatsapp = '5493437421589' }: WebDesignSectionProps) {
  const [portfolio, setPortfolio] = useState<WebPortfolioType[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const waUrl = getWhatsAppUrl(whatsapp, 'WEB');

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          setPortfolio(data);
        }
      } catch (err) {
        console.error('Error cargando portfolio:', err);
      } finally {
        setLoadingPortfolio(false);
      }
    }
    loadPortfolio();
  }, []);

  const advantages = [
    { icon: Monitor, title: 'Diseño Profesional', desc: 'Interfaces atractivas que generan máxima confianza.' },
    { icon: Smartphone, title: 'Adaptación a Celulares', desc: 'Experiencia fluida y 100% responsive.' },
    { icon: Zap, title: 'Carga Rápida', desc: 'Código optimizado para mínima latencia.' },
    { icon: Search, title: 'SEO Técnico', desc: 'Posicionamiento destacado en búsquedas de Google.' },
    { icon: MessageSquare, title: 'Integración WhatsApp', desc: 'Contactos directos a tu chat desde la web.' },
    { icon: Mail, title: 'Formularios de Contacto', desc: 'Captación directa de consultas y presupuestos.' },
    { icon: ShoppingBag, title: 'Catálogo de Productos', desc: 'Exhibición organizada de tu oferta comercial.' },
    { icon: Share2, title: 'Redes Sociales', desc: 'Vínculos integrados con tu presencia digital.' },
    { icon: ShieldCheck, title: 'Seguridad', desc: 'Protección SSL y arquitectura robusta.' },
    { icon: Download, title: 'Aplicación PWA', desc: 'Instalable en smartphones y escritorio.' },
    { icon: Sliders, title: 'Panel Administrativo', desc: 'Gestión total de contenidos sin programar.' },
    { icon: TrendingUp, title: 'Escalabilidad', desc: 'Preparado para crecer sin límites.' },
  ];

  const categories = ['Todos', ...Array.from(new Set(portfolio.map((item) => item.categoria)))];

  const filteredPortfolio = activeCategory === 'Todos'
    ? portfolio
    : portfolio.filter((item) => item.categoria === activeCategory);

  return (
    <section id="diseno-web" className="py-20 bg-gradient-to-b from-white via-[#EAF3FF] to-white border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#0066FF] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 shadow">
            <Globe className="w-4 h-4 text-blue-200" />
            <span>Presencia Digital 24/7</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            DISEÑO & DESARROLLO WEB
          </h2>
          <p className="text-xl font-bold text-[#0066FF] mt-2">
            Tu negocio merece estar online.
          </p>
        </div>

        {/* TWO COLUMNS PRESENTATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          
          {/* Left Column: Commercial Copy & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-3xl font-extrabold text-gray-900 leading-snug">
              Desarrollamos sitios web profesionales, modernos y adaptados a celulares.
            </h3>
            <p className="text-base text-gray-700 leading-relaxed font-normal">
              Tu empresa tendrá presencia, credibilidad y alcance las 24 horas del día. Diseñamos desde landing pages comerciales hasta plataformas completas con catálogo autoadministrable y soporte PWA para instalación rápida.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 text-base"
              >
                <MessageSquare className="w-5 h-5" />
                <span>QUIERO MI SITIO WEB</span>
              </a>

              <a
                href="#portfolio-web"
                className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-blue-50 text-[#0066FF] border-2 border-[#0066FF] font-extrabold px-6 py-3.5 rounded-xl shadow transition-all text-base"
              >
                <span>VER PORTFOLIO</span>
              </a>
            </div>
          </div>

          {/* Right Column: 12 Advantage Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {advantages.map((adv, idx) => {
              const IconComp = adv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md hover:border-[#0066FF] transition-all card-hover group"
                >
                  <div className="w-10 h-10 bg-[#EAF3FF] group-hover:bg-[#0066FF] text-[#0066FF] group-hover:text-white rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-gray-900 text-sm mb-1">{adv.title}</h4>
                  <p className="text-xs text-gray-600 leading-snug">{adv.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* PORTFOLIO SUBSECTION */}
        <div id="portfolio-web" className="pt-12 border-t border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900">
                PORTFOLIO DE SITIOS WEB
              </h3>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Proyectos reales desarrollados por CMI DIGITAL (Obtenidos dinámicamente de la BD)
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#0066FF] text-white shadow'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Grid */}
          {loadingPortfolio ? (
            <div className="text-center py-12 text-gray-500 font-medium animate-pulse">
              Cargando portfolio desde la base de datos...
            </div>
          ) : filteredPortfolio.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
              No hay proyectos en esta categoría por el momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPortfolio.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all card-hover flex flex-col justify-between"
                >
                  <div>
                    {/* Project Image */}
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden group">
                      <img
                        src={project.imagenPrincipal}
                        alt={project.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-[#0066FF] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow">
                        {project.categoria}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-6 space-y-3">
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        Cliente: {project.cliente}
                      </div>
                      <h4 className="font-extrabold text-xl text-gray-900 leading-tight">
                        {project.titulo}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed font-normal">
                        {project.descripcion}
                      </p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tecnologias.split(',').map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-blue-100"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-6 pt-0">
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-[#0066FF] text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        <span>VER SITIO WEB</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-100 text-gray-400 font-bold py-2.5 rounded-xl text-sm"
                      >
                        SITIO INTERNO
                      </button>
                    )}
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
