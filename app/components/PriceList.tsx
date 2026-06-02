"use client"

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  propertiesBackdrops,
  propertiesHybridBackdrops,
  propertiesFloor,
} from '../data/pricesData'
import { defaultOptions } from './WhatsAppDropdown'

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
  
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
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
              <div className="p-3 gradient-gold-colors">
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
            {/* Hybrid Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 gradient-rose-gold-colors">
                <h3 className="text-xl font-bold text-gray-900">Fondos Híbridos: Tela y Neoprene</h3>
                <p className="mt-1 text-sm text-gray-900">La combinación perfecta de texturas.</p>
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
                <h3 className="text-xl font-bold text-gray-900">Pisos de Neoprene</h3>
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

        {/* CTA WhatsApp */}
        <div className="mt-10 mb-4 rounded-xl bg-green-50 border border-green-200 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-gray-900">¿Ya elegiste tu diseño?</p>
            <p className="text-sm text-gray-600 mt-0.5">Escribinos y coordinamos el pedido con el tamaño que necesitás.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            {defaultOptions.map((option, i) => (
              <Link
                key={i}
                href={`https://wa.me/${option.phoneNumber}?text=${encodeURIComponent("Hola! Ya elegí mi diseño y quiero consultar el precio y el pedido.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-full transition-colors shadow-sm"
              >
                <Image src="/svg/whatsapp.svg" alt="" width={16} height={16} aria-hidden />
                {option.label}
              </Link>
            ))}
          </div>
        </div>
        </div>
      </section>
    )
  }