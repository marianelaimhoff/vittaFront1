// services/providerService.ts
import { RegisterProviderValues } from "../types/forms/RegisterProviders";
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { Provider } from '../types/Provider';

export const registerProvider = async (data: RegisterProviderValues) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al registrar proveedor");
    }
    console.log ("Provider registered successfully:", data);
    return await res.json();
  };
  



export const getProviders = async (): Promise<Provider[]> => {
  try {
    const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/users`);

    const data = await res.json();

    return data.map((provider: Provider) => ({
      id: provider.id,
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      dni: provider.dni,
      city: provider.city,
      dob: provider.dob,
      status: provider.status,
      createdAt: provider.createdAt,
      role: provider.role,
      imageUrl: provider.imageUrl || provider.file?.imgUrl || '/Avatar.jpg',
      file: provider.file,
      professionalProfile: {
        id: provider.professionalProfile?.id,
        biography: provider.professionalProfile?.biography || 'Descripción no disponible',
        experience: provider.professionalProfile?.experience || '',
        licenseNumber: provider.professionalProfile?.licenseNumber || '',
        specialty: provider.professionalProfile?.specialty || [],
        verified: provider.professionalProfile?.verified,
        verifiedBy: provider.professionalProfile?.verifiedBy || null,
      },
    }));
  } catch (err) {
    console.error('Error fetching providers:', err);
    throw err;
  }
};



export const getProviderById = async (id: string): Promise<Provider> => {
  try {
    const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);

    const provider = await res.json();
    const profile = provider.professionalProfile || {};

    return {
      id: provider.id,
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      dni: provider.dni,
      city: provider.city,
      dob: provider.dob,
      role: provider.role,
      status: provider.status,
      createdAt: provider.createdAt,
      imageUrl: provider.imageUrl || provider.avatarUrl || provider.file?.imgUrl || '/Avatar.jpg',
      file: provider.file,
      professionalProfile: {
        id: profile.id,
        biography: profile.biography || 'Descripción no disponible',
        experience: profile.experience || '',
        licenseNumber: profile.licenseNumber || '',
        specialty: profile.specialty || [],
        verified: profile.verified,
        verifiedBy: profile.verifiedBy || null,
      },
    };
  } catch (err) {
    console.error('Error fetching provider by ID:', err);
    throw err;
  }
};