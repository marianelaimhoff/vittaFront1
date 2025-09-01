'use client';

import Image from 'next/image';
import BackButton from '../BackButton/BackButton';

export default function AboutUs() {
  
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 font-sans">
        <div className="absolute top-24 left-4 z-10">
          <BackButton />
        </div>
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">Acerca de nosotros</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Imagen */}
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src="/AboutUs.jpg"
            alt="Equipo Vitta"
            fill
            className="object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Texto */}
        <div>
          <p className="text-lg text-gray-700 mb-4">
            En <strong>Vitta</strong>, creemos en el poder de la alimentación y el acompañamiento profesional para transformar vidas.
            Nuestra plataforma conecta a personas con nutricionistas, terapeutas y coaches certificados, comprometidos con brindar atención integral y basada en evidencia.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Nacimos con la misión de facilitar el acceso a profesionales de confianza, promoviendo el bienestar físico, mental y emocional a través de herramientas tecnológicas accesibles y humanas.
          </p>
          <p className="text-lg text-gray-700">
            Estamos en constante evolución, pero nuestro compromiso sigue siendo el mismo: acompañarte en tu camino hacia una vida más saludable, con propósito y consciente.
          </p>
        </div>
      </div>

      {/* Sección de equipo */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">Equipo de desarrollo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col items-center pb-4">
            <div className="relative h-40 w-40 mt-6 rounded-full overflow-hidden">
              <Image
                src="/member-1.jfif"
                alt="Daniela Acevedo"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-secondary">Daniela Acevedo</h3>
              <p className="text-gray-600">Frontend</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col items-center pb-4">
            <div className="relative h-40 w-40 mt-6 rounded-full overflow-hidden">
              <Image
                src="/member-2.jpg"
                alt="Marianela Imhoff"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-secondary">Marianela Imhoff</h3>
              <p className="text-gray-600">Frontend</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col items-center pb-4">
            <div className="relative h-40 w-40 mt-6 rounded-full overflow-hidden">
              <Image
                src="/member-3.jfif"
                alt="Ivan Guarnizo"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-secondary">Ivan Guarnizo</h3>
              <p className="text-gray-600">Backend</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col items-center pb-4">
            <div className="relative h-40 w-40 mt-6 rounded-full overflow-hidden">
              <Image
                src="/member-4.jfif"
                alt="Jose Cespedes"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-secondary">Jose Cespedes</h3>
              <p className="text-gray-600">Backend</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}