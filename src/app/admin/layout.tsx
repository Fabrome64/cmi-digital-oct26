import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // If user is accessing /admin/login, pass-through directly without layout wrapping
  // Note: /admin/login handles its own layout
  const session = getAuthSession();

  return (
    <div className="min-h-screen bg-gray-100 flex font-poppins text-gray-900">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader user={session || undefined} />
        <main className="p-6 sm:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
