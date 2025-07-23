import { Appointment } from '@/types/Appointment';
import { fetchWithToken } from "../app/utils/fetchWithToken";

export type AvailableHour = { hourHand: string };

export interface ValidateAppointmentPayload {
  professionalId: string;
  date: string; // formato 'YYYY-MM-DD'
}

export interface CreateAppointmentPayload {
  userId: string;
  professionalId: string;
  date: Date;
  time: string; // '08:00', '09:00', etc.
  status: string;
}

// ✅ Obtener horarios disponibles
export const getAvailableHours = async ({
  professionalId,
  date,
}: {
  professionalId: string;
  date: string;
}): Promise<AvailableHour[]> => {
  const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/appointments/validate`, {
    method: 'POST',
    body: JSON.stringify({ professionalId, date }),
  });

  const data: AvailableHour[] = await response.json();
  return data;
};

// ✅ Crear turno
export async function createAppointment(data: CreateAppointmentPayload) {
  const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/appointments/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return await response.json();
}

// ✅ Obtener turnos por usuario
export const getAppointmentsByUser = async (userId: string): Promise<Appointment[]> => {
  const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/appointments/user/${userId}`);

  if (res.status === 404) return [];
  return res.json();
};

// ✅ Obtener turnos por proveedor
export const getAppointmentsByProvider = async (providerId: string): Promise<Appointment[]> => {
  try {
    const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/appointments/provider/${providerId}`);
    if (res.status === 404) return [];
    return res.json();
  } catch (error) {
    console.error('Error en getAppointmentsByProvider:', error);
    return [];
  }
};

// ✅ Cancelar turno
export const cancelAppointment = async (appointmentId: string) => {
  const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/appointments/cancel/${appointmentId}`, {
    method: 'PATCH',
  });

  return res.json();
};

// ✅ Confirmar turno
export const confirmAppointment = async (appointmentId: string) => {
  const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/appointments/provider/confirm/${appointmentId}`, {
    method: 'PATCH',
  });

  return res.json();
};


