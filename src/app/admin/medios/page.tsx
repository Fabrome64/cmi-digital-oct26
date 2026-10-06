'use client';

import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Copy, Check, Trash2, ExternalLink } from 'lucide-react';
import { MediaType } from '@/types';

export default function MediaAdminPage() {
  const [mediaList, setMediaList] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) setMediaList(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-poppins">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Sistema Centralizado de Medios</h2>
          <p className="text-sm text-gray-500">Subida y gestión de imágenes para portfolio, servicios y productos</p>
        </div>

        <label className="inline-flex items-center space-x-2 bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold px-5 py-3 rounded-xl shadow cursor-pointer text-sm">
          <Upload className="w-5 h-5 text-gray-900" />
          <span>{uploading ? 'SUBIENDO...' : 'SUBIR IMAGEN'}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Cargando galería...</div>
      ) : mediaList.length === 0 ? (
        <div className="p-8 text-center text-gray-500 font-medium bg-white rounded-2xl border border-dashed border-gray-300">
          No hay imágenes subidas en el servidor local.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between group">
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                <img src={item.url} alt={item.originalName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs font-bold text-gray-800 truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="w-full inline-flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-[11px] py-1.5 rounded-lg transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">¡COPIADA!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-600" />
                      <span>COPIAR URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
