'use client';

import { HardHat } from 'lucide-react';
import Link from 'next/link';

export default function NutritionalPlan() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <HardHat className="w-16 h-16 text-yellow-500 animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Página en Construcción</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Estamos trabajando duro para brindarte la mejor experiencia. 
          ¡Vuelve pronto para descubrir las novedades!
        </p>
        
        <div className="space-y-4">
          <Link href="/">
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Volver al Inicio
            </button>
          </Link>
        </div>
      </div>
      
      <div className="mt-12 text-sm text-gray-500">
        <p>¿Necesitas ayuda? <a href="mailto:soporte@vitta.com" className="text-primary hover:underline">Contáctanos</a></p>
      </div>
    </div>
  );
}