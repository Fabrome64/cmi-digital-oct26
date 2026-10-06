'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Edit2, Trash2, X, Tag } from 'lucide-react';
import { PrintProductType } from '@/types';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<PrintProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<PrintProductType | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'Banners',
    imagen: 'https://images.unsplash.com/photo-1542744094-3a3121699496?auto=format&fit=crop&w=800&q=80',
    precio: 15000,
    unidad: 'm2',
    medidas: 'A medida',
    destacado: true,
    activo: true,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/print-products');
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProd(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: 'Banners',
      imagen: 'https://images.unsplash.com/photo-1542744094-3a3121699496?auto=format&fit=crop&w=800&q=80',
      precio: 15000,
      unidad: 'm2',
      medidas: 'A medida',
      destacado: true,
      activo: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: PrintProductType) => {
    setEditingProd(prod);
    setFormData({
      nombre: prod.nombre || '',
      descripcion: prod.descripcion || '',
      categoria: prod.categoria || 'Banners',
      imagen: prod.imagen || '',
      precio: prod.precio || 0,
      unidad: prod.unidad || 'm2',
      medidas: prod.medidas || '',
      destacado: Boolean(prod.destacado),
      activo: Boolean(prod.activo),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar producto de catálogo?')) return;
    try {
      const res = await fetch(`/api/print-products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProd ? `/api/print-products/${editingProd.id}` : '/api/print-products';
      const method = editingProd ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Catálogo de Productos & Impresiones</h2>
          <p className="text-sm text-gray-500">Gestión de artículos que se muestran en el sitio público</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow transition-transform transform hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-5 h-5 text-gray-900" />
          <span>NUEVO PRODUCTO</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center text-gray-500 font-medium">No hay productos.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-40 bg-gray-100 relative">
                  <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-gray-900 text-[#FFD400] text-xs font-bold px-2.5 py-1 rounded-full">
                    {prod.categoria}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="font-extrabold text-lg text-gray-900">{prod.nombre}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{prod.descripcion}</p>
                  <div className="text-lg font-black text-gray-900 pt-2">
                    ${prod.precio?.toLocaleString('es-AR')} / {prod.unidad}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <span className={`text-xs font-bold ${prod.activo ? 'text-green-600' : 'text-gray-400'}`}>
                  {prod.activo ? 'Activo en Web' : 'Inactivo'}
                </span>
                <div className="space-x-1">
                  <button onClick={() => handleOpenEdit(prod)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
                {editingProd ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="Banners">Banners</option>
                    <option value="Vinilos">Vinilos</option>
                    <option value="Lonas">Lonas</option>
                    <option value="Cartelería">Cartelería</option>
                    <option value="Ploteos">Ploteos</option>
                    <option value="Microperforados">Microperforados</option>
                    <option value="Vehículos">Vehículos</option>
                    <option value="Vidrieras">Vidrieras</option>
                    <option value="Señalética">Señalética</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unidad</label>
                  <input
                    type="text"
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Precio ($)</label>
                  <input
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Medidas Sugeridas</label>
                  <input
                    type="text"
                    value={formData.medidas}
                    onChange={(e) => setFormData({ ...formData, medidas: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">URL Imagen Principal</label>
                <input
                  type="url"
                  required
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción</label>
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
                  <span>Producto Destacado</span>
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
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
