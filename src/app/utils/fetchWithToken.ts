// utils/fetchWithToken.ts
import { getValidToken } from './getValidToken';

export const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const token = await getValidToken(); // ← función "anidada" en responsabilidad
  const headers = {
  ...options.headers,
  ...(token && { Authorization: `Bearer ${token}` }),
  ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
};


  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) throw new Error(await response.text());
  return response;
};