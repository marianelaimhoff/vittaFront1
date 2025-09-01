'use client'
import { useProviders } from '@/context/ProvidersContext';
import CardProvider from "../CardProvider/CardProvider";
import { useEffect, useState } from 'react';
import BackButton from '../BackButton/BackButton';

function Providers() {
  const { providers, loading, error, refreshProviders } = useProviders();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Filtramos solo los providers con rol 'provider' Y status 'Active'
  const filteredProviders = providers.filter(provider => 
    provider.role === 'provider' && provider.status === 'Active'
  );

  useEffect(() => {
    if (filteredProviders.length === 0 && !loading) {
      const savedProviders = localStorage.getItem('providersData');
      if (savedProviders) {
        try {
          JSON.parse(savedProviders);
        } catch (e) {
          console.error('Error parsing localStorage data', e);
          localStorage.removeItem('providersData');
        }
      }
      setHasHydrated(true);
    }
  }, [filteredProviders.length, loading]);

  useEffect(() => {
    if (filteredProviders.length > 0 && hasHydrated) {
      localStorage.setItem('providersData', JSON.stringify(filteredProviders));
    }
  }, [filteredProviders, hasHydrated]);

  if (loading && !hasHydrated) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-10">
        <p>Cargando profesionales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-10">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={refreshProviders}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (filteredProviders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-10">
        <p>No hay profesionales disponibles</p>
        <button
          onClick={refreshProviders}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Recargar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-10">
      <div className="absolute top-24 left-4 z-10"> {/* Cambié top-4 a top-24 */}
          <BackButton />
        </div>
      <div className="max-w-4xl text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Elige al nutricionista ideal para ti</h2>
        <p className="text-secondary mb-4">
          En Vitta, conectamos personas con profesionales de la nutrición certificados en distintas especialidades como veganismo, diabetes, obesidad y más.
          Próximamente podrás filtrar por tus objetivos, leer reseñas de pacientes reales y agendar con un clic.
        </p>
        <p className="text-secondary font-semibold">
          Por ahora, explora nuestros perfiles y encuentra el especialista que más se adapte a ti.
        </p>
      </div>

      {filteredProviders.map((provider) => (
        <CardProvider
          key={provider.id}
          id={provider.id}
          name={provider.name}
          imageUrl={provider.imageUrl || '/Avatar.jpg'}
          specialty={provider.professionalProfile?.specialty || []}
          biography={provider.professionalProfile?.biography || ''}
        />
      ))}
    </div>
  );
}

export default Providers;