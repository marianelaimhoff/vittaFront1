'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProviderById } from '@/services/providerService';
import { Provider } from '@/types/Provider';
import { useAuth } from '@/context/AuthContext';
import { MapPin, User, IdCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BackButton from '../BackButton/BackButton';

export default function ProviderProfile() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { hasMembership, role, isAuthenticated } = useAuth();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProvider = async () => {
      try {
        const data = await getProviderById(id);
        setProvider(data);
      } catch {
        toast.error('Error al obtener el perfil del profesional');
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  const handleBookingClick = () => {
    setIsProcessing(true);
    
    if (!hasMembership) {
      toast.error('Para agendar una cita debes suscribirte a la membresía', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          padding: '16px',
          fontSize: '1rem',
          fontWeight: '600'
        }
      });
      
      setTimeout(() => {
        router.push(`/memberships?redirectTo=/providers/${id}`);
        setIsProcessing(false);
      }, 5000);
    } else {
      setTimeout(() => {
        router.push(`/providers/${id}/appointments`);
        setIsProcessing(false);
      }, 1000);
    }
  };

  if (loading) return <p className="p-4">Cargando perfil...</p>;
  if (error || !provider) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Overlay de loading */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Redirigiendo...</p>
          </div>
        </div>
      )}

      <div className="absolute top-24 left-4 z-10"> {/* Cambié top-4 a top-24 */}
          <BackButton />
        </div>

      {/* Imagen */}
      <div className="col-span-1 flex justify-center md:justify-start">
        <div className="w-60 h-60 relative rounded-xl border border-primary overflow-hidden">
          <Image
            src={provider.imageUrl || '/Avatar.jpg'}
            alt={provider.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Perfil principal */}
      <div className="md:col-span-2">
        <h1 className="text-4xl font-bold text-secondary">{provider.name}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {provider.professionalProfile?.specialty?.map((s) => (
            <span key={s.id} className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {s.name}
            </span>
          ))}
        </div>

        <p className="text-gray-600 mt-4 text-sm leading-relaxed">
          {provider.professionalProfile.biography}
        </p>

        {/* Reseñas simuladas */}
        <div className="flex items-center mt-3 text-green-600 font-semibold text-sm">
          ★★★★★ <span className="ml-2 text-gray-500 font-normal">80 customer reviews</span>
        </div>
      </div>

      {/* Datos personales */}
      <div className="md:col-span-1 bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-secondary mb-4">Datos personales</h2>
        <div className="text-gray-700 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>{provider.dob}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{provider.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <IdCard className="w-4 h-4 text-primary" />
            <span>Matrícula {provider.professionalProfile.licenseNumber}</span>
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div className="md:col-span-1 bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-secondary mb-1">Agenda tus consultas del mes</h2>
        {isAuthenticated && role !== 'provider' && (
         <p className="text-green-600 font-semibold text-sm mb-2">Haz clic para ver la disponibilidad</p>
        )}
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>Los turnos son a través de videollamadas.</li>
          <li>La tolerancia de espera es de 10 min.</li>
          <li>Disponer de micrófono y cámara.</li>
        </ul>

        {isAuthenticated && role !== 'provider' && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleBookingClick}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full text-sm transition"
            disabled={isProcessing}
          >
            {isProcessing ? 'Cargando...' : 'Agendar citas'}
          </button>
        </div>
      )}
      </div>

      {/* Membresía (solo información) */}
      <div className="md:col-span-1 bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-secondary mb-1">Membresía</h2>
        <p className="text-green-600 font-bold text-lg">$49.99 c/ mes</p>
        <p className="text-sm text-gray-700 mt-1">
          Incluye 2 sesiones al mes para consultas, controles o planes alimenticios.
        </p>
      </div>
    </div>
  );
}