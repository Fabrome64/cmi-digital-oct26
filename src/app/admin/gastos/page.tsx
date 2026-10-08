'use client';

import { useState, useEffect } from 'react';
import { Plus, DollarSign, Calendar, Tag, Trash2, Edit2, X, TrendingDown, Home } from 'lucide-react';
import { ExpenseType } from '@/types';
import SuccessToast from '@/components/admin/SuccessToast';

const CATEGORY_OPTIONS = [
  'Insumos',
  'Servicios',
  'Publicidad',
  'Hosting',
  'Software',
  'Equipamiento',
  'Transporte',
  'Gastos Hogar',
  'Otros',
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExpenseType | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const getTodayInput = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCleanDateInput = (dateVal: any) => {
    if (!dateVal) return getTodayInput();
    const str = typeof dateVal === 'string' ? dateVal : new Date(dateVal).toISOString();
    return str.split('T')[0];
  };

  const formatExpenseDate = (dateVal: string | Date) => {
    if (!dateVal) return '-';
    const str = typeof dateVal === 'string' ? dateVal : new Date(dateVal).toISOString();
    const cleanDate = str.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return cleanDate;
  };

  const [formData, setFormData] = useState({
    fecha: getTodayInput(),
    concepto: '',
    categoria: 'Insumos',
    proveedor: '',
    monto: 0,
    medioPago: 'Transferencia',
    comprobante: '',
    observaciones: '',
  });

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      if (res.ok) setExpenses(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleOpenCreate = () => {
    setEditingExp(null);
    setFormData({
      fecha: getTodayInput(),
      concepto: '',
      categoria: 'Insumos',
      proveedor: '',
      monto: 0,
      medioPago: 'Transferencia',
      comprobante: '',
      observaciones: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: ExpenseType) => {
    setEditingExp(exp);
    setFormData({
      fecha: getCleanDateInput(exp.fecha),
      concepto: exp.concepto || '',
      categoria: exp.categoria || 'Insumos',
      proveedor: exp.proveedor || '',
      monto: exp.monto || 0,
      medioPago: exp.medioPago || 'Transferencia',
      comprobante: exp.comprobante || '',
      observaciones: exp.observaciones || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar registro de gasto?')) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('¡Operación realizada con éxito! Gasto eliminado.');
        setTimeout(() => setToastMsg(null), 4000);
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingExp ? `/api/expenses/${editingExp.id}` : '/api/expenses';
      const method = editingExp ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setToastMsg(`¡Operación realizada con éxito! Gasto ${editingExp ? 'actualizado' : 'registrado'}.`);
        setTimeout(() => setToastMsg(null), 4000);
        fetchExpenses();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Error al guardar: ${errData.error || 'No se pudo registrar el gasto'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error de conexión: ${err?.message || 'No se pudo guardar el gasto'}`);
    }
  };

  // Financial Metrics
  const totalAcc = expenses.reduce((sum, e) => sum + (e.monto || 0), 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthExpenses = expenses.filter((e) => new Date(e.fecha) >= startOfMonth);
  const totalMonth = monthExpenses.reduce((sum, e) => sum + (e.monto || 0), 0);

  return (
    <div className="space-y-6 font-poppins">
      {toastMsg && (
        <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Gestión Financiera de Gastos</h2>
          <p className="text-sm text-gray-500">Registro operativo de egresos, insumos, servicios, gastos del hogar y equipamiento</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow transition-transform transform hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-5 h-5 text-gray-900" />
          <span>REGISTRAR GASTO</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gastos de este Mes</span>
            <h3 className="text-3xl font-black text-red-600 mt-1">
              ${totalMonth.toLocaleString('es-AR')}
            </h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Histórico Acumulado</span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              ${totalAcc.toLocaleString('es-AR')}
            </h3>
          </div>
          <div className="w-12 h-12 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando registros de gastos...</div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No hay gastos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Concepto / Categoría</th>
                  <th className="p-4">Proveedor</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Medio de Pago</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-xs font-bold text-gray-700 whitespace-nowrap">
                      {formatExpenseDate(exp.fecha)}
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-gray-900">{exp.concepto}</div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        exp.categoria === 'Gastos Hogar'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {exp.categoria}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-medium text-gray-600">{exp.proveedor || '-'}</td>
                    <td className="p-4 font-black text-red-600 text-base whitespace-nowrap">
                      ${exp.monto.toLocaleString('es-AR')}
                    </td>
                    <td className="p-4 text-xs font-semibold text-gray-700">{exp.medioPago}</td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => handleOpenEdit(exp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingExp ? 'Editar Gasto' : 'Nuevo Registro de Gasto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
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
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoría *</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] font-semibold text-gray-800"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Concepto / Detalle *</label>
                <input
                  type="text"
                  required
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value.toUpperCase() })}
                  placeholder="Ej. Compra de tintas / Servicio luz"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Proveedor / Entidad</label>
                  <input
                    type="text"
                    value={formData.proveedor}
                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value.toUpperCase() })}
                    placeholder="Ej. GrafiTech / Particular"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monto ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Medio de Pago</label>
                  <select
                    value={formData.medioPago}
                    onChange={(e) => setFormData({ ...formData, medioPago: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">N° Comprobante</label>
                  <input
                    type="text"
                    value={formData.comprobante}
                    onChange={(e) => setFormData({ ...formData, comprobante: e.target.value.toUpperCase() })}
                    placeholder="Ej. FAC-000123"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF] uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value.toUpperCase() })}
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
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
