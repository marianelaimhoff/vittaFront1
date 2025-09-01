export const getValidToken = async (): Promise<string | null> => {
  // 1. Intenta token local (proveedores)
  const localToken = localStorage.getItem('token');
  if (localToken) return localToken;

  // 2. Si no hay, intenta con Auth0
  try {
    const res = await fetch('/api/token');
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken;
  } catch (error) {
    console.error('[TOKEN] Error obteniendo token válido:', error);
    return null;
  }
};
