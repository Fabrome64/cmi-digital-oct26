'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Phone, Mail, MapPin, Building, X, Check } from 'lucide-react';
import { ClientType } from '@/types';

import SuccessToast from '@/components/admin/SuccessToast';

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    empresa: '',
    cuitDni: '',
    telefono: '',
    whatsapp: '',
    email: '',
    direccion: '',
    localidad: 'San José de Feliciano',
    provincia: 'Entre Ríos',
    observaciones: '',
    estado: 'Activo',
  });

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({
      nombre: '',
      apellido: '',
      empresa: '',
      cuitDni: '',
      telefono: '',
      whatsapp: '',
      email: '',
      direccion: '',
      localidad: 'San José de Feliciano',
      provincia: 'Entre Ríos',
      observaciones: '',
      estado: 'Activo',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: ClientType) => {
    setEditingClient(client);
    setFormData({
      nombre: client.nombre || '',
      apellido: client.apellido || '',
      empresa: client.empresa || '',
      cuitDni: client.cuitDni || '',
      telefono: client.telefono || '',
      whatsapp: client.whatsapp || '',
      email: client.email || '',
      direccion: client.direccion || '',
      localidad: client.localidad || 'San José de Feliciano',
      provincia: client.provincia || 'Entre Ríos',
      observaciones: client.observaciones || '',
      estado: client.estado || 'Activo',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('¡Operación realizada con éxito! Cliente eliminado.');
        setTimeout(() => setToastMsg(null), 4000);
        fetchClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setToastMsg(`¡Operación realizada con éxito! Cliente ${editingClient ? 'actualizado' : 'creado'}.`);
        setTimeout(() => setToastMsg(null), 4000);
        fetchClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.empresa && c.empresa.toLowerCase().includes(search.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-poppins">
      {toastMsg && (
        <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Gestión de Clientes</h2>
          <p className="text-sm text-gray-500">Base de datos centralizada de clientes y empresas de CMI DIGITAL</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow transition-transform transform hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-5 h-5 text-gray-900" />
          <span>NUEVO CLIENTE</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar por nombre, empresa o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#0066FF] shadow-sm"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando clientes...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No se encontraron clientes.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Cliente / Empresa</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Ubicación</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-gray-900">
                        {client.nombre} {client.apellido || ''}
                      </div>
                      {client.empresa && (
                        <div className="text-xs text-gray-500 font-medium flex items-center space-x-1 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-gray-400" />
                          <span>{client.empresa}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-xs font-medium space-y-1">
                      {client.whatsapp && <div className="text-gray-700">📱 {client.whatsapp}</div>}
                      {client.email && <div className="text-blue-600">{client.email}</div>}
                    </td>
                    <td className="p-4 text-xs font-medium text-gray-600">
                      <div>{client.direccion || 'Sin dirección'}</div>
                      <div className="text-gray-400">{client.localidad}, {client.provincia}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        client.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Apellido</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Empresa / Comercio</label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CUIT / DNI</label>
                  <input
                    type="text"
                    value={formData.cuitDni}
                    onChange={(e) => setFormData({ ...formData, cuitDni: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Localidad</label>
                  <input
                    type="text"
                    value={formData.localidad}
                    onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observaciones</label>
                <textarea
                  rows={3}
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
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
