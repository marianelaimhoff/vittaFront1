export const loginUser = async (credentials: { email: string; password: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  return data; // ← debe incluir el token y el usuario
};

