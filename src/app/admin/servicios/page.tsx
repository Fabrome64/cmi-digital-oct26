'use client';

import { useState, useEffect } from 'react';
import { Plus, Share2, Edit2, Trash2, X } from 'lucide-react';
import { MarketingServiceType } from '@/types';

import SuccessToast from '@/components/admin/SuccessToast';

export default function MarketingServicesAdminPage() {
  const [services, setServices] = useState<MarketingServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSvc, setEditingSvc] = useState<MarketingServiceType | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    icono: 'Share2',
    precioOpcional: 'Consultar Paquete',
    destacado: true,
    activo: true,
  });

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) setServices(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingSvc(null);
    setFormData({
      titulo: '',
      descripcion: '',
      icono: 'Share2',
      precioOpcional: 'Consultar Paquete',
      destacado: true,
      activo: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc: MarketingServiceType) => {
    setEditingSvc(svc);
    setFormData({
      titulo: svc.titulo || '',
      descripcion: svc.descripcion || '',
      icono: svc.icono || 'Share2',
      precioOpcional: svc.precioOpcional || '',
      destacado: Boolean(svc.destacado),
      activo: Boolean(svc.activo),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar servicio de marketing?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('¡Operación realizada con éxito! Servicio eliminado.');
        setTimeout(() => setToastMsg(null), 4000);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSvc ? `/api/services/${editingSvc.id}` : '/api/services';
      const method = editingSvc ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setToastMsg(`¡Operación realizada con éxito! Servicio ${editingSvc ? 'actualizado' : 'creado'}.`);
        setTimeout(() => setToastMsg(null), 4000);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {toastMsg && (
        <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Gestor de Servicios de Marketing</h2>
          <p className="text-sm text-gray-500">Servicios y paquetes dinámicos visibles en la sección de redes sociales</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow transition-transform transform hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-5 h-5 text-gray-900" />
          <span>NUEVO SERVICIO</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando servicios...</div>
      ) : services.length === 0 ? (
        <div className="p-8 text-center text-gray-500 font-medium">No hay servicios.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => (
            <div key={svc.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-cyan-50 text-[#00ACC1] rounded-xl flex items-center justify-center mb-3">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-lg text-gray-900 mb-2">{svc.titulo}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{svc.descripcion}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                  {svc.precioOpcional || 'A cotizar'}
                </span>
                <div className="space-x-1">
                  <button onClick={() => handleOpenEdit(svc)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(svc.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingSvc ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Servicio *</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Precio Opcional / Leyenda</label>
                <input
                  type="text"
                  value={formData.precioOpcional}
                  onChange={(e) => setFormData({ ...formData, precioOpcional: e.target.value })}
                  placeholder="Ej. Desde $45.000 / mes"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
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
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
