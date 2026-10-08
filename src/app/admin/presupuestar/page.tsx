'use client';

import { useState, useEffect } from 'react';
import {
  Calculator, Plus, Search, Edit2, Trash2, Copy, Check, Filter,
  Printer, Layers, Ruler, DollarSign, RefreshCw, X, Sparkles
} from 'lucide-react';
import SuccessToast from '@/components/admin/SuccessToast';

interface BudgetMaterial {
  id: string;
  nombre: string;
  rubro: 'IMPRENTA GRÁFICA' | 'GRAN FORMATO';
  unidadCalculo: 'METRO CUADRADO' | 'METRO LINEAL' | 'UNIDAD';
  precioUnitario: number;
  observaciones?: string | null;
}

export default function PresupuestarPage() {
  const [materials, setMaterials] = useState<BudgetMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calculator' | 'materials'>('calculator');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter & Search
  const [rubroFilter, setRubroFilter] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculator State
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [anchoCm, setAnchoCm] = useState<number | ''>(100);
  const [altoCm, setAltoCm] = useState<number | ''>(100);
  const [cantidad, setCantidad] = useState<number>(1);
  const [adicionales, setAdicionales] = useState<number | ''>(0);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number | ''>(0);

  // Material Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<BudgetMaterial | null>(null);
  const [materialForm, setMaterialForm] = useState({
    nombre: '',
    rubro: 'GRAN FORMATO' as 'IMPRENTA GRÁFICA' | 'GRAN FORMATO',
    unidadCalculo: 'METRO CUADRADO' as 'METRO CUADRADO' | 'METRO LINEAL' | 'UNIDAD',
    precioUnitario: 0,
    observaciones: '',
  });

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/budget-materials');
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
        if (data.length > 0 && !selectedMaterialId) {
          setSelectedMaterialId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching budget materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    const matchesRubro = rubroFilter === 'TODOS' || m.rubro === rubroFilter;
    const matchesSearch =
      m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rubro.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRubro && matchesSearch;
  });

  // Selected Material for Calculation
  const currentMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  // Calculation Logic
  const numericAncho = Number(anchoCm) || 0;
  const numericAlto = Number(altoCm) || 0;
  const numericCantidad = Math.max(1, Number(cantidad) || 1);
  const numericAdicionales = Number(adicionales) || 0;
  const numericDescuento = Number(descuentoPorcentaje) || 0;

  // Measure conversions
  const anchoM = numericAncho / 100;
  const altoM = numericAlto / 100;
  const m2PorPieza = anchoM * altoM;
  const m2Totales = m2PorPieza * numericCantidad;
  const mlPorPieza = altoM; // Longitud / alto en metros
  const mlTotales = mlPorPieza * numericCantidad;

  let subtotalBase = 0;
  let unidadEtiqueta = '';
  let cantidadCalculadaTexto = '';

  if (currentMaterial) {
    if (currentMaterial.unidadCalculo === 'METRO CUADRADO') {
      subtotalBase = m2Totales * currentMaterial.precioUnitario;
      unidadEtiqueta = 'M²';
      cantidadCalculadaTexto = `${m2Totales.toFixed(2)} M² (${numericAncho}cm x ${numericAlto}cm x ${numericCantidad} u.)`;
    } else if (currentMaterial.unidadCalculo === 'METRO LINEAL') {
      subtotalBase = mlTotales * currentMaterial.precioUnitario;
      unidadEtiqueta = 'ML';
      cantidadCalculadaTexto = `${mlTotales.toFixed(2)} Metro(s) Lineal(es) (${numericAlto}cm x ${numericCantidad} u.)`;
    } else {
      subtotalBase = numericCantidad * currentMaterial.precioUnitario;
      unidadEtiqueta = 'UNID';
      cantidadCalculadaTexto = `${numericCantidad} Unidad(es)`;
    }
  }

  const subtotalConAdicionales = subtotalBase + numericAdicionales;
  const montoDescuento = (subtotalConAdicionales * numericDescuento) / 100;
  const totalFinal = Math.max(0, subtotalConAdicionales - montoDescuento);

  // Copy Quotation text to Clipboard
  const handleCopyQuote = () => {
    if (!currentMaterial) return;
    const text = `*PRESUPUESTO CMI DIGITAL*
-------------------------------
📌 *Rubro:* ${currentMaterial.rubro}
📦 *Insumo / Trabajo:* ${currentMaterial.nombre}
📐 *Medidas:* ${numericAncho} cm (Ancho) x ${numericAlto} cm (Alto)
🔢 *Cantidad:* ${numericCantidad} unidad(es)
📊 *Medida Total:* ${cantidadCalculadaTexto}
💲 *Precio Base:* $${currentMaterial.precioUnitario.toLocaleString('es-AR')} por ${currentMaterial.unidadCalculo}
${numericAdicionales > 0 ? `➕ *Adicionales:* $${numericAdicionales.toLocaleString('es-AR')}\n` : ''}${numericDescuento > 0 ? `🏷️ *Descuento (${numericDescuento}%):* -$${montoDescuento.toLocaleString('es-AR')}\n` : ''}-------------------------------
💰 *TOTAL ESTIMADO: $${totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*
-------------------------------
*Validez:* 10 días. Sujeto a confirmación final.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Material Modal Handlers
  const handleOpenCreateMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm({
      nombre: '',
      rubro: 'GRAN FORMATO',
      unidadCalculo: 'METRO CUADRADO',
      precioUnitario: 0,
      observaciones: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditMaterial = (m: BudgetMaterial) => {
    setEditingMaterial(m);
    setMaterialForm({
      nombre: m.nombre,
      rubro: m.rubro,
      unidadCalculo: m.unidadCalculo,
      precioUnitario: m.precioUnitario,
      observaciones: m.observaciones || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este insumo de presupuestación?')) return;
    try {
      const res = await fetch(`/api/budget-materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('¡Insumo eliminado correctamente!');
        setTimeout(() => setToastMsg(null), 4000);
        fetchMaterials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMaterial ? `/api/budget-materials/${editingMaterial.id}` : '/api/budget-materials';
      const method = editingMaterial ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialForm),
      });

      if (res.ok) {
        setToastMsg(`¡Insumo ${editingMaterial ? 'actualizado' : 'creado'} con éxito!`);
        setTimeout(() => setToastMsg(null), 4000);
        setIsModalOpen(false);
        fetchMaterials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-poppins pb-12">
      {toastMsg && <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-[#0066FF]" />
            <span>Presupuestar & Calculadora</span>
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Cotizador instantáneo de Imprenta Gráfica y Gran Formato por M², Metro Lineal o Unidad.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              activeTab === 'calculator'
                ? 'bg-[#FFD400] text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculadora</span>
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              activeTab === 'materials'
                ? 'bg-[#FFD400] text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Insumos ({materials.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CALCULATOR & QUOTE GENERATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Inputs */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-[#0066FF]" />
                <span>Datos de la Cotización</span>
              </h2>
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                {currentMaterial ? currentMaterial.rubro : 'GRAN FORMATO'}
              </span>
            </div>

            {/* Rubro Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">1. Filtrar por Rubro</label>
              <div className="grid grid-cols-3 gap-2">
                {['TODOS', 'GRAN FORMATO', 'IMPRENTA GRÁFICA'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRubroFilter(r)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border text-center ${
                      rubroFilter === r
                        ? 'bg-[#0066FF] text-white border-[#0066FF] shadow'
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
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                2. Seleccionar Insumo / Material *
              </label>
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm font-extrabold text-gray-900 focus:outline-none focus:border-[#0066FF] uppercase"
              >
                {filteredMaterials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} — [{m.rubro}] — ${m.precioUnitario.toLocaleString('es-AR')} / {m.unidadCalculo}
                  </option>
                ))}
              </select>
              {currentMaterial && (
                <p className="text-[11px] text-gray-500 mt-1 italic">
                  * Tipo de cálculo: <strong className="text-blue-600">{currentMaterial.unidadCalculo}</strong>
                  {currentMaterial.observaciones && ` — ${currentMaterial.observaciones}`}
                </p>
              )}
            </div>

            {/* Dimensions Input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ancho (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={anchoCm}
                  onChange={(e) => setAnchoCm(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej. 100"
                  disabled={currentMaterial?.unidadCalculo === 'UNIDAD'}
                  className="w-full border border-gray-300 rounded-xl p-3 font-extrabold text-gray-900 focus:outline-none focus:border-[#0066FF] disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Alto / Largo (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={altoCm}
                  onChange={(e) => setAltoCm(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej. 200"
                  disabled={currentMaterial?.unidadCalculo === 'UNIDAD'}
                  className="w-full border border-gray-300 rounded-xl p-3 font-extrabold text-gray-900 focus:outline-none focus:border-[#0066FF] disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cantidad (U.) *</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value === '' ? 1 : Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl p-3 font-extrabold text-gray-900 focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            {/* Adjustments (Adicionales y Descuento) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mano de Obra / Adicional ($)</label>
                <input
                  type="number"
                  min="0"
                  value={adicionales}
                  onChange={(e) => setAdicionales(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-xl p-3 font-bold text-gray-900 focus:outline-none focus:border-[#0066FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descuento (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={descuentoPorcentaje}
                  onChange={(e) => setDescuentoPorcentaje(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-xl p-3 font-bold text-gray-900 focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quotation Result Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-900 text-white p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD400]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Resultado del Presupuesto</span>
                </span>
                <span className="bg-gray-800 text-gray-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                  Cotización CMI
                </span>
              </div>

              {currentMaterial ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      {currentMaterial.nombre}
                    </h3>
                    <p className="text-xs text-yellow-400 font-bold uppercase mt-0.5">
                      Rubro: {currentMaterial.rubro}
                    </p>
                  </div>

                  <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-300">
                      <span>Precio Unitario Base:</span>
                      <span className="font-bold text-white">
                        ${currentMaterial.precioUnitario.toLocaleString('es-AR')} / {currentMaterial.unidadCalculo}
                      </span>
                    </div>

                    {currentMaterial.unidadCalculo !== 'UNIDAD' && (
                      <div className="flex justify-between text-gray-300">
                        <span>Medidas por pieza:</span>
                        <span className="font-bold text-white">{numericAncho} cm x {numericAlto} cm</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-300">
                      <span>Cantidad de Piezas:</span>
                      <span className="font-bold text-white">{numericCantidad} u.</span>
                    </div>

                    <div className="flex justify-between text-yellow-300 pt-1 border-t border-gray-800 font-extrabold">
                      <span>Cálculo Total Medida:</span>
                      <span>{cantidadCalculadaTexto}</span>
                    </div>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="space-y-1.5 text-xs text-gray-400 border-t border-gray-800 pt-3">
                    <div className="flex justify-between">
                      <span>Subtotal Insumo:</span>
                      <span className="font-semibold text-gray-200">${subtotalBase.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {numericAdicionales > 0 && (
                      <div className="flex justify-between">
                        <span>Adicionales / Mano de Obra:</span>
                        <span className="font-semibold text-gray-200">+${numericAdicionales.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {numericDescuento > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Descuento ({numericDescuento}%):</span>
                        <span className="font-semibold">-${montoDescuento.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                  </div>

                  {/* Grand Total Highlight */}
                  <div className="bg-[#FFD400] text-gray-900 p-5 rounded-2xl shadow-lg space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider block text-gray-800">
                      Importe Total Recomendado
                    </span>
                    <div className="text-3xl font-black tracking-tight">
                      ${totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <button
                    onClick={handleCopyQuote}
                    className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase shadow transition-transform transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-300" />
                        <span>¡Cotización Copiada al Portapapeles!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-white" />
                        <span>Copiar Resumen para WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Seleccioná o registrá un insumo para calcular el presupuesto.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATERIAL REGISTRATION & MANAGEMENT */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-800">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Catálogo de Insumos para Presupuestar</h3>
                <p className="text-xs text-gray-500">Configurá los precios por M², Metro Lineal o Unidad para cada material.</p>
              </div>
            </div>

            <button
              onClick={handleOpenCreateMaterial}
              className="bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-black px-5 py-3 rounded-2xl text-xs uppercase shadow flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Insumo / Material</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="Buscar por nombre o rubro..."
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#0066FF] uppercase"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={rubroFilter}
                onChange={(e) => setRubroFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-extrabold focus:outline-none focus:border-[#0066FF]"
              >
                <option value="TODOS">Todos los Rubros</option>
                <option value="GRAN FORMATO">Gran Formato</option>
                <option value="IMPRENTA GRÁFICA">Imprenta Gráfica</option>
              </select>
            </div>
          </div>

          {/* Materials Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400 animate-pulse font-medium">
                Cargando catálogo de insumos...
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No se encontraron insumos registrados en este rubro.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900 text-white text-[11px] font-extrabold uppercase tracking-wider">
                      <th className="p-4 pl-6">Nombre del Insumo / Material</th>
                      <th className="p-4">Rubro</th>
                      <th className="p-4">Unidad de Cálculo</th>
                      <th className="p-4">Precio Unitario ($)</th>
                      <th className="p-4">Observaciones</th>
                      <th className="p-4 pr-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredMaterials.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 pl-6 font-extrabold text-gray-900 uppercase">{m.nombre}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            m.rubro === 'GRAN FORMATO' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {m.rubro}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                            {m.unidadCalculo}
                          </span>
                        </td>
                        <td className="p-4 font-black text-green-700">
                          ${m.precioUnitario.toLocaleString('es-AR')}
                        </td>
                        <td className="p-4 text-xs text-gray-500 uppercase">{m.observaciones || '-'}</td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditMaterial(m)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar Insumo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(m.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar Insumo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT MATERIAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingMaterial ? 'Editar Insumo de Presupuesto' : 'Nuevo Insumo para Presupuestar'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitMaterial} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Material / Trabajo *</label>
                <input
                  type="text"
                  required
                  value={materialForm.nombre}
                  onChange={(e) => setMaterialForm({ ...materialForm, nombre: e.target.value.toUpperCase() })}
                  placeholder="Ej. LONA FRONT 440G / FOLLETOS A5"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rubro *</label>
                  <select
                    value={materialForm.rubro}
                    onChange={(e) => setMaterialForm({ ...materialForm, rubro: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] font-semibold text-gray-800"
                  >
                    <option value="GRAN FORMATO">GRAN FORMATO</option>
                    <option value="IMPRENTA GRÁFICA">IMPRENTA GRÁFICA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unidad de Cálculo *</label>
                  <select
                    value={materialForm.unidadCalculo}
                    onChange={(e) => setMaterialForm({ ...materialForm, unidadCalculo: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] font-semibold text-gray-800"
                  >
                    <option value="METRO CUADRADO">METRO CUADRADO ($/m²)</option>
                    <option value="METRO LINEAL">METRO LINEAL ($/ML)</option>
                    <option value="UNIDAD">UNIDAD ($/Unid)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Precio Unitario ($) *</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={materialForm.precioUnitario}
                  onChange={(e) => setMaterialForm({ ...materialForm, precioUnitario: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-xl p-3 font-bold text-gray-900 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={materialForm.observaciones}
                  onChange={(e) => setMaterialForm({ ...materialForm, observaciones: e.target.value.toUpperCase() })}
                  placeholder="Detalles sobre resolución, laminado u opciones..."
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] uppercase"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold rounded-xl text-sm shadow"
                >
                  Guardar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
