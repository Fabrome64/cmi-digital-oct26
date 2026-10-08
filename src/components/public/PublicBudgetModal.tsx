'use client';

import { useState, useEffect } from 'react';
import {
  Calculator, X, Ruler, Sparkles, MessageSquare, Copy, Check, Layers
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface BudgetMaterial {
  id: string;
  nombre: string;
  rubro: 'IMPRENTA GRÁFICA' | 'GRAN FORMATO';
  unidadCalculo: 'METRO CUADRADO' | 'METRO LINEAL' | 'UNIDAD';
  precioUnitario: number;
  observaciones?: string | null;
}

interface PublicBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsapp?: string;
  initialRubro?: string;
  initialMaterialName?: string;
}

export default function PublicBudgetModal({
  isOpen,
  onClose,
  whatsapp = '5493458659792',
  initialRubro = 'TODOS',
  initialMaterialName,
}: PublicBudgetModalProps) {
  const [materials, setMaterials] = useState<BudgetMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [rubroFilter, setRubroFilter] = useState<string>(initialRubro);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  
  // Dimensions & Quantities
  const [anchoCm, setAnchoCm] = useState<number | ''>(100);
  const [altoCm, setAltoCm] = useState<number | ''>(100);
  const [cantidad, setCantidad] = useState<number>(1);

  // Copy Feedback
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchMaterials() {
      try {
        setLoading(true);
        const res = await fetch('/api/budget-materials');
        if (res.ok) {
          const data: BudgetMaterial[] = await res.json();
          setMaterials(data);

          if (data.length > 0) {
            if (initialMaterialName) {
              const matched = data.find((m) =>
                m.nombre.toLowerCase().includes(initialMaterialName.toLowerCase())
              );
              if (matched) {
                setSelectedMaterialId(matched.id);
                setRubroFilter(matched.rubro);
                return;
              }
            }
            setSelectedMaterialId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error cargando insumos para presupuestar:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMaterials();
  }, [isOpen, initialMaterialName]);

  useEffect(() => {
    if (initialRubro && initialRubro !== 'TODOS') {
      setRubroFilter(initialRubro);
    }
  }, [initialRubro]);

  if (!isOpen) return null;

  const normalizeRubro = (s: string) =>
    (s || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Filtered materials by Rubro
  const filteredMaterials = materials.filter((m) => {
    if (rubroFilter === 'TODOS') return true;
    return normalizeRubro(m.rubro) === normalizeRubro(rubroFilter);
  });

  const currentMaterial = materials.find((m) => m.id === selectedMaterialId) || filteredMaterials[0] || materials[0];

  // Calculation Logic
  const numericAncho = Number(anchoCm) || 0;
  const numericAlto = Number(altoCm) || 0;
  const numericCantidad = Math.max(1, Number(cantidad) || 1);

  const anchoM = numericAncho / 100;
  const altoM = numericAlto / 100;
  const m2Totales = (anchoM * altoM) * numericCantidad;
  const mlTotales = altoM * numericCantidad;

  let subtotalBase = 0;
  let cantidadCalculadaTexto = '';

  if (currentMaterial) {
    if (currentMaterial.unidadCalculo === 'METRO CUADRADO') {
      subtotalBase = m2Totales * currentMaterial.precioUnitario;
      cantidadCalculadaTexto = `${m2Totales.toFixed(2)} M² (${numericAncho}cm x ${numericAlto}cm x ${numericCantidad} u.)`;
    } else if (currentMaterial.unidadCalculo === 'METRO LINEAL') {
      subtotalBase = mlTotales * currentMaterial.precioUnitario;
      cantidadCalculadaTexto = `${mlTotales.toFixed(2)} ML (${numericAlto}cm x ${numericCantidad} u.)`;
    } else {
      subtotalBase = numericCantidad * currentMaterial.precioUnitario;
      cantidadCalculadaTexto = `${numericCantidad} Unidad(es)`;
    }
  }

  const totalFinal = Math.max(0, subtotalBase);

  // Generate Quotation Message Text
  const generateQuoteText = () => {
    if (!currentMaterial) return '';
    return `*SOLICITUD DE PRESUPUESTO - CMI DIGITAL*
-------------------------------
📌 *Rubro:* ${currentMaterial.rubro}
📦 *Producto / Insumo:* ${currentMaterial.nombre}
${currentMaterial.unidadCalculo !== 'UNIDAD' ? `📐 *Medidas:* ${numericAncho} cm (Ancho) x ${numericAlto} cm (Alto)\n` : ''}🔢 *Cantidad:* ${numericCantidad} unidad(es)
📊 *Medida Total:* ${cantidadCalculadaTexto}
-------------------------------
💰 *ESTIMADO APROXIMADO: $${totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*
-------------------------------
Hola CMI Digital! Quisiera consultar por este trabajo y coordinar la confirmación.`;
  };

  const handleSendWhatsApp = () => {
    const quoteText = generateQuoteText();
    const waUrl = getWhatsAppUrl(whatsapp, 'PRINT', quoteText);
    window.open(waUrl, '_blank');
  };

  const handleCopyQuote = () => {
    const quoteText = generateQuoteText();
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-poppins">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8 animate-fade-in">
        
        {/* Modal Header */}
        <div className="bg-[#FFD400] text-gray-900 px-6 py-5 flex items-center justify-between border-b-2 border-gray-900">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gray-900 text-[#FFD400] rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">
                Calculadora de Presupuestos
              </h3>
              <p className="text-xs font-bold text-gray-800">
                Cotizá tu impresión en tiempo real y enviá tu consulta directa por WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-900 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form & Inputs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Rubro Selector */}
            <div>
              <label className="block text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-2">
                1. Seleccionar Rubro
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['TODOS', 'IMPRENTA GRÁFICA', 'GRAN FORMATO'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRubroFilter(r);
                      const matching = materials.filter((m) => r === 'TODOS' || normalizeRubro(m.rubro) === normalizeRubro(r));
                      if (matching.length > 0) setSelectedMaterialId(matching[0].id);
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all border text-center ${
                      rubroFilter === r
                        ? 'bg-gray-900 text-[#FFD400] border-gray-900 shadow'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Selector */}
            <div>
              <label className="block text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-1">
                2. Insumo / Producto *
              </label>
              {loading ? (
                <div className="p-3 text-xs text-gray-500 animate-pulse bg-gray-50 rounded-xl border">
                  Cargando catálogo de materiales...
                </div>
              ) : (
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm font-extrabold text-gray-900 focus:outline-none focus:border-gray-900 uppercase bg-white shadow-sm"
                >
                  {filteredMaterials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} — [{m.rubro}] — ${m.precioUnitario.toLocaleString('es-AR')} / {m.unidadCalculo}
                    </option>
                  ))}
                </select>
              )}
              {currentMaterial && (
                <p className="text-[11px] text-gray-600 mt-1.5 font-medium">
                  Cálculo basado en: <strong className="text-gray-900">{currentMaterial.unidadCalculo}</strong>
                  {currentMaterial.observaciones && ` — ${currentMaterial.observaciones}`}
                </p>
              )}
            </div>

            {/* Dimensions Input */}
            <div className="bg-yellow-50/70 p-5 rounded-2xl border border-yellow-200 space-y-4">
              <span className="text-xs font-extrabold text-yellow-900 uppercase tracking-wider block flex items-center space-x-1">
                <Ruler className="w-4 h-4 text-yellow-800" />
                <span>3. Ingresar Medidas & Cantidad</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ancho (cm)</label>
                  <input
                    type="number"
                    min="1"
                    value={anchoCm}
                    onChange={(e) => setAnchoCm(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="100"
                    disabled={currentMaterial?.unidadCalculo === 'UNIDAD'}
                    className="w-full border border-gray-300 rounded-xl p-3 font-extrabold text-gray-900 focus:outline-none focus:border-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Alto / Largo (cm)</label>
                  <input
                    type="number"
                    min="1"
                    value={altoCm}
                    onChange={(e) => setAltoCm(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="100"
                    disabled={currentMaterial?.unidadCalculo === 'UNIDAD'}
                    className="w-full border border-gray-300 rounded-xl p-3 font-extrabold text-gray-900 focus:outline-none focus:border-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cantidad (U.) *</label>
                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value === '' ? 1 : Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl p-3 font-extrabold text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Calculated Quote & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-gray-900 text-white p-6 rounded-3xl border border-gray-800 shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#FFD400]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Resumen del Presupuesto</span>
                </span>
                <span className="bg-gray-800 text-gray-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                  Estimación Online
                </span>
              </div>

              {currentMaterial ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">
                      {currentMaterial.nombre}
                    </h4>
                    <span className="inline-block mt-1 bg-yellow-400 text-gray-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      Rubro: {currentMaterial.rubro}
                    </span>
                  </div>

                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-300">
                      <span>Precio Unitario:</span>
                      <span className="font-bold text-white">
                        ${currentMaterial.precioUnitario.toLocaleString('es-AR')} / {currentMaterial.unidadCalculo}
                      </span>
                    </div>

                    {currentMaterial.unidadCalculo !== 'UNIDAD' && (
                      <div className="flex justify-between text-gray-300">
                        <span>Medidas:</span>
                        <span className="font-bold text-white">{numericAncho} cm x {numericAlto} cm</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-300">
                      <span>Cantidad:</span>
                      <span className="font-bold text-white">{numericCantidad} unidad(es)</span>
                    </div>

                    <div className="flex justify-between text-yellow-300 pt-2 border-t border-gray-800 font-extrabold">
                      <span>Total Medida / Unid:</span>
                      <span>{cantidadCalculadaTexto}</span>
                    </div>
                  </div>

                  {/* Highlighted Total */}
                  <div className="bg-[#FFD400] text-gray-950 p-4 rounded-2xl shadow-lg space-y-0.5">
                    <span className="text-[11px] font-black uppercase tracking-wider block text-gray-800">
                      Total Estimado Aprox.
                    </span>
                    <div className="text-3xl font-black tracking-tight">
                      ${totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={handleSendWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase shadow transition-all flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Pedir este Presupuesto por WhatsApp</span>
                    </button>

                    <button
                      onClick={handleCopyQuote}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase transition-colors flex items-center justify-center space-x-2 border border-gray-700"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span>¡Copiado al Portapapeles!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-gray-300" />
                          <span>Copiar Cotización</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Seleccioná un material para calcular tu presupuesto.
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
