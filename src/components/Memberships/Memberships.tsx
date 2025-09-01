'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import { createCheckoutSession } from '@/services/stripeService';
import { useAuth } from '@/context/AuthContext'; 
import {toast} from 'react-hot-toast';
import BackButton from '../BackButton/BackButton';

const Memberships = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<'stripe' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get('from');
    if (from && from !== '/memberships') {
      localStorage.setItem('previousPath', from);
    }
  }, [searchParams]);

  const handleStripeCheckout = async () => {
    setLoading('stripe');
    setError(null);

    try {
      if (!user?.email) throw new Error('Usuario no autenticado o sin email');
      const { url } = await createCheckoutSession(user.email);
      window.location.href = url;
    } catch (err) {
      console.error('Error en pago Stripe:', err);
      toast.error(err instanceof Error ? err.message : 'Error al procesar pago con Stripe');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="absolute top-24 left-4 z-10"> {/* Cambié top-4 a top-24 */}
          <BackButton />
        </div>
      <div className="bg-gray-100 max-w-xl w-full border border-secondary rounded-lg shadow-sm">
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="flex justify-center mb-3">
              <CreditCard className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="title1">Membresía Premium</h1>
            <p className="text-secondary font-semibold text-lg">¡Accede a todos nuestros beneficios!</p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-secondary">- Acceso ilimitado a contenido</p>
            <p className="text-sm text-secondary">- Soporte prioritario</p>
            <p className="text-sm text-secondary">- Actualizaciones exclusivas</p>
          </div>

          <div className="mb-6">
            <p className="text-2xl font-bold text-primary">$49.99</p>
            <p className="text-sm text-primary">por mes</p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleStripeCheckout}
              disabled={loading === 'stripe'}
              className={`bg-secondary text-white px-4 py-2 rounded-full hover:bg-primary transition ${
                loading === 'stripe' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading === 'stripe' ? 'Redirigiendo...' : 'Pagar con Stripe'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-blue-500 text-xs mt-1 hover:underline"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Memberships;


