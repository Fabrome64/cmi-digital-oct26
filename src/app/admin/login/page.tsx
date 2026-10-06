'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@cmidigital.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#FFD400] text-gray-900 font-black rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg">
            CMI
          </div>
          <h2 className="text-2xl font-extrabold text-white">ACCESO ADMINISTRATIVO</h2>
          <p className="text-xs text-yellow-400 font-semibold uppercase tracking-widest">
            CMI DIGITAL · Panel Privado
          </p>
        </div>

        {/* Demo Credentials Alert */}
        <div className="bg-yellow-950/40 border border-yellow-500/30 rounded-xl p-3 text-xs text-yellow-200">
          <p className="font-bold">Acceso DEMO precargado:</p>
          <p className="mt-1 text-gray-300">Email: <code className="bg-gray-800 px-1 py-0.5 rounded text-white">admin@cmidigital.com</code></p>
          <p className="text-gray-300">Password: <code className="bg-gray-800 px-1 py-0.5 rounded text-white">admin123</code></p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/80 border border-red-500 p-3 rounded-xl flex items-center space-x-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD400] hover:bg-yellow-400 text-gray-900 font-extrabold py-3.5 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
                <span>INICIANDO SESIÓN...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-gray-900" />
                <span>INGRESAR AL PANEL</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Volver al sitio público
          </a>
        </div>

      </div>
    </div>
  );
}
