'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Globe, MapPin, Share2, Search, Sparkles } from 'lucide-react';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    company_name: 'CMI DIGITAL',
    hero_title: 'CMI DIGITAL',
    hero_subtitle: 'Soluciones que hacen visible tu negocio.',
    hero_text: 'Impresiones, marketing digital y desarrollo web para llevar tu empresa al próximo nivel.',
    address: 'Paraná 19, San José de Feliciano, Entre Ríos, Argentina',
    phone: '03437-421589',
    whatsapp: '5493437421589',
    email: 'contacto@cmidigital.com.ar',
    facebook_url: 'https://facebook.com/cmidigital.feliciano',
    instagram_url: 'https://instagram.com/cmidigital.ok',
    google_maps_iframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.739775432904!2d-58.7554901!3d-30.3846301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b28b7e28cf69a1%3A0xb36b539c96129fa!2sParan%C3%A1%2019%2C%20San%20Jos%C3%A9%20de%20Feliciano%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar',
    meta_title: 'CMI DIGITAL | Impresiones Gran Formato, Marketing & Desarrollo Web en Feliciano',
    meta_description: 'Empresa líder en San José de Feliciano en Impresiones de Gran Formato, Marketing Digital, Administración de Redes Sociales y Desarrollo de Sitios Web Profesionales.',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.map) {
            setSettings((prev) => ({ ...prev, ...data.map }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando configuraciones...</div>;
  }

  return (
    <div className="space-y-6 font-poppins max-w-4xl">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Configuración Global del Sitio</h2>
          <p className="text-sm text-gray-500">Modifica datos de la empresa, redes, WhatsApp, SEO y Google Maps sin tocar código</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-xl text-xs font-bold border border-green-300">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Configuración guardada</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* HERO SECTION CONFIG */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2 border-b pb-3">
            <Sparkles className="w-5 h-5 text-[#FFD400]" />
            <span>Presentación Hero (Página Principal)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre de Empresa</label>
              <input
                type="text"
                value={settings.company_name || ''}
                onChange={(e) => handleChange('company_name', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título Principal Hero</label>
              <input
                type="text"
                value={settings.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo Hero</label>
            <input
              type="text"
              value={settings.hero_subtitle || ''}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Texto Descriptivo Hero</label>
            <textarea
              rows={2}
              value={settings.hero_text || ''}
              onChange={(e) => handleChange('hero_text', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        {/* CONTACT & LOCATION CONFIG */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2 border-b pb-3">
            <MapPin className="w-5 h-5 text-green-600" />
            <span>Contacto, WhatsApp & Ubicación</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dirección Física</label>
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono Fijo</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">WhatsApp (con código de país)</label>
              <input
                type="text"
                value={settings.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="5493437421589"
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Oficial</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">URL iframe Google Maps (Centrado en Feliciano)</label>
            <textarea
              rows={3}
              value={settings.google_maps_iframe || ''}
              onChange={(e) => handleChange('google_maps_iframe', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        {/* SEO CONFIG */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2 border-b pb-3">
            <Search className="w-5 h-5 text-blue-600" />
            <span>SEO Técnico & Meta Etiquetas</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título SEO (Meta Title)</label>
            <input
              type="text"
              value={settings.meta_title || ''}
              onChange={(e) => handleChange('meta_title', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Meta Descripción SEO</label>
            <textarea
              rows={2}
              value={settings.meta_description || ''}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-black py-4 px-8 rounded-xl shadow-xl transition-transform transform hover:-translate-y-0.5 text-base disabled:opacity-50"
          >
            <Save className="w-5 h-5 text-gray-900" />
            <span>{saving ? 'GUARDANDO CAMBIOS...' : 'GUARDAR CONFIGURACIÓN GLOBAL'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
