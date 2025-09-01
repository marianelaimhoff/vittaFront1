import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ProvidersProvider } from "@/context/ProvidersContext";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { Toaster } from "react-hot-toast";
import { HistoryProvider } from "@/context/HistoryContext"; // Importación añadida

export const metadata: Metadata = {
  title: "Vitta",
  description: "Aplicación de salud y bienestar – Proyecto Final",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Toaster/>
        <Auth0Provider>
          <ProvidersProvider>
            <AuthProvider>
              <HistoryProvider> {/* Envuelve aquí todo el contenido que necesita acceso al historial */}
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </HistoryProvider>
            </AuthProvider>
          </ProvidersProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}