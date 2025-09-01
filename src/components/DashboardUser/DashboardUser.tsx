'use client';

import { User as UserIcon, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';
import SidebarUser from '@/components/SidebardUser/SidebarUser';

export default function DashboardUser() {
  const { user, hasMembership } = useAuth();
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Upload logic si quieres
  };

  if (!user) return null;

  return (
    <SidebarUser>
      <div className="max-w-6xl mx-auto bg-gray-50 rounded-xl p-6 md:p-8">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            Bienvenido/a {user.name?.split(' ')[0] || 'Usuario'}!
          </h1>
          <p className="text-gray-500 mt-2">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Contenedor principal - Perfil e Información en misma fila */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Card de Perfil */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex flex-col items-center flex-grow">
              <div className="relative mb-4">
                <Image
                  src={user.file?.imgUrl || '/Avatar.jpg'}
                  alt="Foto de perfil"
                  width={120}
                  height={120}
                  className="w-24 mt-5 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-secondary"
                />
                <label className="absolute -bottom-2 right-0 bg-primary text-white p-1 rounded-full cursor-pointer hover:bg-secondary transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <h2 className="text-xl font-bold text-secondary mt-7 mb-1 text-center">
                {user.name || 'Sin nombre'}
              </h2>
              

              <div className="mt-auto w-full">
                <button
                  className="w-full bg-secondary hover:bg-primary text-white font-medium py-2 px-4 rounded-full transition duration-200"
                  onClick={() => router.push('/profile/edit')}
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Card de Información Personal */}
          <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-secondary mb-4 pb-2 border-b ">
              Información Personal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<UserIcon className="h-5 w-5 text-primary" />}
                label="Nombre completo"
                value={user.name}
              />
              <InfoItem
                icon={<Mail className="h-5 w-5 text-primary" />}
                label="Correo electrónico"
                value={user.email}
              />
              <InfoItem
                icon={<Phone className="h-5 w-5 text-primary" />}
                label="Teléfono"
                value={user.phone || 'No registrado'}
              />
              <InfoItem
                icon={<Calendar className="h-5 w-5 text-primary" />}
                label="Fecha de nacimiento"
                value={user.dob || 'No registrada'}
              />
              <InfoItem
                icon={<MapPin className="h-5 w-5 text-primary" />}
                label="Ciudad"
                value={user.city || 'No registrada'}
              />
            </div>
          </div>
        </div>

        {/* Card de Membresía (debajo) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-secondary mb-6 pb-2 border-b ">
            Tu Membresía
          </h2>

          {hasMembership ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-block bg-green-100 text-green-800 text-sm px-4 py-1 rounded-full mb-2">
                  Membresía Activa
                </span>
                <h3 className="text-lg font-semibold text-primary">
                  Plan Premium
                </h3>
                <p className="text-gray-600">
                  Incluye 2 sesiones al mes y seguimiento personalizado
                </p>
              </div>
              <button
                className="mt-4 md:mt-0 bg-secondary hover:bg-primary text-white font-medium py-2 px-6 rounded-full transition duration-200"
                onClick={() => router.push('/providers')}
              >
                Ver profesionales
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-block bg-yellow-100 text-yellow-500 text-sm px-4 py-1 rounded-full mb-2">
                  Sin membresía activa
                </span>
                <h3 className="text-lg font-semibold text-secondary">
                  Plan Premium Disponible
                </h3>
                <p className="text-gray-600">
                  Accede a beneficios exclusivos con nuestra membresía
                </p>
              </div>
              <button
                className="mt-4 md:mt-0 bg-secondary hover:bg-primary text-white font-medium py-2 px-6 rounded-full transition duration-200"
                onClick={() => router.push('/memberships')}
              >
                Adquirir membresía
              </button>
            </div>
          )}
        </div>
      </div>
    </SidebarUser>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-800">
          {value || <span className="text-gray-400">No disponible</span>}
        </p>
      </div>
    </div>
  );
}