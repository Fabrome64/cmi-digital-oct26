'use client';

import { useState, useEffect } from 'react';
import {
  Users, Globe, CreditCard, FileText, Package, DollarSign,
  AlertTriangle, TrendingUp, BarChart2, ShieldAlert
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error cargando métricas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 font-bold animate-pulse text-lg">
          Cargando Dashboard de CMI DIGITAL...
        </div>
      </div>
    );
  }

  const kpis = stats?.kpis || {};
  const charts = stats?.charts || {};
  const lowStock = stats?.lowStockSupplies || [];

  const COLORS = ['#0066FF', '#00BCD4', '#FFD400', '#FF5722', '#4CAF50', '#9C27B0'];

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Resumen General</h2>
        <p className="text-sm text-gray-500">Métricas en tiempo real de clientes, abonos, insumos y facturación.</p>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStock.length > 0 && (
        <div className="p-5 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-start space-x-4 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-extrabold text-amber-900 text-sm">
              ¡Alerta de Stock Mínimo en Insumos! ({lowStock.length} ítems)
            </h4>
            <div className="mt-1 flex flex-wrap gap-2">
              {lowStock.map((item: any) => (
                <span key={item.id} className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-300">
                  {item.nombre}: {item.stock} {item.unidad} (Mín: {item.stockMinimo})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* KPI 1: Clientes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clientes Activos</span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{kpis.clientsCount || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Sitios Web Activos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sitios Web Activos</span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{kpis.activeWebsitesCount || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Abonos Pendientes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Abonos Vencidos / Próximos</span>
            <h3 className="text-3xl font-black text-amber-600 mt-1">{kpis.pendingSubscriptionsCount || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Presupuestos Nuevos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Presupuestos Nuevos</span>
            <h3 className="text-3xl font-black text-[#0066FF] mt-1">{kpis.newBudgetsCount || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 5: Productos / Impresiones */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Productos en Catálogo</span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{kpis.totalProductsCount || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 6: Gastos del Mes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gastos Acumulados Mes</span>
            <h3 className="text-2xl font-black text-red-600 mt-1">
              ${(kpis.monthlyExpensesTotal || 0).toLocaleString('es-AR')}
            </h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Gastos por Categoría */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-[#0066FF]" />
            <span>Gastos por Categoría ($)</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.expensesByCategory || []}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip formatter={(val: number) => `$${val.toLocaleString('es-AR')}`} />
                <Bar dataKey="total" fill="#0066FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Presupuestos por Estado */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#00BCD4]" />
            <span>Presupuestos por Estado</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.budgetsByStatus || []}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#FFD400" radius={[6, 6, 0, 0]}>
                  {(charts.budgetsByStatus || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
