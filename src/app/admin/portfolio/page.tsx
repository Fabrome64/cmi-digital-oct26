'use client';

import { useState, useEffect } from 'react';
import { Plus, FolderKanban, Edit2, Trash2, X, ExternalLink, Star } from 'lucide-react';
import { WebPortfolioType } from '@/types';

import SuccessToast from '@/components/admin/SuccessToast';

export default function PortfolioAdminPage() {
  const [portfolio, setPortfolio] = useState<WebPortfolioType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WebPortfolioType | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    cliente: '',
    descripcion: '',
    imagenPrincipal: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    url: '',
    categoria: 'Inmobiliaria',
    tecnologias: 'Next.js, Tailwind, SQLite',
    destacado: true,
    orden: 1,
    activo: true,
  });

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio?all=true');
      if (res.ok) setPortfolio(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      titulo: '',
      cliente: '',
      descripcion: '',
      imagenPrincipal: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      url: '',
      categoria: 'Inmobiliaria',
      tecnologias: 'Next.js, Tailwind, SQLite',
      destacado: true,
      orden: portfolio.length + 1,
      activo: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: WebPortfolioType) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo || '',
      cliente: item.cliente || '',
      descripcion: item.descripcion || '',
      imagenPrincipal: item.imagenPrincipal || '',
      url: item.url || '',
      categoria: item.categoria || 'Inmobiliaria',
      tecnologias: item.tecnologias || '',
      destacado: Boolean(item.destacado),
      orden: item.orden || 0,
      activo: Boolean(item.activo),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar proyecto de portfolio?')) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('¡Operación realizada con éxito! Proyecto eliminado.');
        setTimeout(() => setToastMsg(null), 4000);
        fetchPortfolio();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/portfolio/${editingItem.id}` : '/api/portfolio';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setToastMsg(`¡Operación realizada con éxito! Proyecto ${editingItem ? 'actualizado' : 'creado'}.`);
        setTimeout(() => setToastMsg(null), 4000);
        fetchPortfolio();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Error al guardar: ${errData.error || 'No se pudo registrar el proyecto'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error de conexión: ${err?.message || 'No se pudo guardar'}`);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {toastMsg && (
        <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Gestor de Portfolio Web</h2>
          <p className="text-sm text-gray-500">Proyectos de diseño web (Sincronización instantánea en el sitio público)</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow transition-transform transform hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-5 h-5 text-gray-900" />
          <span>NUEVO PROYECTO</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando portfolio...</div>
      ) : portfolio.length === 0 ? (
        <div className="p-8 text-center text-gray-500 font-medium">No hay proyectos.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-44 bg-gray-100 relative">
                  <img src={item.imagenPrincipal} alt={item.titulo} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-[#0066FF] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {item.categoria}
                  </span>
                  {item.destacado && (
                    <span className="absolute top-3 left-3 bg-[#FFD400] text-gray-900 text-xs font-black px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-gray-900" />
                      <span>Destacado</span>
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-xs font-bold text-blue-600">Cliente: {item.cliente}</div>
                  <h4 className="font-extrabold text-lg text-gray-900">{item.titulo}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.descripcion}</p>
                  <div className="text-[11px] font-semibold text-gray-500 pt-1">
                    Tags: {item.tecnologias}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <span className={`text-xs font-bold ${item.activo ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.activo ? 'Activo en Web' : 'Inactivo'}
                </span>
                <div className="space-x-1">
                  <button onClick={() => handleOpenEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingItem ? 'Editar Proyecto Web' : 'Nuevo Proyecto Web'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Proyecto *</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cliente *</label>
                  <input
                    type="text"
                    required
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoría</label>
                  <input
                    type="text"
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Inmobiliaria, E-commerce, Salud"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">URL del Sitio</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://ejemplo.com"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tecnologías (separadas por coma)</label>
                  <input
                    type="text"
                    value={formData.tecnologias}
                    onChange={(e) => setFormData({ ...formData, tecnologias: e.target.value })}
                    placeholder="Next.js, Tailwind, SQLite"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">URL Imagen Principal *</label>
                <input
                  type="url"
                  required
                  value={formData.imagenPrincipal}
                  onChange={(e) => setFormData({ ...formData, imagenPrincipal: e.target.value })}
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

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Proyecto Destacado</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Visible en Sitio Web</span>
                </label>
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
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
