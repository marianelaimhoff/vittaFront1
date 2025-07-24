'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 
import { useState } from 'react';
import {toast} from 'react-hot-toast';

interface Specialty {
  id: string;
  name: string;
}

interface CardProviderProps {
  id: string;
  name: string;
  imageUrl: string;
  specialty: Specialty[];
  biography: string;
}

const CardProvider = ({ id, name, imageUrl, specialty, biography }: CardProviderProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Optimización para imágenes de Cloudinary
  const optimizedImageUrl = imageUrl.includes('res.cloudinary.com') 
    ? `${imageUrl.split('upload/')[0]}upload/w_300,h_300,c_fill/${imageUrl.split('upload/')[1]}`
    : imageUrl;

  const handleProtectedClick = () => {
    setIsLoading(true);
    console.log('[handleProtectedClick]', { isAuthenticated, id });

    if (!id) {
      setIsLoading(false);
      toast.error("El ID del profesional no está disponible.");
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      toast('Debes iniciar sesión para ver el perfil del profesional.', {
        icon: '❗',
      });
      window.location.href = '/login'; // evita error CORS
      return;
    }

    setTimeout(() => {
      router.push(`/providers/${id}`);
      setIsLoading(false);
    }, 1000); // Loading de 1 segundo
  };

  return (
    <div className="flex bg-gray-50 rounded-xl shadow-md p-4 max-w-3xl w-full">
      {/* Overlay de loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Cargando perfil...</p>
          </div>
        </div>
      )}

      {/* Imagen con optimización */}
      <div className="w-36 h-36 relative rounded-lg overflow-hidden mr-4">
        <Image 
          src={optimizedImageUrl} 
          alt={name} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/Avatar.jpg';
          }}
        />
      </div>
    
      {/* Contenido de la tarjeta */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-2xl font-bold text-secondary mb-1">{name}</h3>
          <div className="text-primary text-2xl">★★★★★</div>
        </div>

        <div className="flex flex-wrap gap-2  mb-2">
          {specialty.map((item) => (
            <span
              key={item.id}
              className="text-yellow-500 border border-tertiary px-3 py-1 rounded-full text-sm font-semibold shadow-md shadow-gray-300/30"
            >
              {item.name}
            </span>
          ))}
        </div>

        <p className="text-sm text-secondary mb-3">{biography}</p>

        <div className='flex justify-end'>
          <button
            onClick={handleProtectedClick}
            className="text-sm px-4 py-2 rounded-full bg-secondary text-white hover:bg-primary transition"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Ver perfil'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProvider;