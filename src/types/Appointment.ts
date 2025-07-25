export interface Appointment {
  id: string;
  user: {
    name: string;
    email: string;
  };
  professional: {
    user: {
      name: string;
      email: string;
    };
  };
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}


export type CreateAppointmentPayload = {
  userId: string;
  professionalId: string;
  date: string; // en formato 'YYYY-MM-DD'
  time: string; // en formato 'HH:mm'
  status: 'pending' | 'confirmed' | 'cancelled'; // si definiste estos posibles estados
};