import Hero from "@/components/Hero/Hero";
import Image from 'next/image';

export default async function Home() {


  return (
    <main>
      <div>
        <Hero />
      </div>
      {/*----CONSULTAS MAS FRECUENTES----*/}
      <h1 className="title1">Consultas más frecuentes</h1>
      <section className="grid-cols-3 flex justify-center gap-10 mb-7">
        {/*CARD 1*/}
        <div className="bg-white rounded-xl p-4 w-[350px] h-auto">
          <Image
            src="/Sobrepeso-y-obesidad.jpg"
            alt="Consulta virtual"
            width={400}
            height={400}
            className="rounded-xl object-cover"
            priority
          />
          <h2 className="title2">Obesidad</h2>
          <p className="text-gray-600 text-sm mb-4 px-2 py-1">La obesidad es una condición médica caracterizada por la acumulación excesiva de grasa corporal que puede ser perjudicial para la salud. Se considera un factor de riesgo para diversas enfermedades crónicas. </p>
        </div>
        {/*CARD 2*/}
        <div className="bg-white rounded-xl p-4 w-[350px] h-auto">
          <Image
            src="/trastornos3.jpeg"
            alt="Consulta virtual"
            width={400}
            height={400}
            className="rounded-xl object-cover"
            priority
          />
          <h2 className="title2">Trastornos alimenticios</h2>
          <p className="text-gray-600 text-sm mb-4 px-2 py-1">Los trastornos de la conducta alimentaria (TCA) son enfermedades psiquiátricas complejas, multicausadas, que afectan principalmente a adolescentes y mujeres jóvenes.</p>
        </div>
        {/*CARD 3*/}
        <div className="bg-white rounded-xl p-4 w-[350px] h-auto">
          <Image
            src="/diabetes2.jpeg"
            alt="Consulta virtual"
            width={400}
            height={400}
            className="rounded-xl object-cover"
            priority
          />
          <h2 className="title2">Diabetes</h2>
          <p className="text-gray-600 text-sm mb-4 px-2 py-1">La diabetes es una enfermedad crónica en la que el cuerpo no puede regular adecuadamente los niveles de glucosa en la sangre, lo que puede provocar daños en órganos y sistemas del cuerpo.</p>
        </div>
      </section>

    
    </main>
  );
}

