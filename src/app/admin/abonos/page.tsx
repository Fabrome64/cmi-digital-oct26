'use client';

import { useState, useEffect } from 'react';
import { Plus, CreditCard, AlertCircle, CheckCircle2, Clock, XCircle, Edit2, Trash2, X } from 'lucide-react';
import { WebSubscriptionType, ClientType } from '@/types';

import SuccessToast from '@/components/admin/SuccessToast';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<WebSubscriptionType[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<WebSubscriptionType | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNombre: '',
    sitio: '',
    dominio: '',
    hosting: 'Cloud VPS CMI',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaVencimiento: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    importe: 15000,
    periodicidad: 'Mensual',
    estado: 'Activo',
    observaciones: '',
  });

  const fetchData = async () => {
    try {
      const [resSub, resCli] = await Promise.all([
        fetch('/api/web-subscriptions'),
        fetch('/api/clients'),
      ]);
      if (resSub.ok) setSubscriptions(await resSub.json());
      if (resCli.ok) setClients(await resCli.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSub(null);
    setFormData({
      clienteId: '',
      clienteNombre: '',
      sitio: '',
      dominio: '',
      hosting: 'Cloud VPS CMI',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaVencimiento: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      importe: 15000,
      periodicidad: 'Mensual',
      estado: 'Activo',
      observaciones: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: WebSubscriptionType) => {
    setEditingSub(sub);
    setFormData({
      clienteId: sub.clienteId || '',
      clienteNombre: sub.clienteNombre || '',
      sitio: sub.sitio || '',
      dominio: sub.dominio || '',
      hosting: sub.hosting || 'Cloud VPS CMI',
      fechaInicio: new Date(sub.fechaInicio).toISOString().split('T')[0],
      fechaVencimiento: new Date(sub.fechaVencimiento).toISOString().split('T')[0],
      importe: sub.importe || 0,
      periodicidad: sub.periodicidad || 'Mensual',
      estado: sub.estado || 'Activo',
      observaciones: sub.observaciones || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar abono web?')) return;
    try {
      const res = await fetch(`/api/web-subscriptions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('¡Operación realizada con éxito! Abono eliminado.');
        setTimeout(() => setToastMsg(null), 4000);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSub ? `/api/web-subscriptions/${editingSub.id}` : '/api/web-subscriptions';
      const method = editingSub ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setToastMsg(`¡Operación realizada con éxito! Abono ${editingSub ? 'actualizado' : 'creado'}.`);
        setTimeout(() => setToastMsg(null), 4000);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSubs = filterState === 'Todos'
    ? subscriptions
    : subscriptions.filter((s) => s.estado === filterState);

  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'Activo':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Próximo a vencer':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Vencido':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Suspendido':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {toastMsg && (
        <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Abonos Sitios Web</h2>
          <p className="text-sm text-gray-500">Control de vencimientos de hosting y mantenimiento mensual</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow transition-transform transform hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-5 h-5 text-gray-900" />
          <span>NUEVO ABONO</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['Todos', 'Activo', 'Próximo a vencer', 'Vencido', 'Suspendido'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterState(st)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
              filterState === st
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
          <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando abonos...</div>
        ) : filteredSubs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No se encontraron abonos en este estado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Cliente / Sitio</th>
                  <th className="p-4">Dominio & Hosting</th>
                  <th className="p-4">Vencimiento</th>
                  <th className="p-4">Importe</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-gray-900">{sub.clienteNombre}</div>
                      <div className="text-xs text-blue-600 font-semibold">{sub.sitio}</div>
                    </td>
                    <td className="p-4 text-xs font-medium text-gray-600">
                      <div>🌐 {sub.dominio || 'Sin dominio'}</div>
                      <div className="text-gray-400">☁️ {sub.hosting || 'Cloud VPS CMI'}</div>
                    </td>
                    <td className="p-4 text-xs font-semibold text-gray-800">
                      {new Date(sub.fechaVencimiento).toLocaleDateString('es-AR')}
                    </td>
                    <td className="p-4 font-black text-gray-900">
                      ${sub.importe.toLocaleString('es-AR')} / {sub.periodicidad}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${getBadgeStyle(sub.estado)}`}>
                        {sub.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(sub)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingSub ? 'Editar Abono Web' : 'Nuevo Abono Web'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={formData.clienteNombre}
                  onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value.toUpperCase() })}
                  placeholder="Ej. Inmobiliaria Feliciano"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Sitio *</label>
                  <input
                    type="text"
                    required
                    value={formData.sitio}
                    onChange={(e) => setFormData({ ...formData, sitio: e.target.value.toUpperCase() })}
                    placeholder="Ej. Portal Inmobiliario"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dominio</label>
                  <input
                    type="text"
                    value={formData.dominio}
                    onChange={(e) => setFormData({ ...formData, dominio: e.target.value.toUpperCase() })}
                    placeholder="ejemplo.com"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha Vencimiento *</label>
                  <input
                    type="date"
                    required
                    value={formData.fechaVencimiento}
                    onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Importe ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.importe}
                    onChange={(e) => setFormData({ ...formData, importe: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Periodicidad</label>
                  <select
                    value={formData.periodicidad}
                    onChange={(e) => setFormData({ ...formData, periodicidad: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="Mensual">Mensual</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Próximo a vencer">Próximo a vencer</option>
                    <option value="Vencido">Vencido</option>
                    <option value="Suspendido">Suspendido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
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
                  Guardar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
