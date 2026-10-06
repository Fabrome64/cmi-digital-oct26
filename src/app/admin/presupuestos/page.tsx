'use client';

import { useState, useEffect } from 'react';
import { FileText, Eye, Edit2, Trash2, X, Check, Clock } from 'lucide-react';
import { BudgetType } from '@/types';

export default function PresupuestosAdminPage() {
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>('Todos');
  const [selectedBudget, setSelectedBudget] = useState<BudgetType | null>(null);

  const [editStatus, setEditStatus] = useState('');
  const [editMonto, setEditMonto] = useState(0);
  const [editObs, setEditObs] = useState('');

  const fetchBudgets = async () => {
    try {
      const res = await fetch('/api/budgets');
      if (res.ok) setBudgets(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleOpenDetail = (b: BudgetType) => {
    setSelectedBudget(b);
    setEditStatus(b.estado);
    setEditMonto(b.monto || 0);
    setEditObs(b.observaciones || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudget) return;

    try {
      const res = await fetch(`/api/budgets/${selectedBudget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: editStatus,
          monto: editMonto,
          observaciones: editObs,
        }),
      });

      if (res.ok) {
        setSelectedBudget(null);
        fetchBudgets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar presupuesto?')) return;
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = activeStatus === 'Todos'
    ? budgets
    : budgets.filter((b) => b.estado === activeStatus);

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Nuevo':
        return 'bg-[#0066FF] text-white';
      case 'En análisis':
        return 'bg-cyan-100 text-cyan-800';
      case 'Presupuestado':
        return 'bg-purple-100 text-purple-800';
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Solicitudes de Presupuesto</h2>
        <p className="text-sm text-gray-500">Gestión de cotizaciones recibidas desde la aplicación web</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['Todos', 'Nuevo', 'En análisis', 'Presupuestado', 'Aprobado', 'Rechazado', 'Finalizado'].map((st) => (
          <button
            key={st}
            onClick={() => setActiveStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
              activeStatus === st
                ? 'bg-gray-900 text-[#FFD400] border-gray-900 shadow'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando presupuestos...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No hay solicitudes en este estado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Cliente / Contacto</th>
                  <th className="p-4">Servicio / Producto</th>
                  <th className="p-4">Detalles</th>
                  <th className="p-4">Monto ($)</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-xs font-bold text-gray-700">
                      {new Date(b.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-gray-900">{b.clienteNombre}</div>
                      <div className="text-xs text-gray-500 font-medium">{b.whatsapp || b.email || '-'}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <span className="font-extrabold text-[#0066FF] uppercase block">{b.servicio}</span>
                      <span className="text-gray-600 font-medium">{b.producto || 'General'}</span>
                    </td>
                    <td className="p-4 text-xs text-gray-600 max-w-xs line-clamp-2">
                      {b.descripcion}
                    </td>
                    <td className="p-4 font-black text-gray-900">
                      ${(b.monto || 0).toLocaleString('es-AR')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${getStatusBadge(b.estado)}`}>
                        {b.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetail(b)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Ver & Actualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

      {/* Modal Detail / Edit Status */}
      {selectedBudget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">Detalle de Presupuesto</h3>
              <button onClick={() => setSelectedBudget(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-2xl border">
              <div>
                <span className="font-bold text-gray-500 text-xs uppercase">Cliente:</span>
                <p className="font-extrabold text-gray-900 text-base">{selectedBudget.clienteNombre} ({selectedBudget.empresa || 'Particular'})</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="font-bold text-gray-500">Tel/WA:</span> {selectedBudget.whatsapp || selectedBudget.telefono}</div>
                <div><span className="font-bold text-gray-500">Email:</span> {selectedBudget.email}</div>
              </div>
              <div className="border-t pt-2">
                <span className="font-bold text-gray-500 text-xs uppercase">Servicio:</span>
                <p className="font-bold text-[#0066FF]">{selectedBudget.servicio} - {selectedBudget.producto || ''}</p>
                {selectedBudget.medidas && <p className="text-xs text-gray-600 font-medium">Medidas: {selectedBudget.medidas} (Cant: {selectedBudget.cantidad})</p>}
              </div>
              <div>
                <span className="font-bold text-gray-500 text-xs uppercase">Descripción:</span>
                <p className="text-gray-800 font-medium text-xs leading-relaxed">{selectedBudget.descripcion}</p>
              </div>
              {selectedBudget.archivo && (
                <div>
                  <span className="font-bold text-gray-500 text-xs uppercase">Adjunto:</span>
                  <a href={selectedBudget.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold block text-xs underline">
                    {selectedBudget.archivo}
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-sm pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estado de la Solicitud</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="En análisis">En análisis</option>
                    <option value="Presupuestado">Presupuestado</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monto Presupuestado ($)</label>
                  <input
                    type="number"
                    value={editMonto}
                    onChange={(e) => setEditMonto(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observaciones Internas</label>
                <textarea
                  rows={2}
                  value={editObs}
                  onChange={(e) => setEditObs(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedBudget(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold rounded-xl text-sm shadow"
                >
                  Actualizar Estado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
