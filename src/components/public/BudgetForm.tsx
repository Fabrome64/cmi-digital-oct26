'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';

export default function BudgetForm() {
  const [formData, setFormData] = useState({
    clienteNombre: '',
    empresa: '',
    telefono: '',
    whatsapp: '',
    email: '',
    servicio: 'IMPRESIONES',
    producto: '',
    cantidad: 1,
    medidas: '',
    descripcion: '',
    archivo: '',
    observaciones: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(false);

    if (!formData.clienteNombre || !formData.servicio || !formData.descripcion) {
      setErrorMsg('Por favor completa Nombre, Servicio y Descripción del trabajo.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar presupuesto');
      }

      setSuccessMsg(true);
      setFormData({
        clienteNombre: '',
        empresa: '',
        telefono: '',
        whatsapp: '',
        email: '',
        servicio: 'IMPRESIONES',
        producto: '',
        cantidad: 1,
        medidas: '',
        descripcion: '',
        archivo: '',
        observaciones: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado al procesar tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="presupuesto" className="py-20 bg-gray-900 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#FFD400] text-gray-900 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-3 shadow">
            <FileText className="w-4 h-4" />
            <span>Cotizaciones Rápidas</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            SOLICITÁ TU PRESUPUESTO
          </h2>
          <p className="text-gray-400 mt-2 font-medium">
            Completa los datos de tu proyecto y nuestro equipo te enviará una propuesta personalizada.
          </p>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mb-8 p-6 bg-green-900/80 border-2 border-green-500 rounded-2xl flex items-start space-x-4 shadow-xl">
            <CheckCircle2 className="w-8 h-8 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xl font-extrabold text-white">¡Solicitud recibida!</h4>
              <p className="text-sm text-green-200 mt-1">
                Gracias por contactarte con CMI DIGITAL. Guardamos tu solicitud en nuestro sistema y nos comunicaremos con vos a la brevedad.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-900/80 border border-red-500 rounded-xl flex items-center space-x-3 text-red-200">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <span className="text-sm font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Budget Form Card */}
        <div className="bg-gray-800 p-8 sm:p-10 rounded-3xl border border-gray-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nombre completo */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  Nombre Completo <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  name="clienteNombre"
                  value={formData.clienteNombre}
                  onChange={handleChange}
                  placeholder="Ej. Carlos Gómez"
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
                />
              </div>

              {/* Empresa / Comercio */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  Empresa / Comercio
                </label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Ej. Distribuidora del Litoral"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Teléfono */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="03437-421589"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="5493437123456"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Servicio Seleccionado */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  Área de Servicio <span className="text-yellow-400">*</span>
                </label>
                <select
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD400] transition-colors"
                >
                  <option value="IMPRESIONES">Impresiones Gran Formato</option>
                  <option value="MARKETING">Marketing & Redes Sociales</option>
                  <option value="DISENO_WEB">Diseño & Desarrollo Web</option>
                </select>
              </div>

              {/* Producto / Especificación */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  Producto / Tipo de Trabajo
                </label>
                <input
                  type="text"
                  name="producto"
                  value={formData.producto}
                  onChange={handleChange}
                  placeholder="Ej. Cartel Lona Frontlight / Sitio Web"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Cantidad */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="cantidad"
                  min="1"
                  value={formData.cantidad}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD400] transition-colors"
                />
              </div>

              {/* Medidas (si corresponde) */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                  Medidas (Ancho x Alto en metros)
                </label>
                <input
                  type="text"
                  name="medidas"
                  value={formData.medidas}
                  onChange={handleChange}
                  placeholder="Ej. 3m x 1.5m"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
                />
              </div>
            </div>

            {/* Descripción del Trabajo */}
            <div>
              <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                Descripción Detallada del Proyecto <span className="text-yellow-400">*</span>
              </label>
              <textarea
                name="descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describí las características de tu necesidad, colores, fechas requeridas o cualquier detalle importante..."
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>

            {/* Archivo adjunto (Link/URL) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                Enlace a Diseño o Archivo Adjunto (Google Drive / WeTransfer / Dropbox)
              </label>
              <input
                type="url"
                name="archivo"
                value={formData.archivo}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>

            {/* Observaciones adicionales */}
            <div>
              <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2">
                Observaciones Adicionales
              </label>
              <input
                type="text"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Preferencias de horario para ser contactado, etc."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center space-x-3 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-black py-4 px-8 rounded-xl shadow-xl transition-transform transform hover:-translate-y-0.5 text-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-gray-900" />
                    <span>ENVIANDO SOLICITUD...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-gray-900" />
                    <span>SOLICITAR PRESUPUESTO</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
