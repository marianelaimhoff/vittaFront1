"use client";

import { useForm } from "react-hook-form";
import { loginUser } from "@/services/authService";
import { getUserById } from "@/services/userService";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import {toast} from "react-hot-toast";
import BackButton from "../BackButton/BackButton";

type LoginFormValues = {
  email: string;
  password: string;
};

type TokenPayload = {
  sub: string;
  roles?: string;
};

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ mode: "onChange" });
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setIsLoggingIn(true);
    
    try {
      const response = await loginUser(data);
      const { token } = response;
      if (!token) toast('Falta token en la respuesta del login', {
        icon: '❗',
      });

      const decoded = jwtDecode<TokenPayload>(token);
      const userId = decoded.sub;
      const role = decoded.roles || "user";

      if (!userId) toast.error("El token no contiene userId");

      const user = await getUserById(userId);
      console.log("Usuario obtenido:", user);
      localStorage.setItem('userId', user.id); 
      if (role === 'provider' && user.professionalProfile?.id) {
        localStorage.setItem('professionalId', user.professionalProfile.id);
      }
      login(user, token, role);

      setTimeout(() => {
        if (role === "provider") {
          router.push("/dashboard/provider");
        } else {
          router.push("/dashboard/user");
        }
      }, 1000);

    } catch (error) {
      setIsLoggingIn(false);
      const err = error as Error;
      console.error("Login error:", err.message);
      toast.error(err.message || "Error al iniciar sesión");
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // Simulamos la redirección después de 1 segundo
    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tertiary bg-opacity-80 px-4">
      {/* Loading para inicio de sesión normal */}
      {isLoggingIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Iniciando sesión...</p>
          </div>
        </div>
      )}

      {/* Loading para Google */}
      {isGoogleLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Redirigiendo...</p>
          </div>
        </div>
      )}

      <div className="absolute top-24 left-4 z-10">
          <BackButton />
        </div>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-png-vitta.png"
            alt="Logo Vitta"
            width={80}
            height={80}
            priority
          />
        </div>
        <h2 className="title1">
          Iniciar sesión
        </h2>

        {serverError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Correo no válido",
                },
              })}
              className="input-form"
              disabled={isSubmitting || isLoggingIn || isGoogleLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              className="input-form"
              disabled={isSubmitting || isLoggingIn || isGoogleLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoggingIn || isGoogleLoading}
            className={`w-full bg-primary text-white py-2 rounded-full hover:bg-secondary transition-colors ${
              isSubmitting || isLoggingIn || isGoogleLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting || isLoggingIn ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  viewBox="0 0 24 24"
                ></svg>
                Procesando...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn || isGoogleLoading}
          className={`w-full flex items-center justify-center gap-2 text-secondary border border-secondary px-4 py-2 rounded-full text-sm hover:border-primary hover:text-primary transition mt-4 ${
            isGoogleLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isGoogleLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                viewBox="0 0 24 24"
              ></svg>
              Redirigiendo...
            </span>
          ) : (
            <>
              <Image
                src="/google-logo.png" // Asegúrate de tener este archivo en tu carpeta public
                alt="Google Logo"
                width={20}
                height={20}
              />
              Continuar con Google
            </>
          )}
        </button>

        <div className="mt-4 text-sm text-gray-600 text-center">
          ¿Olvidaste tu contraseña?{" "}
          <a href="#" className="text-gray-600 hover:underline">
            Click aquí
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Necesitas ayuda?{" "}
          <a
            href="mailto:support@vitta.org"
            className="text-teal-700 underline"
          >
            pfvitta@gmail.com
          </a>
        </p>
        
      </div>
    </div>
  );
}