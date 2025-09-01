// contexts/HistoryContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type HistoryContextType = {
  history: string[];
  addRoute: (route: string) => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname) {
      setHistory(prev => [...prev, pathname]);
    }
  }, [pathname]);

  const addRoute = (route: string) => {
    setHistory(prev => [...prev, route]);
  };

  return (
    <HistoryContext.Provider value={{ history, addRoute }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};