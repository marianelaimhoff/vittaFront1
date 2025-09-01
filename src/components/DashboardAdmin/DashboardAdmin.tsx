'use client';
import { useEffect, useState } from 'react';
import { Provider } from '@/types/Provider';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [professionals, setProfessionals] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<{ id: string, name: string, status: string } | null>(null);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('token');
    
    setTimeout(() => {
      router.push('/pepita-flores');
    }, 1000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error('Error al cargar profesionales');
      }

      const data: Provider[] = await res.json();
      const providers = data
        .filter(user => user.role === 'provider')
        .map(provider => ({
          ...provider,
          status: provider.status || 'Inactive'
        }));
      
      setProfessionals(providers);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al cargar los profesionales');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClick = (pro: Provider) => {

    setSelectedProfessional({
      id: pro.id,
      name: pro.name,
      status: pro.status || 'Inactive'
    });
    setShowConfirmation(true);
  };

  const toggleStatus = async (confirmed: boolean) => {
    setShowConfirmation(false);
    
    if (!confirmed || !selectedProfessional) return;

    try {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');
      const newStatus = selectedProfessional.status === 'Active' ? 'Inactive' : 'Active';
      
      const res = await fetch(`http://localhost:4000/users/${selectedProfessional.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || 'Error al actualizar el estado');
      }

      setProfessionals(prev => prev.map(pro => 
        pro.id === selectedProfessional.id ? { ...pro, status: newStatus } : pro
      ));
      
      setSuccess(`Profesional ${newStatus === 'Active' ? 'activado' : 'desactivado'} correctamente`);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      console.error('Error:', err);
      toast.error(err instanceof Error ? err.message : 'Error al cambiar el estado');
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Overlays y modales */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Cerrando sesión...</p>
          </div>
        </div>
      )}

      {showConfirmation && selectedProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              ¿Estás seguro que quieres {selectedProfessional.status === 'Active' ? 'desactivar' : 'activar'} a {selectedProfessional.name}?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => toggleStatus(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => toggleStatus(true)}
                className={`px-4 py-2 text-secondary rounded-md transition-colors ${
                  selectedProfessional.status === 'Active' 
                    ? 'bg-red-100 hover:bg-red-300' 
                    : 'bg-green-100 hover:bg-green-300'
                }`}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-teal-800 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gestión de Profesionales</h1>
          <button
            onClick={handleLogout}
            className= "text-white hover:text-primary px-4 py-2 rounded-md transition-colors font-medium"
          >
            Cerrar Sesión 
          </button>
        </div>

        {/* Mensajes de estado */}
        <div className="px-6 pt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p>{success}</p>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6">
          {professionals.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No hay profesionales registrados</h3>
              <p className="mt-1 text-gray-500">Actualmente no hay profesionales en el sistema.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesional
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matrícula
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {professionals.map((pro) => (
                    <tr key={pro.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {pro.file?.imgUrl ? (
                              <Image
                                src={pro.file?.imgUrl}
                                alt={`Foto de ${pro.name}`}
                                width={40}
                                height={40}
                                className="rounded-full object-cover h-10 w-10"
                                unoptimized={true}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{pro.name}</div>
                            <div className="text-sm text-gray-500">{pro.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pro.professionalProfile?.licenseNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pro.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pro.status === 'Active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleToggleClick(pro)}
                          className={`px-4 py-2 rounded-md text-sm font-medium text-secondary transition-colors ${
                            pro.status === 'Active' 
                              ? 'bg-white hover:bg-red-100' 
                              : 'bg-white  hover:bg-green-100'
                          }`}
                        >
                          {pro.status === 'Active' ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}