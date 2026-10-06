'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, CreditCard, Box, Package, DollarSign,
  FolderKanban, Share2, FileText, Image as ImageIcon, Settings, LogOut,
  ExternalLink, Menu, X, ShieldAlert
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Abonos Web', href: '/admin/abonos', icon: CreditCard },
    { name: 'Insumos', href: '/admin/insumos', icon: Box },
    { name: 'Productos', href: '/admin/productos', icon: Package },
    { name: 'Gastos', href: '/admin/gastos', icon: DollarSign },
    { name: 'Portfolio Web', href: '/admin/portfolio', icon: FolderKanban },
    { name: 'Servicios Marketing', href: '/admin/servicios', icon: Share2 },
    { name: 'Presupuestos', href: '/admin/presupuestos', icon: FileText },
    { name: 'Medios / Imágenes', href: '/admin/medios', icon: ImageIcon },
    { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 bg-gray-900 text-[#FFD400] rounded-xl shadow-lg border border-yellow-400 focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-gray-900 text-white flex flex-col justify-between border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-950">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-[#FFD400] text-gray-900 rounded-lg flex items-center justify-center font-black text-lg shadow">
                CMI
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight">
                  CMI DIGITAL
                </span>
                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
                  Panel de Control
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-[#FFD400] text-gray-900 shadow-md'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-yellow-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            <span>Ver Sitio Público</span>
            <ExternalLink className="w-4 h-4 text-yellow-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl font-bold text-xs text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>CERRAR SESIÓN</span>
          </button>
        </div>
      </aside>
    </>
  );
}
