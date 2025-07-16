"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function InnovaNavidad() {
  const [currentSlide, setCurrentSlide] = useState(0)


  const slides = [
    { id: 1, image: "/images/innova/navidad/1.jpg" },
    { id: 2, image: "/images/innova/navidad/2.jpg" },
    { id: 3, image: "/images/innova/navidad/3.jpg" },
    { id: 4, image: "/images/innova/navidad/4.jpg" },
    { id: 5, image: "/images/innova/navidad/5.jpg" },
    { id: 6, image: "/images/innova/navidad/6.jpg" },
    { id: 7, image: "/images/innova/navidad/7.jpg" },
    { id: 8, image: "/images/innova/navidad/8.jpg" },
    { id: 9, image: "/images/innova/navidad/9.jpg" },
    { id: 10, image: "/images/innova/navidad/10.jpg" },
    { id: 11, image: "/images/innova/navidad/11.jpg" },
    { id: 12, image: "/images/innova/navidad/12.jpg" },
    { id: 13, image: "/images/innova/navidad/13.jpg" },
    { id: 14, image: "/images/innova/navidad/14.jpg" },
    { id: 15, image: "/images/innova/navidad/15.jpg" },
    { id: 16, image: "/images/innova/navidad/16.jpg" },
    { id: 17, image: "/images/innova/navidad/17.jpg" },
    { id: 18, image: "/images/innova/navidad/18.jpg" },
    { id: 19, image: "/images/innova/navidad/19.jpg" },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-red-900 to-amber-900 relative overflow-hidden">
      {/* Efectos de fondo navideños */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-pulse">❄️</div>
        <div className="absolute top-32 right-20 text-4xl animate-bounce">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse">🎄</div>
        <div className="absolute bottom-32 right-10 text-3xl animate-bounce">✨</div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href='/'>
              <Image
                src="/images/innova/logo-navidad.png"
                alt="Innova Logo"
                width={185}
                height={45}
                className="w-auto"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              Inicio
            </Link>
            <a href="https://store.innova54.com/" className="text-white/80 hover:text-white transition-colors">
              Ir a la tienda
            </a>
          </nav>
        </div>
      </header>

      {/* Carrusel Principal */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src={slides[currentSlide].image}
            alt={`Navidad ${currentSlide + 1}`}
            className="w-full h-full object-cover"
            width={0}
            height={0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Controles del carrusel */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          <Image
            aria-hidden
            src="svg/chevron-left.svg"
            alt="left btn"
            className="w-6 h-6 text-white"
            width={6}
            height={6}
          />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          <Image
            aria-hidden
            src="svg/chevron-right.svg"
            alt="right btn"
            className="w-6 h-6 text-white"
            width={6}
            height={6}
          />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-40">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>

        {/* Contenido principal */}
        <div className="absolute inset-0 flex items-end justify-center z-30 pb-16">
          <div className="text-center max-w-3xl px-6">
            {/* Información del diseño actual */}
            <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Navidad Exclusiva</h2>
              <p className="text-sm md:text-base text-white/80 mb-3">Los diseños serán producidos en una única edición</p>

              {/* Mensaje de exclusividad más sutil */}
              <div className="flex items-center justify-center text-yellow-400">
                <span className="text-sm font-medium">Solo 1 vez • Solo en Innova</span>
              </div>
            </div>

            {/* Botones de acción principales */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => window.open("https://drive.google.com/drive/folders/1MVQMUS5hrYVv--SfBZtchrz5Ev9HlGX5?usp=sharing", "_self")}
                className="inline-flex items-center justify-center bg-red-600/90 hover:bg-red-700 text-white px-6 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 backdrop-blur-sm"
              >
                Ver Catálogo
              </button>

              <button
                onClick={() => window.open("https://innova54.com/prices", "_self")}
                className="inline-flex items-center justify-center border border-white/50 text-white hover:bg-white/10 px-6 py-3 font-semibold rounded-full backdrop-blur-sm transition-all transform hover:scale-105 bg-white/5"
              >
                Ver los Precios y Medidas
              </button>

              <button
                onClick={() => window.open("https://wa.me/5491171142152", "_blank")}
                className="inline-flex items-center justify-center border border-white/50 text-white hover:bg-white/10 px-6 py-3 font-semibold rounded-full backdrop-blur-sm transition-all transform hover:scale-105 bg-white/5"
              >
                Quiero hacer mi pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
