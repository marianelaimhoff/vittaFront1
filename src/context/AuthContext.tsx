'use client';

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react';
import { UserData } from '../types/User';
import { Provider } from '../types/Provider';

type AuthContextType = {
  user: UserData | Provider | null;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  login: (user: UserData, token: string, role: string) => void;
  setUser: React.Dispatch<React.SetStateAction<UserData | Provider | null>>;
  hasMembership: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | Provider | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState<boolean>(false);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/session', { cache: 'no-store' });
      const raw = await res.text();
      let session = null;

      try {
        session = JSON.parse(raw);
      } catch {
        console.warn('[SESSION] No es JSON válido');
        return;
      }

      const email = session?.user?.email;
      const name = session?.user?.name || 'Usuario';
      const roleFromSession = session?.role || 'user';

      if (email) {
        const encodedEmail = encodeURIComponent(email);

        const existsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/exists/${encodedEmail}`);

        if (existsRes.status === 404) {
          console.log('[SYNC] Usuario no existe. Creando...');
          const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              password: 'auth0',
              phone: '0000000000',
              dni: '00000000',
              city: 'Sin definir',
              dob: '2000-01-01',
              role: roleFromSession,
            }),
          });

          if (!createRes.ok) {
            throw new Error('[SYNC] No se pudo crear el usuario');
          }

          console.log('[SYNC] Usuario creado');
          await new Promise(resolve => setTimeout(resolve, 300)); // Espera para evitar 404
        }

        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/by-email/${encodedEmail}`);
        if (!userRes.ok) {
          throw new Error('No se pudo obtener el usuario completo');
        }

        const fullUser = await userRes.json();
        setUser(fullUser);
        setRole(roleFromSession);
        setIsAuthenticated(true);
        localStorage.setItem('userId', fullUser.id);

        return;
      }

      // Fallback: localStorage (para proveedores)
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');

      if (storedUser && token && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('[AUTH] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);

  useEffect(() => {
    if (role === 'user' && (user as UserData)?.membership?.status === 'Active') {
      setHasMembership(true);
    } else {
      setHasMembership(false);
    }
  }, [user, role]);

  const login = (user: UserData, token: string, role: string) => {
    console.log('Guardando en localStorage:', { token });
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    setUser(user);
    setIsAuthenticated(true);
    setRole(role);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    window.location.href = '/auth/logout';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        logout,
        login,
        setUser,
        hasMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return context;
};