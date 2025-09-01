'use client';

import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import BackButton from '../BackButton/BackButton';

export default function VittaBlog() {
  const blogPosts = [
    {
      id: 1,
      title: "Tendencias en nutrición 2025: alimentación consciente y microbiota",
      excerpt:
        "Descubre por qué la salud intestinal, el ayuno intermitente personalizado y la nutrición basada en plantas siguen marcando la pauta este año.",
      author: "Dra. Camila Peralta",
      date: "Junio 2025",
      readTime: "8 min",
      category: "Tendencias",
      image: "/articulo6.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "Nutrición y salud mental: la conexión cuerpo-mente",
      excerpt:
        "La ciencia ha confirmado lo que intuíamos: lo que comemos impacta directamente en nuestras emociones, energía y concentración.",
      author: "Lic. Martín Ríos",
      date: "Mayo 2025",
      readTime: "6 min",
      category: "Bienestar",
      image: "/articulo3.jpg",
      featured: false,
    },
    {
      id: 3,
      title: "Dieta antiinflamatoria: aliada en enfermedades crónicas",
      excerpt:
        "Cada vez más profesionales recomiendan este enfoque para pacientes con diabetes tipo 2, artritis, obesidad o síndrome metabólico.",
      author: "Dra. Laura Esquivel",
      date: "Abril 2025",
      readTime: "10 min",
      category: "Salud",
      image: "/articulo4.webp",
      featured: false,
    },
  ];

  const categories = ["Todos", "Tendencias", "Bienestar", "Salud", "Nutrición"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 to-green-50 py-16 text-center">
        <div className="absolute top-24 left-4 z-10"> {/* Cambié top-4 a top-24 */}
          <BackButton />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-4">
            <TrendingUp className="w-8 h-8 text-teal-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Vitta al día</h1>
          </div>
          <p className="text-xl text-teal-600 font-semibold mb-4">ConCiencia Nutricional</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre las últimas tendencias, investigaciones y consejos prácticos de nuestros expertos en nutrición para transformar tu bienestar.
          </p>
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "Todos"
                    ? "bg-teal-100 text-teal-700 border border-teal-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Artículo destacado */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <Tag className="w-5 h-5 text-teal-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Artículo destacado</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/2">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                    {blogPosts[0].category}
                  </span>
                  <span className="ml-3 text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {blogPosts[0].readTime}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{blogPosts[0].title}</h3>
                <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{blogPosts[0].author}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {blogPosts[0].date}
                      </p>
                    </div>
                  </div>
                  <Link target="_blank" href="https://www.revistaalimentaria.es/consumidora/alimentacion-deportiva/tendencias-nutricion-2025-mejores-habitos-alimenticios-entrenamiento">
                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium flex items-center">
                    Leer más <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artículos regulares */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Más artículos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="mr-4">{post.readTime}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-teal-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-2">
                        <User className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                    </div>

                    <button className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      Leer más
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <section className="bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">¿Te gustó nuestro contenido?</h3>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe los mejores consejos nutricionales directamente en tu correo.
          </p>
        </section>
      </main>
    </div>
  );
}

