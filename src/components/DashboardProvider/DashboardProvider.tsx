"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Award,
  FileText,
  User,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { handleImageUpload } from "@/services/uploadImageService";
import { Provider } from "@/types/Provider";
import { useProviders } from "@/context/ProvidersContext";
import SidebarProvider from "@/components/SidebarProvider/SidebarProvider";
import { toast } from "react-hot-toast";

export default function DashboardProvider() {
  const { refreshProviders } = useProviders();
  const { user, role, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const provider = role === "provider" ? (user as Provider) : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (!token || savedRole !== "provider") {
      window.location.href = "/login";
    } else {
      setLoading(false);
    }
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !provider) return;

    try {
      const result = await handleImageUpload(file, provider.id);
      if (result?.imgUrl) {
        const updated = {
          ...provider,
          file: { ...(provider.file || {}), imgUrl: result.imgUrl },
        };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        refreshProviders();
      }
    } catch (error) {
      toast.error(
        "No se pudo subir la imagen. Verifica el formato o el tamaño."
      );
      console.error("Error al subir la imagen:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Cargando...</div>;
  }

  if (!provider) {
    return (
      <div className="text-center py-10 text-gray-500">Redirigiendo...</div>
    );
  }

  return (
<SidebarProvider>
  <div className="max-w-6xl mx-auto bg-gray-50 rounded-xl p-6 md:p-8">
    {/* Encabezado */}
    <div className="mb-8 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-secondary">
        Bienvenida/o {provider.name?.split(" ")[0]}!
      </h1>
      <p className="text-gray-500 mt-2">
        Gestiona tu información profesional y configuración de cuenta
      </p>
    </div>

    {/* Perfil + Info profesional */}
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      {/* Card de Perfil */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <Image
            src={provider.file?.imgUrl || "/Avatar.jpg"}
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
              onChange={handleImageChange}
            />
          </label>
        </div>

        <h2 className="text-xl font-bold text-secondary mt-7 mb-1 text-center">
          {provider.name || "Sin nombre"}
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          {provider.professionalProfile?.verified
            ? "Profesional verificado"
            : "Profesional no verificado"}
        </p>

        <button
          className="w-full bg-secondary hover:bg-primary text-white font-medium py-2 px-4 rounded-full transition duration-200"
          onClick={() => {
            /* agrega navegación si aplica */
          }}
        >
          Editar Perfil
        </button>
      </div>

      {/* Información Profesional */}
      <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-secondary mb-4 pb-2 border-b ">
          Información Profesional
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={<User className="text-primary"/>} label="Nombre completo" value={provider.name} />
          <InfoItem icon={<Mail className="text-primary"/>} label="Correo electrónico" value={provider.email} />
          <InfoItem icon={<MapPin className="text-primary"/>} label="Ciudad" value={provider.city} />
          <InfoItem icon={<Phone className="text-primary"/>} label="Teléfono" value={provider.phone} />
          <InfoItem icon={<Calendar className="text-primary"/>} label="Fecha de nacimiento" value={provider.dob} />
          <InfoItem icon={<CreditCard className="text-primary"/>} label="DNI" value={provider.dni} />
          <InfoItem icon={<Award className="text-primary"/>} label="Experiencia" value={provider.professionalProfile?.experience} />
          <InfoItem icon={<FileText className="text-primary"/>} label="Matrícula" value={provider.professionalProfile?.licenseNumber} />
        </div>
      </div>
    </div>

    {/* Biografía y Especialidades */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Biografía */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-secondary mb-4 pb-2 border-b ">
          Biografía
        </h2>
        <p className="text-gray-600">
          {provider.professionalProfile?.biography || "No hay biografía disponible"}
        </p>
      </div>

      {/* Especialidades */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-secondary mb-4 pb-2 border-b ">
          Especialidades
        </h2>
        <div className="flex gap-2 mt-1 flex-wrap">
          {provider.professionalProfile?.specialty?.map((tag) => (
            <span
              key={tag.id}
              className="text-yellow-500 border border-tertiary px-3 py-1 rounded-full text-sm font-semibold shadow-md shadow-gray-300/30"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
</SidebarProvider>

  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-base text-secondary">{value || "No disponible"}</p>
        </div>
      </div>
    </div>
  );
}
