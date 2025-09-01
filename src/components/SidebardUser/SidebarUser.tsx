'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, History, Utensils } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarUserProps {
  children: ReactNode;
}

export default function SidebarUser({ children }: SidebarUserProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout(); // Esto limpia context y localStorage
      router.push('/login');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Cerrando sesión...</p>
          </div>
        </div>
      )}

      <aside className="bg-gray-100 m-1 rounded-xl border-gray-200 min-h-screen w-64">
        <div className="p-4">
          <nav className="space-y-2">
            <button className="btn-dashboard" onClick={() => router.push('/dashboard/user')}>
              <User className="mr-3 h-4 w-4" />
              Mi perfil
            </button>
            <button className="btn-dashboard" onClick={() => router.push('/dashboard/user/appointments')}>
              <History className="mr-3 h-4 w-4" />
              Historial de turnos
            </button>
            <button className="btn-dashboard" onClick={() => router.push('/dashboard/user/nutritional-plan')}>
              <Utensils className="mr-3 h-4 w-4" />
              Plan nutricional
            </button>
            <div className="border-t border-gray-200 my-4"></div>
            <button
              className="btn-dashboard"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
