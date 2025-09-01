// components/BackButton.tsx
'use client';

import { useHistory } from '@/context/HistoryContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const { history } = useHistory();
  const router = useRouter();

  const handleGoBack = () => {
    if (history.length > 1) {
      // Elimina la ruta actual del historial
      const previousRoute = history[history.length - 2];
      router.push(previousRoute);
    } else {
      // Si no hay historial, redirige a la página principal
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Volver atrás</span>
    </button>
  );
};

export default BackButton;