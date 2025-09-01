import { Suspense } from 'react';
import Memberships from '@/components/Memberships/Memberships';

// Opcional pero útil si quieres evitar SSG en esta ruta
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Cargando membresía…</div>}>
      <Memberships />
    </Suspense>
  );
}
