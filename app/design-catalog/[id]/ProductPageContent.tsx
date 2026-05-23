'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/app/components/Header"
import { HomeSizePickerWithPrices } from "@/app/components/HomeSizePickerWithPrices"
import Gallery from "@/app/components/gallery/Gallery"
import WhatsAppDropdown from "@/app/components/WhatsAppDropdown"
import { useSelectedSize } from "@/app/context/SelectedSizeContext"
import { SizeSelectorCompact } from "@/app/components/SizeSelectorCompact"
import { trackViewContent } from "@/app/utils/tracking"
import { formatFolderName } from "@/app/utils/catalogUtils"

interface ProductPageContentProps {
  id: string
}

function StickyProductBar({ title }: { title: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 70)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E7DFD2] transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between gap-3">
        <Link href="/#catalog" className="flex items-center gap-1.5 text-sm text-[#6B5F52] shrink-0">
          ← Catálogo
        </Link>
        <span className="copperplate-bold-font text-sm font-bold text-[#1F1A14] truncate">{title}</span>
        <a
          href={`https://wa.me/5491171419752?text=${encodeURIComponent(`Hola, quiero consultar sobre el catálogo: ${title}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-3 py-1.5 rounded-full"
        >
          <Image src="/svg/whatsapp.svg" alt="" width={14} height={14} />
          Comprar
        </a>
      </div>
    </div>
  )
}

function SelectedSizeBanner() {
  const { selectedSize, setSelectedSize } = useSelectedSize()
  const [expanded, setExpanded] = useState(false)

  if (selectedSize) {
    return (
      <div className="flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-amber-700 font-medium leading-none mb-0.5">Tamaño elegido</p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {selectedSize.label}
              {selectedSize.fromPrice && (
                <span className="ml-2 font-normal text-amber-700">
                  ${selectedSize.fromPrice.toLocaleString('es-AR')}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setSelectedSize(null); setExpanded(true) }}
          className="text-xs text-amber-600 hover:text-amber-800 underline underline-offset-2 shrink-0 transition-colors"
        >
          Cambiar
        </button>
      </div>
    )
  }

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm text-gray-700 font-semibold">Elegí la medida de tu fondo</span>
          <span className="text-xs text-gray-400 leading-none mt-0.5">Te mostramos el precio al instante</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 py-4 bg-white">
          <SizeSelectorCompact onSelect={(size) => { setSelectedSize(size); setExpanded(false) }} variant="light" />
        </div>
      )}
    </div>
  )
}

export default function ProductPageContent({ id }: ProductPageContentProps) {
  const folderName = decodeURIComponent(id)
  const title = formatFolderName(folderName)

  useEffect(() => {
    trackViewContent(title, folderName)
  }, [title, folderName])

  return (
    <div className="min-h-screen bg-gray-50 bg-opacity-40 pb-6">
      <StickyProductBar title={title} />
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-2">

        {/* Breadcrumb compacto */}
        <nav className="flex items-center gap-1.5 text-sm text-[#6B5F52] mb-3" aria-label="Breadcrumb">
          <Link href="/#catalog" className="hover:text-[#1F1A14] transition-colors">← Catálogo</Link>
          <span>/</span>
          <span className="text-[#1F1A14] font-medium">{title}</span>
        </nav>

        {/* Título + CTAs */}
        <div className="mb-5">
          <h1 className="copperplate-bold-font text-2xl sm:text-3xl font-bold text-[#4a3a2a] leading-tight mb-4">
            {title}
          </h1>

          <div className="flex flex-col gap-2">
            <Link
              href="#information"
              className="w-full gradient-green-colors text-black px-4 py-3 rounded-md font-semibold flex items-center justify-center gap-2 text-center"
            >
              Información y cómo comprar
            </Link>
            <Link
              href="#prices"
              className="text-center text-sm text-[#6B5F52] underline underline-offset-2 hover:text-[#1F1A14] transition-colors py-1"
            >
              Ver precios y medidas →
            </Link>
          </div>
        </div>

        <section id="catalog" className="min-h-screen flex flex-col">
          <SelectedSizeBanner />
          <div className="flex-grow">
            <Gallery
              searchTerm={folderName}
              folder={folderName}
              tags={[]}
              itemsPerPage={100}
            />
          </div>
        </section>

        <div id="information" className="bg-white rounded-lg p-4">
          <h3 className="text-xl copperplate-bold-font font-bold text-gray-900 mb-3">Información del Producto</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Tiempo de entrega</h3>
                  <p className="text-gray-600">12 días hábiles</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">¿Lo necesitás antes?</h3>
                  <p className="text-gray-600 mb-2">Mirá nuestros Fondos en Stock, con entrega inmediata.</p>
                  <Link
                    href="https://innova54store.empretienda.com.ar/productos-en-stock"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                  >
                    Ver Fondos en Stock
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Personalización incluida</h3>
                  <p className="text-gray-600">
                    Incluye la personalización del piso si lo deseás, con 3 opciones adaptadas al diseño, sin costo adicional.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Medidas estándar y Personalizadas</h3>
                  <ul className="text-gray-600 list-disc ml-4 space-y-1">
                    <li>Ancho a partir de 0.75 m</li>
                    <li>Largo a partir de 1 m</li>
                    <li>¡También hacemos fondos personalizados!</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">¿Cómo compras? Super fácil</h3>
                  <ol className="text-gray-600 list-decimal ml-4 space-y-1">
                    <li>Elegí un diseño del catálogo o envíanos una referencia</li>
                    <li>Escríbenos para definir el diseño y las opciones de piso</li>
                  </ol>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Materiales Premium</h3>
                  <ul className="text-gray-600 list-disc ml-4 space-y-1">
                    <li>Tela lavable, plegable y antiarrugas</li>
                    <li>Cero rebote de luz</li>
                    <li>Colores vibrantes y duraderos</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start flex-col gap-3">
                <WhatsAppDropdown
                  message={`Hola, estoy interesado en el catálogo de diseño: ${title}.\nQuiero comprar o consultar sobre esta categoría.\n¿Podrían ayudarme con más información?`}
                  buttonText="Quiero comprar o consultar"
                  className="w-full gradient-green-colors text-black px-2 py-1 rounded-md font-medium sm:text-lg flex items-center justify-center gap-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeSizePickerWithPrices sectionId="prices" />
    </div>
  )
}
