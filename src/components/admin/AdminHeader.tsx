'use client';

import { UserCheck, Shield, Bell } from 'lucide-react';

interface AdminHeaderProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Panel de Administración</h1>
        <p className="text-xs text-gray-500 font-medium">CMI DIGITAL · Sistema de Gestión Integral</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Profile Badge */}
        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl">
          <div className="w-8 h-8 bg-[#FFD400] text-gray-900 rounded-lg flex items-center justify-center font-black text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-extrabold text-gray-900 leading-none">
              {user?.name || 'Administrador CMI'}
            </p>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {user?.role || 'ADMINISTRADOR'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
