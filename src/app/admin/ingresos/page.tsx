'use client';

import { useState, useEffect } from 'react';
import { Plus, Wallet, Edit2, Trash2, X, DollarSign, Calendar, Tag, User, TrendingUp } from 'lucide-react';
import { IncomeType, ClientType } from '@/types';
import SuccessToast from '@/components/admin/SuccessToast';

const SERVICE_OPTIONS = [
  'SITIO WEB',
  'MARKETING REDES',
  'AUSPICIO FELICHOGUIA',
  'IMPRENTA GRAFICA',
  'IMPRENTA GRAN FORMATO',
];

export default function IncomesAdminPage() {
  const [incomes, setIncomes] = useState<IncomeType[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeType | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNombre: '',
    servicio: 'SITIO WEB',
    fecha: new Date().toISOString().split('T')[0],
    importe: 0,
    observaciones: '',
  });

  const fetchData = async () => {
    try {
      const [resInc, resCli] = await Promise.all([
        fetch('/api/incomes'),
        fetch('/api/clients'),
      ]);

      if (resInc.ok) setIncomes(await resInc.json());
      if (resCli.ok) setClients(await resCli.json());
    } catch (err) {
      console.error('Error cargando ingresos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingIncome(null);
    setFormData({
      clienteId: clients.length > 0 ? clients[0].id : '',
      clienteNombre: clients.length > 0 ? `${clients[0].nombre} ${clients[0].apellido || ''}`.trim() : '',
      servicio: 'SITIO WEB',
      fecha: new Date().toISOString().split('T')[0],
      importe: 0,
      observaciones: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inc: IncomeType) => {
    setEditingIncome(inc);
    setFormData({
      clienteId: inc.clienteId || '',
      clienteNombre: inc.clienteNombre || '',
      servicio: inc.servicio || 'SITIO WEB',
      fecha: inc.fecha ? new Date(inc.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      importe: inc.importe || 0,
      observaciones: inc.observaciones || '',
    });
    setIsModalOpen(true);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === 'CUSTOM') {
      setFormData({ ...formData, clienteId: '', clienteNombre: '' });
    } else {
      const cli = clients.find((c) => c.id === selectedId);
      if (cli) {
        const fullNombre = cli.empresa
          ? `${cli.nombre} ${cli.apellido || ''} (${cli.empresa})`.trim()
          : `${cli.nombre} ${cli.apellido || ''}`.trim();
        setFormData({ ...formData, clienteId: cli.id, clienteNombre: fullNombre });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar registro de ingreso?')) return;
    try {
      const res = await fetch(`/api/incomes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('¡Operación realizada con éxito! Ingreso eliminado.');
        setTimeout(() => setToastMsg(null), 4000);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteNombre.trim()) {
      alert('Por favor especifica el nombre del cliente');
      return;
    }
    if (formData.importe <= 0) {
      alert('Por favor ingresa un importe mayor a cero');
      return;
    }

    try {
      const url = editingIncome ? `/api/incomes/${editingIncome.id}` : '/api/incomes';
      const method = editingIncome ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setToastMsg(`¡Operación realizada con éxito! Ingreso ${editingIncome ? 'actualizado' : 'registrado'}.`);
        setTimeout(() => setToastMsg(null), 4000);
        fetchData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Error al guardar: ${errData.error || 'No se pudo registrar el ingreso'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error de conexión: ${err?.message || 'No se pudo guardar el ingreso'}`);
    }
  };

  const totalIngresos = incomes.reduce((acc, curr) => acc + (Number(curr.importe) || 0), 0);

  return (
    <div className="space-y-6 font-poppins">
      {toastMsg && (
        <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Gestión de Ingresos</h2>
          <p className="text-sm text-gray-500">Registro unificado de facturación por servicios y clientes</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow transition-transform transform hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-5 h-5 text-gray-900" />
          <span>NUEVO INGRESO</span>
        </button>
      </div>

      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Ingresos Registrados</span>
            <h3 className="text-2xl font-black text-green-600 mt-1">
              ${totalIngresos.toLocaleString('es-AR')}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operaciones de Ingreso</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{incomes.length}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket Promedio</span>
            <h3 className="text-2xl font-black text-cyan-600 mt-1">
              ${incomes.length > 0 ? Math.round(totalIngresos / incomes.length).toLocaleString('es-AR') : 0}
            </h3>
          </div>
          <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Incomes Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando ingresos...</div>
        ) : incomes.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium space-y-3">
            <Wallet className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-base text-gray-600 font-bold">No hay ingresos registrados en el sistema.</p>
            <p className="text-xs text-gray-400">Haz clic en "NUEVO INGRESO" para registrar tu primer cobro.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  <th className="py-4 px-6">Fecha</th>
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6">Servicio</th>
                  <th className="py-4 px-6">Importe ($)</th>
                  <th className="py-4 px-6">Observaciones</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {incomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-600 whitespace-nowrap">
                      {inc.fecha ? new Date(inc.fecha).toLocaleDateString('es-AR') : '-'}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {inc.clienteNombre}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block bg-cyan-50 text-[#00ACC1] border border-cyan-200 text-xs font-extrabold px-3 py-1 rounded-full">
                        {inc.servicio}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-green-600 whitespace-nowrap text-base">
                      ${Number(inc.importe || 0).toLocaleString('es-AR')}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-600 max-w-xs truncate">
                      {inc.observaciones || '-'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(inc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inc.id)}
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingIncome ? 'Editar Registro de Ingreso' : 'Nuevo Registro de Ingreso'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              
              {/* Cliente Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Cliente (Selección del Rubro Clientes) *
                </label>
                <select
                  value={formData.clienteId || 'CUSTOM'}
                  onChange={handleClientChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] font-semibold text-gray-800"
                >
                  {clients.map((cli) => (
                    <option key={cli.id} value={cli.id}>
                      {cli.nombre} {cli.apellido || ''} {cli.empresa ? `(${cli.empresa})` : ''}
                    </option>
                  ))}
                  <option value="CUSTOM">-- Ingresar cliente manualmente u otro --</option>
                </select>
              </div>

              {/* Nombre Cliente (Manual entry if custom selected) */}
              {(!formData.clienteId || formData.clienteId === 'CUSTOM') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre / Razón Social del Cliente *</label>
                  <input
                    type="text"
                    required
                    value={formData.clienteNombre}
                    onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                    placeholder="Ej. Juan Pérez / Empresa SRL"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              )}

              {/* Servicio Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Servicio *</label>
                <select
                  value={formData.servicio}
                  onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] font-semibold text-gray-800"
                >
                  {SERVICE_OPTIONS.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha e Importe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Importe ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={formData.importe}
                    onChange={(e) => setFormData({ ...formData, importe: Number(e.target.value) })}
                    placeholder="Ej. 45000"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] font-bold text-gray-900"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observaciones</label>
                <textarea
                  rows={3}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Detalles adicionales, número de recibo o comprobante..."
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* Buttons */}
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
                  Guardar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
