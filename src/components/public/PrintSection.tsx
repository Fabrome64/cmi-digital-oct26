'use client';

import { useState, useEffect } from 'react';
import {
  Printer, Layers, ShieldAlert, Award, Grid, Compass, Truck, Eye,
  Sparkles, Maximize2, Tag, CheckCircle2, MessageSquare
} from 'lucide-react';
import { PrintProductType } from '@/types';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface PrintSectionProps {
  whatsapp?: string;
}

export default function PrintSection({ whatsapp = '5493437421589' }: PrintSectionProps) {
  const [products, setProducts] = useState<PrintProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/print-products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error cargando impresiones:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const productBoxes = [
    { icon: Printer, title: 'Banners Roll-Up', desc: 'Portátiles y de fácil armado con funda.' },
    { icon: Layers, title: 'Cartelería Frontlight', desc: 'Estructuras reforzadas de máxima resistencia.' },
    { icon: Tag, title: 'Lonas de Alta Densidad', desc: '13oz, Backlight y Mesh microperforada.' },
    { icon: Grid, title: 'Vinilos Autoadhesivos', desc: 'Brillantes, mates y esmerilados de alta resolución.' },
    { icon: Eye, title: 'Microperforados', desc: 'Visión unidireccional para vidrieras y vehículos.' },
    { icon: Sparkles, title: 'Vidrieras Comerciales', desc: 'Deco gráfica e identificación de local.' },
    { icon: Truck, title: 'Ploteo Vehicular', desc: 'Gráfica para camionetas, autos y flotas.' },
    { icon: Maximize2, title: 'Gigantografías', desc: 'Impresiones en gran tamaño sin perder nitidez.' },
    { icon: Compass, title: 'Señalética PVC/Sintra', desc: 'Carteles rígidos para interior y exterior.' },
    { icon: ShieldAlert, title: 'Carteles Comerciales', desc: 'Marquesinas y frentes iluminados.' },
    { icon: Award, title: 'Material Promocional', desc: 'Pasacalles, posters y lienzos.' },
    { icon: CheckCircle2, title: 'Terminaciones', desc: 'Confección con ojalillos, bolsillo y refuerzos.' },
  ];

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.categoria)))];

  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter((p) => p.categoria === activeCategory);

  return (
    <section id="impresiones" className="py-20 bg-gradient-to-b from-white via-[#FFF8D6] to-white border-t border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-gray-900 text-[#FFD400] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 shadow">
            <Printer className="w-4 h-4 text-yellow-400" />
            <span>Impresión Ecosolvente & Gran Formato</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            IMPRESIONES GRAN FORMATO
          </h2>
          <p className="text-xl font-bold text-yellow-800 mt-2">
            Tu marca también se imprime.
          </p>
        </div>

        {/* TWO COLUMNS PRESENTATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Column: Commercial Text & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-3xl font-extrabold text-gray-900 leading-snug">
              Transformamos tus ideas en piezas gráficas de gran impacto visual.
            </h3>
            <p className="text-base text-gray-700 font-normal leading-relaxed">
              Contamos con tecnología de impresión ecosolvente en alta definición para comunicar, promocionar y hacer visible tu negocio en la vía pública, eventos o instalaciones comerciales. Resistencia garantizada a la intemperie y colores vibrantes.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a
                href="#presupuesto"
                className="inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-[#FFD400] font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 text-base"
              >
                <span>PEDIR PRESUPUESTO</span>
              </a>

              <a
                href="#catalogo-impresiones"
                className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-yellow-100 text-gray-900 border-2 border-gray-900 font-extrabold px-6 py-3.5 rounded-xl shadow transition-all text-base"
              >
                <span>VER PRODUCTOS</span>
              </a>
            </div>
          </div>

          {/* Right Column: 12 Product Boxes Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {productBoxes.map((box, idx) => {
              const IconComp = box.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-yellow-200 shadow-sm hover:shadow-md hover:border-[#FFD400] transition-all card-hover group"
                >
                  <div className="w-10 h-10 bg-[#FFF8D6] group-hover:bg-[#FFD400] text-gray-900 rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-gray-900 text-sm mb-1">{box.title}</h4>
                  <p className="text-xs text-gray-600 leading-snug">{box.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* DYNAMIC IMPRESIONES CATALOG SUBSECTION */}
        <div id="catalogo-impresiones" className="pt-12 border-t border-yellow-300">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900">
                CATÁLOGO DE PRODUCTOS DE IMPRESIÓN
              </h3>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Catálogo autoadministrable desde el panel de control
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-gray-900 text-[#FFD400] shadow'
                      : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 font-medium animate-pulse">
              Cargando catálogo de productos...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
              No hay productos en esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all card-hover flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden group">
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 bg-gray-900 text-[#FFD400] text-[11px] font-extrabold px-3 py-1 rounded-full shadow">
                        {prod.categoria}
                      </span>
                    </div>

                    {/* Product Specs */}
                    <div className="p-6 space-y-3">
                      <h4 className="font-extrabold text-xl text-gray-900 leading-tight">
                        {prod.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {prod.descripcion}
                      </p>

                      {prod.medidas && (
                        <div className="text-xs font-semibold text-gray-500">
                          Medidas: <span className="text-gray-900">{prod.medidas}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="p-6 pt-0 space-y-3">
                    {prod.precio ? (
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-extrabold text-gray-900">
                          ${prod.precio.toLocaleString('es-AR')}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          / {prod.unidad || 'm2'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-yellow-800">
                        Presupuesto a medida
                      </div>
                    )}

                    <a
                      href={getWhatsAppUrl(whatsapp, 'PRINT', `Hola CMI Digital, quiero consultar por el producto: ${prod.nombre}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold py-2.5 rounded-xl transition-colors text-sm shadow"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>SOLICITAR PRESUPUESTO</span>
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
