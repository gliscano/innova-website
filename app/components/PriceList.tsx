"use client"

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import Image from 'next/image'

const prices = [
    { width: 2.90, length: 2.0, price: 40396 },
    { width: 2.90, length: 2.5, price: 46370 },
    { width: 2.90, length: 3.0, price: 52560 },
    { width: 2.90, length: 3.5, price: 58754 },
    { width: 2.90, length: 4.0, price: 64829 },
    { width: 2.90, length: 4.5, price: 71160 },
    { width: 2.90, length: 5.0, price: 77372 },
    { width: 1.50, length: 2.0, price: 24836 },
    { width: 1.50, length: 2.5, price: 27577 },
    { width: 1.50, length: 3.0, price: 30672 },
    { width: 1.50, length: 3.5, price: 33769 },
    { width: 1.50, length: 4.0, price: 36807 },
    { width: 1.50, length: 4.5, price: 39972 },
    { width: 1.50, length: 5.0, price: 43078 },
  ]
  
  const sizeGuides = [
    {
      title: 'Retratos Individuales',
      size: '1.5m × 2.0m',
      description: 'Ideal para fotografía de bebes, retrato individual y decoración de tiendas',
      image: '/images/innova/backdrops-child-size.png',
    },
    {
      title: 'Parejas',
      size: '1.5m × 2.5m',
      description: 'Perfecto para sesiones de pareja, fotos de pie o retratos de dos personas',
      image: '/images/innova/backdrops-couples-size.png',
    },
    {
      title: 'Grupos Pequeños',
      size: '2.9m × 3.0m',
      description: 'Recomendado para para familias pequeñas o grupos de 3-4 personas y decoración de eventos',
      image: '/images/innova/backdrops-small-size.png',
    },
    {
      title: 'Grupos Grandes',
      size: '2.9m × 4.0m',
      description: 'Recomendado para familias grandes o grupos numerosos y decoración de eventos',
      image: '/images/innova/backdrops-large-size.png',
    },
  ]
  
  export default function PriceList() {
    const animationRef = useRef<HTMLElement>(null)

    const wideBackdrops = prices.filter(p => p.width === 2.90)
    const standardBackdrops = prices.filter(p => p.width === 1.50)

    useEffect(() => {
      animationRef.current =
          lottie.loadAnimation({
            container: document.getElementById('animated-lottie'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/list.json',
          })
    }, [])
  
    return (
      <div className="bg-gray-50">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-6 lg:pt-14">
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-6 py-6 sm:py-6 lg:px-8 flex justify-around">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:gap-x-16 lg:gap-y-6 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-xl copperplate-bold-font tracking-tight text-gray-900 sm:text-5xl lg:col-span-2">
                Lista de medidas y precios
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1">
                <p className="text-lg leading-8 text-gray-600">
                  Encuentra el tamaño perfecto para tus necesidades. Tenemos medidas estándar y personalizadas!!!
                </p>
              </div>
            </div>
            <div
                ref={animationRef}
                id='animated-lottie'
                className="h-36 py-2"
              ></div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-12 bg-gradient-to-t from-white sm:h-16" />
        </div>
  
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          {/* Size Guide Section */}
          <div className="mt-8">
            <h3 className="text-2xl copperplate-condensed-bold-font text-gray-900 mb-4 text-center">Guía de Tamaños Recomendados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sizeGuides.map((guide, index) => (
                <div key={index} className={`${index > 1 ? 'bg-rose-gold' : 'bg-yellow-gold-light'} bg-opacity-50 rounded-xl shadow-sm p-6 flex flex-col items-center text-center`}>
                  <div className="w-40 h-40 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-violet-600">
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        className="object-contain"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{guide.title}</h4>
                  <p className="font-semibold text-rose-800 font-medium py-1 px-2 mb-2 bg-white rounded-2xl">{guide.size}</p>
                  <p className="text-gray-800 text-sm">{guide.description}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* fabric Pricing Section */}
          <h3 className="text-2xl copperplate-condensed-bold-font text-gray-900 mt-8 lg:mt-16 text-center">
            Lista de precios - Set y Fondos en Tela
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14 mt-8">
            {/* Standard Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-yellow-gold-light">
                <h3 className="text-xl font-bold text-gray-900">Fondos Estándar (Ancho: 1.50m)</h3>
                <p className="mt-1 text-sm text-yellow-900">Perfectos para sesiones individuales, parejas y decoración de tiendas</p>
              </div>
              <div className="divide-y divide-gray-200">
                {standardBackdrops.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.width.toFixed(2)}m × {item.length.toFixed(1)}m
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.length).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wide Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-rose-gold">
                <h3 className="text-xl font-bold text-gray-900">Fondos Grandes (Ancho: 2.90m)</h3>
                <p className="mt-1 text-sm text-gray-900">Ideales para grupos, familias y decoración de eventos</p>
              </div>
              <div className="divide-y divide-gray-200">
                {wideBackdrops.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.width.toFixed(2)}m × {item.length.toFixed(1)}m
                          </p>
                          <p className="text-sm text-gray-900">
                            Área total: {(item.width * item.length).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* fabric Pricing Section */}
          <h3 className="text-2xl copperplate-condensed-bold-font text-gray-900 mt-8 text-center">
            Lista de precios - Productos diseñados por Innova
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14 mt-8">
            {/* Standard Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-teal-500">
                <h3 className="text-xl font-bold text-teal-900">Fondos para Mascotas - InnPets</h3>
                <p className="mt-1 text-sm text-teal-950">Los mejores diseños para peluditos de la casa</p>
              </div>
              <div className="divide-y divide-gray-200">
                {standardBackdrops.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.width.toFixed(2)}m × {item.length.toFixed(1)}m
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.length).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wide Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-pink-900">
                <h3 className="text-xl font-bold text-gray-100">Fondos Hibridos (Tela y Piso en Símil de neoprene)</h3>
                <p className="mt-1 text-sm text-gray-100">Combinamos las mejores texturas para lograr una experiencia superior</p>
              </div>
              <div className="divide-y divide-gray-200">
                {wideBackdrops.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.width.toFixed(2)}m × {item.length.toFixed(1)}m
                          </p>
                          <p className="text-sm text-gray-900">
                            Área total: {(item.width * item.length).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }