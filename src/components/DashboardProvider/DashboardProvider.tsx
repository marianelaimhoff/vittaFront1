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
      <div className="flex-1 p-1">
        <div className="max-w-5xl bg-gray-100 rounded-xl p-9 ml-4">
          <div className="mb-8">
            <h1 className="title1">Bienvenida/o {provider.name}!</h1>
            <p className="text-gray-500 text-center">
              Gestiona tu información profesional y configuración de cuenta
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-10 text-center">
                <div className="flex justify-center mb-4">
                  <Image
                    src={provider.file?.imgUrl || "/Avatar.jpg"}
                    alt="Foto de perfil"
                    width={150}
                    height={150}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <h2 className="title2">{provider.name}</h2>
                <p className="text-gray-500 text-sm mb-4">
                  {provider.professionalProfile?.verified
                    ? "Profesional verificado"
                    : "Profesional no verificado"}
                </p>
                <button className="w-full bg-secondary border text-white px-4 py-2 rounded-full text-sm hover:bg-primary hover:text-white transition">
                  Editar Perfil
                </button>

                <label className="mt-3 inline-block cursor-pointer text-sm text-primary hover:underline">
                  Cambiar foto
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="mb-4 text-center">
                  <h2 className="title2">Información Profesional</h2>
                  <p className="text-gray-500 text-sm">
                    Detalles de tu cuenta y datos profesionales
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoItem
                      icon={<User className="h-5 w-5 text-secondary" />}
                      label="Nombre completo"
                      value={provider.name}
                    />
                    <InfoItem
                      icon={<Mail className="h-5 w-5 text-secondary" />}
                      label="Correo electrónico"
                      value={provider.email}
                    />
                    <InfoItem
                      icon={<MapPin className="h-5 w-5 text-secondary" />}
                      label="Ciudad"
                      value={provider.city}
                    />
                    <InfoItem
                      icon={<Phone className="h-5 w-5 text-secondary" />}
                      label="Teléfono"
                      value={provider.phone}
                    />
                    <InfoItem
                      icon={<Calendar className="h-5 w-5 text-secondary" />}
                      label="Fecha de nacimiento"
                      value={provider.dob}
                    />
                    <InfoItem
                      icon={<CreditCard className="h-5 w-5 text-secondary" />}
                      label="DNI"
                      value={provider.dni}
                    />
                    <InfoItem
                      icon={<Award className="h-5 w-5 text-secondary" />}
                      label="Experiencia"
                      value={provider.professionalProfile?.experience}
                    />
                    <InfoItem
                      icon={<FileText className="h-5 w-5 text-secondary" />}
                      label="Matrícula"
                      value={provider.professionalProfile?.licenseNumber}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="title2 text-center">Biografía</h2>
                <p className="text-gray-500 text-sm mt-2">
                  {provider.professionalProfile?.biography ||
                    "No hay biografía disponible"}
                </p>
              </div>
              <div className="p-6">
                <h2 className="title2 text-center">Especialidades</h2>
                
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {provider.professionalProfile?.specialty?.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-gray-500 text-sm mt-2"
                      >-
                        {tag.name}
                      </span>
                    ))}
                  </div>
                
              </div>
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
