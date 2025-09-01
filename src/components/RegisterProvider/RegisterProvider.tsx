"use client";

import { useForm } from "react-hook-form";
import { registerProvider } from "@/services/providerService";
import { RegisterProviderValues } from "@/types/forms/RegisterProviders";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BackButton from "../BackButton/BackButton";

const defaultValues: RegisterProviderValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  dni: "",
  city: "",
  dob: "",
  role: "provider",
  biography: "",
  experience: "",
  licenseNumber: "",
  specialty: [],
};

const specialties = [
  "Veganismo",
  "Diabetes",
  "Obesidad",
  "Celiaquía",
  "Hipo/hipertiroidismo",
  "Trastornos alimenticios",
];

export default function RegisterProviderForm() {
  const [, setSubmittedData] = useState<RegisterProviderValues | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<RegisterProviderValues>({
    mode: "onChange",
    defaultValues,
  });

  const selectedSpecialties = watch("specialty") || [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setValue(
        "specialty",
        selectedSpecialties.filter((item) => item !== specialty),
        { shouldValidate: true }
      );
    } else {
      setValue("specialty", [...selectedSpecialties, specialty], {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (data: RegisterProviderValues) => {
    setIsLoading(true);
    try {
      const response = await registerProvider(data);
      toast.success("Registro exitoso");
      setSubmittedData(response);
      reset();
      router.push("/dashboard/provider");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al registrar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              Procesando tu registro...
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-20 left-6 z-10">
        <BackButton />
      </div>

      <div className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden bg-white">
        <div className="p-8 w-full">
          <h2 className="title1">
            Crear una cuenta
          </h2>
          <p className="text-center text-secondary text-sm mb-6">
            Completa el formulario para registrarte como profesional
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna 1 */}
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Nombre completo
                  </label>
                  <input
                    {...register("name", {
                      required: "El nombre es obligatorio",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message: "Solo se permiten letras",
                      },
                    })}
                    className="input-form"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "El correo es obligatorio",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Correo inválido",
                      },
                    })}
                    className="input-form"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: { value: 6, message: "Mínimo 6 caracteres" },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
                        message:
                          "Debe incluir una mayúscula, un número y un símbolo",
                      },
                    })}
                    className="input-form"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    {...register("dob", {
                      required: "La fecha es obligatoria",
                    })}
                    className="input-form"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm">{errors.dob.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Biografía
                  </label>
                  <textarea
                    {...register("biography", {
                      required: "La biografía es obligatoria",
                      minLength: { value: 10, message: "Mínimo 10 caracteres" },
                    })}
                    className="input-form"
                    rows={4}
                  />
                  {errors.biography && (
                    <p className="text-red-500 text-sm">
                      {errors.biography.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Columna 2 */}
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Teléfono
                  </label>
                  <input
                    {...register("phone", {
                      required: "El teléfono es obligatorio",
                      minLength: {
                        value: 7,
                        message: "Debe tener al menos 7 dígitos",
                      },
                    })}
                    className="input-form"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    DNI
                  </label>
                  <input
                    {...register("dni", {
                      required: "El documento es obligatorio",
                      pattern: {
                        value: /^\d{5,10}$/,
                        message: "Debe tener entre 5 y 10 dígitos",
                      },
                    })}
                    className="input-form"
                  />
                  {errors.dni && (
                    <p className="text-red-500 text-sm">{errors.dni.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Ciudad
                  </label>
                  <input
                    {...register("city", {
                      required: "La ciudad es obligatoria",
                      minLength: {
                        value: 2,
                        message: "Debe tener al menos 2 letras",
                      },
                    })}
                    className="input-form"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    Matrícula profesional
                  </label>
                  <input
                    {...register("licenseNumber", {
                      required: "Campo obligatorio",
                      minLength: {
                        value: 6,
                        message: "Debe tener mínimo 6 caracteres",
                      },
                    })}
                    className="input-form"
                  />
                  {errors.licenseNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.licenseNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Experiencia
                  </label>
                  <textarea
                    {...register("experience", {
                      required: "La experiencia es obligatoria",
                      minLength: { value: 10, message: "Mínimo 10 caracteres" },
                    })}
                    className="input-form"
                    rows={4}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm">
                      {errors.experience.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dropdown de especialidades */}
            <div className="mt-6 relative" ref={dropdownRef}>
              <label className="text-sm font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Especialidades (selecciona al menos una)
              </label>

              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary flex justify-between items-center"
              >
                <span className="truncate">
                  {selectedSpecialties.length > 0
                    ? selectedSpecialties.join(", ")
                    : "Selecciona tus especialidades"}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="relative z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                  {specialties.map((spec) => (
                    <label
                      key={spec}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpecialties.includes(spec)}
                        onChange={() => toggleSpecialty(spec)}
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                      />
                      <span>{spec}</span>
                    </label>
                  ))}
                </div>
              )}

              {errors.specialty && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.specialty.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full mt-8 px-4 py-2 rounded-full text-sm border transition ${
                isValid
                  ? "bg-primary text-white border-primary hover:bg-secondary"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}