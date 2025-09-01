'use client';

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { goToMembershipWithReturn } from "@/app/utils/navigation";

const Navbar = () => {
  const { isAuthenticated, user, role, loading, logout, hasMembership } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Cargando...");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path: string, customText: string = "Cargando...") => {
    setLoadingText(customText);
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, 1000);
  };

  const handleMembershipClick = () => {
    setLoadingText("Procesando tu membresía...");
    setIsLoading(true);
    setTimeout(() => {
      goToMembershipWithReturn(router);
      setIsLoading(false);
    }, 2000);
  };

  if (!isMounted || loading || (isAuthenticated && role === 'user' && hasMembership === undefined)) {
    return null;
  }

  return (
    <header className="relative z-50 bg-white shadow-sm py-2">
      {/* Overlay de loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">{loadingText}</p>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl h-[60px] mx-auto flex items-center justify-between px-4 rounded-[100px] bg-white drop-shadow-lg">
        <button 
          onClick={() => handleNavigation("/", "Volviendo al inicio...")}
          className="-my-1 cursor-pointer"
        >
          <Image
            src="/logo-png-vitta2.png"
            alt="Logo Vitta"
            width={80}
            height={80}
            priority
          />
        </button>

        <nav className="space-x-8 text-md font-medium text-secondary">
          <button 
            onClick={() => handleNavigation("/providers", "Buscando profesionales...")}
            className="hover:text-primary transition"
          >
            Profesionales
          </button>
          <button 
            onClick={() => handleNavigation("/about-us", "Cargando información...")}
            className="hover:text-primary transition"
          >
            Acerca de nosotros
          </button>
          <button 
            onClick={() => handleNavigation("/blog", "Preparando artículos...")}
            className="hover:text-primary transition"
          >
            Blog
          </button>
        </nav>

        <div className="flex items-center space-x-2 relative">
          {!isAuthenticated ? (
            <>
              <button 
                onClick={() => handleNavigation("/login", "Cargando...")}
                className="text-secondary px-4 py-2 rounded-full text-sm hover:text-secondary transition"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => handleNavigation("/register/provider", "Cargando...")}
                className="bg-tertiary text-secondary px-4 py-2 rounded-full text-sm hover:bg-secondary hover:text-white transition"
              >
                Soy nutricionista
              </button>
              <button
                onClick={() => handleNavigation(
                  "/auth/login?userType=user&returnTo=/dashboard/user", 
                  "Redirigiendo..."
                )}
                className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-secondary hover:text-white transition"
              >
                Empieza aquí
              </button>
            </>
          ) : (
            <div className="flex items-center">
              {role === 'user' && hasMembership === false && (
                <button
                  onClick={handleMembershipClick}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-secondary hover:text-white transition"
                >
                  Acceder a membresía
                </button>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center space-x-1"
                >
                  <User className="w-6 h-6 text-secondary hover:text-primary" />
                  <span className="text-sm font-medium text-secondary hidden md:inline">
                    {user?.name?.split(' ')[0] || 'Mi cuenta'}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-[999]">
                    <button
                      onClick={() => handleNavigation(
                        role === 'provider' ? "/dashboard/provider" : "/dashboard/user",
                        "Cargando perfil..."
                      )}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi perfil
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {role === 'provider' ? 'Profesional' : 'Usuario'}
                      </span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;