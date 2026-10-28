'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface HeroProps {
  title?: string;
  subtitle?: string;
  text?: string;
  whatsapp?: string;
}

export default function Hero({
  whatsapp = '5493458659792',
}: HeroProps) {
  const slides = [
    {
      id: 1,
      image: '/hero/banner-imprenta-grafica.png',
      alt: 'CMI Digital - Área Imprenta Gráfica: Talonarios, Rifas, Volantes y Folletos',
      title: 'ÁREA IMPRENTA GRÁFICA',
      subtitle: 'Talonarios, Rifas, Volantes, Folletos e Impresión de Alta Calidad',
      btnText: 'Ver Imprenta Gráfica',
      btnHref: '#impresiones',
      waMessage: 'Hola CMI Digital, quiero consultar por Talonarios, Volantes e Imprenta Gráfica.',
    },
    {
      id: 2,
      image: '/hero/banner-gran-formato.png',
      alt: 'CMI Digital - Área Impresiones Gran Formato: Cartelería, Lonas y Vinilos',
      title: 'IMPRESIONES GRAN FORMATO',
      subtitle: 'Cartelería, Lonas de Alta Densidad, Vinilos y Banners',
      btnText: 'Ver Gran Formato',
      btnHref: '#impresiones',
      waMessage: 'Hola CMI Digital, quiero consultar por Cartelería y Lonas Gran Formato.',
    },
    {
      id: 3,
      image: '/hero/banner-diseno-web.png',
      alt: 'CMI Digital - Área Diseño Web / PWA: Sitios web intuitivos y conversión por WhatsApp',
      title: 'DISEÑO WEB & PWA',
      subtitle: 'Sitios web modernos, tiendas online y aplicaciones instalables PWA',
      btnText: 'Ver Diseño Web & PWA',
      btnHref: '#diseno-web',
      waMessage: 'Hola CMI Digital, quiero consultar por Desarrollo de Sitio Web y PWA.',
    },
    {
      id: 4,
      image: '/hero/banner-marketing-digital.png',
      alt: 'CMI Digital - Área Marketing Digital: Gestión de Redes Sociales y Contenido Profesional',
      title: 'MARKETING DIGITAL',
      subtitle: 'Gestión de redes sociales, anuncios y más clientes para tu negocio',
      btnText: 'Ver Marketing Digital',
      btnHref: '#marketing-redes',
      waMessage: 'Hola CMI Digital, quiero consultar por Gestión de Redes Sociales y Marketing.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Cambiar slide con flechas (+1 o -1)
  const changeSlide = useCallback((direction: number) => {
    setCurrentIndex((prev) => {
      let next = prev + direction;
      if (next >= slides.length) next = 0;
      if (next < 0) next = slides.length - 1;
      return next;
    });
  }, [slides.length]);

  // Cambiar slide con los puntos (dots)
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay cada 5 segundos (pausa cuando el usuario pasa el mouse)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      changeSlide(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [changeSlide, isPaused]);

  // Soporte para gestos táctiles (Swipe en móvil)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        changeSlide(1); // Swipe izquierda -> Siguiente
      } else {
        changeSlide(-1); // Swipe derecha -> Anterior
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="inicio"
      className="hero-slider relative w-full overflow-hidden bg-[#0a1128] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slider-wrapper relative w-full h-full flex items-center justify-center">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`slide ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
            >
              {/* Fondo ambiental difuminado con el color del banner */}
              <div
                className="slide-ambient-bg"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="overlay"></div>

              {/* Contenedor central del banner adaptado */}
              <div className="slide-content">
                <a
                  href={slide.btnHref}
                  className="banner-card-link group block relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-transform duration-300 transform hover:scale-[1.01]"
                  title={`${slide.title} - Clic para ver más`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-auto object-contain block"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Sutil brillo al pasar el mouse */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
                </a>

                {/* Botonera de acción adaptada */}
                <div className="slide-actions">
                  <a href={slide.btnHref} className="btn-hero">
                    <span>{slide.btnText}</span>
                    <ExternalLink className="w-4 h-4 ml-2 inline-block opacity-80" />
                  </a>

                  <a
                    href={getWhatsAppUrl(whatsapp, 'GENERAL', slide.waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hero-wa"
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-green-400" />
                    <span>Consultar WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flechas de navegación */}
      <button
        type="button"
        className="arrow prev"
        onClick={() => changeSlide(-1)}
        aria-label="Banner anterior"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <button
        type="button"
        className="arrow next"
        onClick={() => changeSlide(1)}
        aria-label="Siguiente banner"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Indicadores / Paginación (Puntos) */}
      <div className="dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir al banner ${index + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
}
