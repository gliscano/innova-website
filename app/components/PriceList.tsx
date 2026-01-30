"use client"

import { useRef } from 'react'
import Image from 'next/image'
import {
  propertiesBackdrops,
  propertiesHybridBackdrops,
  propertiesFloor,
  propertiesInnPets,
  propertiesRooms,
} from '../data/pricesData'

  const sizeGuides = [
    {
      title: 'Retratos Individuales',
      size: '1.5m × 2.0m',
      description: 'Ideal para fotografía de bebés, retratos individuales y decoración de espacios pequeños',
      image: '/images/innova/child-size.png',
    },
    {
      title: 'Parejas',
      size: '2.0m × 2.5m',
      description: 'Perfecto para sesiones de pareja, fotos de pie o retratos de dos personas con encuadres de cuerpo completo',
      image: '/images/innova/backdrops-couples-size.png',
    },
    {
      title: 'Grupos Pequeños',
      size: '2.9m × 3.0m',
      description: 'Recomendado para familias pequeñas o grupos de 3-4 personas, con mayor profundidad de escena',
      image: '/images/innova/backdrops-small-size.png',
    },
    {
      title: 'Grupos Grandes',
      size: '2.9m × 5.0m',
      description: 'Recomendado para familias grandes o grupos numerosos y decoración de eventos permitiendo encuadres amplios y mayor separación del fondo',
      image: '/images/innova/backdrops-large-size.png',
    },
  ]
  
  export default function PriceList() {
    const wideBackdrops = useRef(propertiesBackdrops.filter(p => p.width === 2.90))
    const standardBackdrops = useRef(propertiesBackdrops.filter(p => p.width === 1.50))
  
    return (
      <section className="bg-gray-50 bg-opacity-70" id="prices">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
          <div className="mx-auto max-w-7xl px-6 py-6 sm:py-6 lg:px-8 flex justify-around">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:gap-x-16 lg:gap-y-6 xl:grid-rows-1 xl:gap-x-8">
              <h2 className="max-w-2xl text-2xl copperplate-bold-font tracking-tight text-gray-900 sm:text-4xl lg:col-span-2">
                Lista de medidas y precios
              </h2>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-12 bg-gradient-to-t from-white sm:h-16" />
        </div>
  
        <div className="mx-auto max-w-7xl px-6 py-4  lg:px-8">  
          {/* fabric Pricing Section */}  
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-2">
            {/* Standard Backdrops */}
            <div className=" bg-white bg-op rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 gradient-gold-colors">
                <h3 className="text-xl font-bold text-gray-900">Fondos Pequeños (Ancho: 1.50m)</h3>
                <p className="mt-1 text-sm text-yellow-900">Perfectos para sesiones individuales, parejas y decoración de tiendas</p>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="flex items-center py-2 px-4 font-medium text-gray-900 bg-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0 w-1/2">
                    <p>Dimensiones</p>
                  </div>
                  <div className="w-1/4 text-center">
                    <p>Color Vivo HD</p>
                  </div>
                  <div className="w-1/4 text-center">
                    <p>Neon (Fluo)</p>
                  </div>
                </div>
                {standardBackdrops.current.map((item, index) => (
                  <div key={index} className="flex py-2 px-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0 w-1/2">
                      <div className="flex items-left gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {`${item.width.toFixed(2)}m × ${item.height.toFixed(1)}m`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.height).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/4 text-center">
                      <p className="font-medium text-blue-700 m-1 rounded-xl">
                        ${item.price.toLocaleString("es-AR")}
                      </p>
                    </div>
                    {item.priceFluo && (
                      <div className="w-1/4 text-center">
                        <p className="font-medium m-1 text-teal-700 rounded-xl">
                          ${item.priceFluo?.toLocaleString("es-AR")}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Wide Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 gradient-yellow-gold-colors">
                <h3 className="text-xl font-bold text-gray-900">Fondos Grandes (Ancho: 2.90m)</h3>
                <p className="mt-1 text-sm text-yellow-900">Ideales para grupos, familias y decoración de eventos</p>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="flex items-center py-2 px-4 font-medium text-gray-900 bg-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0 w-1/2">
                    <p>Dimensiones</p>
                  </div>
                  <div className="w-1/4 text-center">
                    <p>Color Vivo HD</p>
                  </div>
                  <div className="w-1/4 text-center">
                    <p>Neon (Fluo)</p>
                  </div>
                </div>
                {wideBackdrops.current.map((item, index) => (
                  <div key={index} className="flex items-center py-2 px-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0 w-1/2">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {`${item.width.toFixed(2)}m × ${item.height.toFixed(1)}m`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.height).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/4 text-center">
                      <p className="font-medium text-blue-700 m-1 rounded-xl">
                        ${item.price.toLocaleString("es-AR")}
                      </p>
                    </div>
                    {item.priceFluo && (
                      <div className="w-1/4 text-center">
                        <p className="font-medium m-1 text-teal-700 rounded-xl">
                          ${item.priceFluo?.toLocaleString("es-AR")}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Room Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 gradient-rose-gold-colors">
                <h3 className="text-xl font-bold text-gray-900">Fondos Room</h3>
                <p className="mt-1 text-sm text-gray-900">Vive una sesión con perspectivas diferentes  </p>
              </div>
              <div className="divide-y divide-gray-200">
                {propertiesRooms.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {`Dimensiones: ${item.width.toFixed(2)}m × ${item.height.toFixed(1)}m`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.height).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        ${item.price.toLocaleString("es-AR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* InnPets Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 gradient-rose-gold-colors">
                <h3 className="text-xl font-bold text-gray-900">Fondos para Mascotas - InnPets</h3>
                <p className="mt-1 text-sm text-gray-900">Los mejores diseños para peluditos de la casa</p>
              </div>
              <div className="divide-y divide-gray-200">
                {propertiesInnPets.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {`Dimensiones: ${item.width.toFixed(2)}m × ${item.height.toFixed(1)}m`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.height).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        ${item.price.toLocaleString("es-AR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Hybrid Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 gradient-rose-gold-colors">
                <h3 className="text-xl font-bold text-gray-900">Fondos Hibridos (Tela y Piso en Símil de neoprene)</h3>
                <p className="mt-1 text-sm text-gray-900">Combinamos las mejores texturas para lograr una experiencia superior.</p>
              </div>
              <div className="divide-y divide-gray-200">
                {propertiesHybridBackdrops.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {`Dimensiones: ${item.width.toFixed(2)}m × ${item.height.toFixed(1)}m`}
                          </p>
                          <p className="text-sm text-gray-900">
                            {`${item.description} / Área total: ${(item.width * item.height).toFixed(1)}m²`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">
                        ${item.price.toLocaleString("es-AR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* floor Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 gradient-rose-gold-colors">
                <h3 className="text-xl font-bold text-gray-900">Pisos y Alfombras</h3>
                <p className="mt-1 text-sm text-gray-900">Proporciona una superficie suave y flexible </p>
              </div>
              <div className="divide-y divide-gray-200">
                {propertiesFloor.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {`Dimensiones: ${item.width.toFixed(2)}m × ${item.height.toFixed(1)}m`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.height).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        ${item.price.toLocaleString("es-AR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Size Guide Section */}
          <div className="py-6 mb-8">
            <h3 className="text-2xl copperplate-condensed-bold-font text-gray-900 mb-4 text-center">Guía de Tamaños Recomendados</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
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
                  <p className="text-rose-800 font-medium py-1 px-2 mb-2 bg-white rounded-2xl">{guide.size}</p>
                  <p className="text-gray-800 text-sm">{guide.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }