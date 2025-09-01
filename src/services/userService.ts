import { RegisterUserValues } from "@/types/forms/RegisterUser";
import { fetchWithToken } from "../app/utils/fetchWithToken";


  export const registerUser = async (userData: RegisterUserValues) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error al registrar usuario");
    }

    const text = await res.text();

    // 🧠 Validar que no sea vacío
    if (!text) return {};

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Respuesta no es JSON válido:", text, err);
      throw new Error("Error al parsear respuesta del backend");
    }
  };




export const getUserById = async (id: string) => {
  const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Error al obtener el usuario');
    throw new Error(errorText);
  }

  return await res.json();
};




  