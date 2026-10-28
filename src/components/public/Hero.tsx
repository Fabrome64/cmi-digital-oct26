'use client';

import { useState, useEffect, useCallback } from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  text?: string;
  whatsapp?: string;
}

export default function Hero({
  title = 'CMI DIGITAL',
  subtitle = 'Servicios que llevan tu empresa atener presencia visual y digital',
}: HeroProps) {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop',
      title: title || 'CMI DIGITAL',
      desc: subtitle || 'Servicios que llevan tu empresa atener presencia visual y digital',
      btnText: 'Ver Productos',
      btnHref: '#impresiones',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1920&auto=format&fit=crop',
      title: 'OFERTA DE OTOÑO',
      desc: 'Renová tus espacios con la mejor calidad',
      btnText: 'Ver Productos',
      btnHref: '#impresiones',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Configurar autoplay cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      changeSlide(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [changeSlide]);

  return (
    <section id="inicio" className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="overlay"></div>
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.desc}</p>
            <a href={slide.btnHref} className="btn-hero">
              {slide.btnText}
            </a>
          </div>
        </div>
      ))}

      {/* Controles de navegación */}
      <button
        type="button"
        className="arrow prev"
        onClick={() => changeSlide(-1)}
        aria-label="Slide anterior"
      >
        &#10094;
      </button>
      <button
        type="button"
        className="arrow next"
        onClick={() => changeSlide(1)}
        aria-label="Slide siguiente"
      >
        &#10095;
      </button>

      {/* Paginación (Puntos) */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            role="button"
            tabIndex={0}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
