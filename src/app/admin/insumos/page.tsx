'use client';

import { useState, useEffect } from 'react';
import { Plus, Box, AlertTriangle, Edit2, Trash2, X } from 'lucide-react';
import { SupplyType } from '@/types';

export default function SuppliesPage() {
  const [supplies, setSupplies] = useState<SupplyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<SupplyType | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Vinilos',
    proveedor: '',
    unidad: 'Bobina',
    stock: 5,
    stockMinimo: 3,
    costo: 0,
    ubicacion: '',
  });

  const fetchSupplies = async () => {
    try {
      const res = await fetch('/api/supplies');
      if (res.ok) setSupplies(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const handleOpenCreate = () => {
    setEditingSupply(null);
    setFormData({
      nombre: '',
      categoria: 'Vinilos',
      proveedor: '',
      unidad: 'Bobina',
      stock: 5,
      stockMinimo: 3,
      costo: 0,
      ubicacion: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: SupplyType) => {
    setEditingSupply(sup);
    setFormData({
      nombre: sup.nombre || '',
      categoria: sup.categoria || 'Vinilos',
      proveedor: sup.proveedor || '',
      unidad: sup.unidad || 'Bobina',
      stock: sup.stock || 0,
      stockMinimo: sup.stockMinimo || 0,
      costo: sup.costo || 0,
      ubicacion: sup.ubicacion || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar insumo?')) return;
    try {
      const res = await fetch(`/api/supplies/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSupplies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSupply ? `/api/supplies/${editingSupply.id}` : '/api/supplies';
      const method = editingSupply ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSupplies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const lowStockCount = supplies.filter((s) => s.stock <= s.stockMinimo).length;

  return (
    <div className="space-y-6 font-poppins">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Control de Insumos</h2>
          <p className="text-sm text-gray-500">Inventario de tintas, lonas, vinilos y estructuras de imprenta</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow transition-transform transform hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-5 h-5 text-gray-900" />
          <span>NUEVO INSUMO</span>
        </button>
      </div>

      {/* Stock Alert */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center space-x-3 text-amber-900 text-sm font-bold">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Atención: Hay {lowStockCount} insumo(s) alcanzando o superando el stock mínimo.</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando inventario...</div>
        ) : supplies.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No hay insumos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Insumo / Categoría</th>
                  <th className="p-4">Proveedor</th>
                  <th className="p-4">Stock Actual</th>
                  <th className="p-4">Stock Mínimo</th>
                  <th className="p-4">Costo ($)</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {supplies.map((sup) => {
                  const isLow = sup.stock <= sup.stockMinimo;
                  return (
                    <tr key={sup.id} className={`hover:bg-gray-50/50 transition-colors ${isLow ? 'bg-amber-50/40' : ''}`}>
                      <td className="p-4">
                        <div className="font-extrabold text-gray-900">{sup.nombre}</div>
                        <div className="text-xs text-gray-500 font-semibold">{sup.categoria}</div>
                      </td>
                      <td className="p-4 text-xs font-medium text-gray-600">{sup.proveedor || '-'}</td>
                      <td className={`p-4 font-black ${isLow ? 'text-amber-700 text-base' : 'text-gray-900'}`}>
                        {sup.stock} {sup.unidad}
                      </td>
                      <td className="p-4 text-xs font-bold text-gray-500">
                        {sup.stockMinimo} {sup.unidad}
                      </td>
                      <td className="p-4 font-extrabold text-gray-900">
                        ${sup.costo.toLocaleString('es-AR')}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                          isLow ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isLow ? 'Bajo Stock' : 'Disponible'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(sup)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sup.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingSupply ? 'Editar Insumo' : 'Nuevo Insumo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Insumo *</label>
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
                    <option value="Vinilos">Vinilos</option>
                    <option value="Tintas">Tintas</option>
                    <option value="Lonas">Lonas</option>
                    <option value="Estructuras">Estructuras</option>
                    <option value="Embalaje">Embalaje</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Proveedor</label>
                  <input
                    type="text"
                    value={formData.proveedor}
                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Actual *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Mínimo *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unidad</label>
                  <input
                    type="text"
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                    placeholder="Bobina, Litro, m2"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Costo ($)</label>
                  <input
                    type="number"
                    value={formData.costo}
                    onChange={(e) => setFormData({ ...formData, costo: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    placeholder="Estante A-1"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
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
