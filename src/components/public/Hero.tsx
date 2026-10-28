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
  const baseSlides = [
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

  // Extended slides with clones for seamless infinite sliding loop
  // [Clone 4, Slide 1, Slide 2, Slide 3, Slide 4, Clone 1]
  const extendedSlides = [
    { ...baseSlides[baseSlides.length - 1], uniqueKey: 'clone-prev' },
    ...baseSlides.map((s) => ({ ...s, uniqueKey: `slide-${s.id}` })),
    { ...baseSlides[0], uniqueKey: 'clone-next' },
  ];

  const [currentIndex, setCurrentIndex] = useState(1); // Starts at real Slide 1
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Avanzar o retroceder slide
  const changeSlide = useCallback((direction: number) => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + direction);
  }, []);

  // Navegar directamente a un slide desde los puntos (dots)
  const goToSlide = (slideIndex: number) => {
    setIsTransitioning(true);
    setCurrentIndex(slideIndex + 1);
  };

  // Autoplay con loop cada 8 segundos
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      changeSlide(1);
    }, 8000); // 8 segundos exactos entre slide y slide
    return () => clearInterval(timer);
  }, [changeSlide, isPaused]);

  // Manejo de loop infinito sin saltos al terminar la animación CSS
  const handleTransitionEnd = () => {
    if (currentIndex >= extendedSlides.length - 1) {
      // Llegó al clon de Slide 1 al final -> saltar instantáneamente a Slide 1 real
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      // Llegó al clon de Slide 4 al inicio -> saltar instantáneamente a Slide 4 real
      setIsTransitioning(false);
      setCurrentIndex(baseSlides.length);
    }
  };

  // Re-activar la transición en el siguiente frame después de saltar
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Gestos táctiles para móviles (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        changeSlide(1); // Swipe izquierda -> siguiente
      } else {
        changeSlide(-1); // Swipe derecha -> anterior
      }
    }
    touchStartX.current = null;
  };

  // Índice activo para los puntos de paginación (0 a 3)
  const activeDotIndex = (currentIndex - 1 + baseSlides.length) % baseSlides.length;

  return (
    <section
      id="inicio"
      className="hero-slider relative w-full overflow-hidden bg-[#060d24] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slider-wrapper relative w-full h-full overflow-hidden">
        {/* Track horizontal con animación slide */}
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, index) => (
            <div
              key={slide.uniqueKey}
              className="slide"
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
                  loading={index <= 2 ? 'eager' : 'lazy'}
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
          ))}
        </div>
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
        {baseSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`dot ${index === activeDotIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir al banner ${index + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
}
