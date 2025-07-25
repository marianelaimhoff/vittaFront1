"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "@/types/Appointment";
import {
  getAppointmentsByProvider,
  cancelAppointment,
  confirmAppointment,
} from "@/services/appointmentService";
import SidebarProvider from "../SidebarProvider/SidebarProvider";
import { toast } from "react-hot-toast";

export default function ProviderAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const professionalId =
    typeof window !== "undefined"
      ? localStorage.getItem("professionalId")
      : null;

  useEffect(() => {
    if (!professionalId) return;

    const fetchAppointments = async () => {
      try {
        const appts = await getAppointmentsByProvider(professionalId);
        setAppointments(appts ?? []);
      } catch (err) {
        console.error("❌ Error al traer turnos del profesional:", err);
        setError("No se pudieron cargar los turnos.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [professionalId]);

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch {
      alert("No se pudo cancelar el turno");
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await confirmAppointment(id);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "confirmed" } : appt
        )
      );
      toast.success("Turno confirmado");
    } catch {
      toast.error("No se pudo confirmar el turno");
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis turnos</h1>
          <p>Cargando turnos...</p>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis turnos</h1>

        {/* 🔙 Botón volver */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 text-sm text-primary underline"
        >
          ← Volver
        </button>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : appointments.length === 0 ? (
          // 🟡 Sin turnos
          <div className="bg-white p-8 rounded-xl shadow text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Aún no tienes turnos agendados
            </h2>
            <p className="text-gray-600 text-sm">
              Comparte tu perfil con más pacientes o espera a que te agenden una
              consulta.
            </p>
          </div>
        ) : (
          // ✅ Lista de turnos
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="border border-gray-200 bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2"
              >
                <p className="text-gray-700">
                  <strong className="text-secondary">Paciente:</strong>{" "}
                  {appt.user?.name ?? "Usuario no disponible"}
                </p>
                <p className="text-gray-700">
                  <strong className="text-secondary">Fecha:</strong>{" "}
                  {format(new Date(appt.date + "T00:00:00-07:00"), "EEEE dd 'de' MMMM yyyy", {
                    locale: es,
                  })}
                </p>
                <p className="text-gray-700">
                  <strong className="text-secondary">Hora:</strong> {appt.time}
                </p>
                <p className="text-gray-700">
                  <strong className="text-secondary">Estado:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      appt.status === "cancelled"
                        ? "text-red-500"
                        : appt.status === "confirmed"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {appt.status === "pending"
                      ? "Pendiente"
                      : appt.status === "confirmed"
                      ? "Confirmado"
                      : appt.status === "completed"
                      ? "Completado"
                      : "Cancelado"}
                  </span>
                </p>

                {appt.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="self-start mt-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
                  >
                    Cancelar turno
                  </button>
                )}

                {appt.status === "pending" && (
                  <button
                    onClick={() => handleConfirm(appt.id)}
                    className="self-start mt-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
                  >
                    Confirmar turno
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </SidebarProvider>
  );
}

