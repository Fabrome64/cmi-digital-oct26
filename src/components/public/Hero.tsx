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
      btnText: 'Ver Imprenta',
      btnHref: '#impresiones',
      waMessage: 'Hola CMI Digital, quiero consultar por Talonarios, Volantes e Imprenta Gráfica.',
    },
    {
      id: 2,
      image: '/hero/banner-gran-formato.png',
      alt: 'CMI Digital - Área Impresiones Gran Formato: Cartelería, Lonas y Vinilos',
      title: 'IMPRESIONES GRAN FORMATO',
      btnText: 'Ver Gran Formato',
      btnHref: '#impresiones',
      waMessage: 'Hola CMI Digital, quiero consultar por Cartelería y Lonas Gran Formato.',
    },
    {
      id: 3,
      image: '/hero/banner-diseno-web.png',
      alt: 'CMI Digital - Área Diseño Web / PWA: Sitios web intuitivos y conversión por WhatsApp',
      title: 'DISEÑO WEB & PWA',
      btnText: 'Ver Diseño Web',
      btnHref: '#diseno-web',
      waMessage: 'Hola CMI Digital, quiero consultar por Desarrollo de Sitio Web y PWA.',
    },
    {
      id: 4,
      image: '/hero/banner-marketing-digital.png',
      alt: 'CMI Digital - Área Marketing Digital: Gestión de Redes Sociales y Contenido Profesional',
      title: 'MARKETING DIGITAL',
      btnText: 'Ver Marketing',
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

  // Autoplay cada 5 segundos (pausa al pasar el mouse por encima)
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
      className="hero-slider relative w-full overflow-hidden bg-[#060d24] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slider-wrapper relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`slide ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
            >
              {/* Imagen ocupando el 100% del área de la sección a lo ancho */}
              <a
                href={slide.btnHref}
                className="slide-banner-link block w-full h-full relative cursor-pointer"
                title={`${slide.title} - Clic para ver más`}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover sm:object-fill block"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </a>

              {/* Botones por arriba ubicados estratégicamente en la esquina superior derecha */}
              <div className="slide-top-actions absolute top-2 right-2 sm:top-4 sm:right-6 lg:top-6 lg:right-10 z-20 flex items-center gap-1.5 sm:gap-3">
                <a
                  href={slide.btnHref}
                  className="btn-hero-pill"
                >
                  <span>{slide.btnText}</span>
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 inline-block opacity-85" />
                </a>

                <a
                  href={getWhatsAppUrl(whatsapp, 'GENERAL', slide.waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hero-wa-pill"
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-green-300" />
                  <span>Pedir Presupuesto</span>
                </a>
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
        <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
      </button>

      <button
        type="button"
        className="arrow next"
        onClick={() => changeSlide(1)}
        aria-label="Siguiente banner"
      >
        <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
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
