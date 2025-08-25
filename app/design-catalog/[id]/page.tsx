'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import { getCatalogItemByCategory } from "@/app/utils/catalogUtils"
import PriceList from "@/app/components/PriceList"
import Gallery from "@/app/components/gallery/Gallery"
import { CatalogItem } from "@/app/data/catalogData"

const ChevronIcon = () => (
  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

interface ProductPageProps {
  params: Promise<{ [id: string]: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const id = React.use(params).id
  const product: CatalogItem | undefined = getCatalogItemByCategory(decodeURIComponent(id))

  const getUrlLink = (url: string | null) => {
    if (typeof url === 'string') {
      return url
    }
    return '#catalog'
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoría no encontrada</h1>
            <Link
              href="/design-catalog"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Volver al Catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleCatalogLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof product.catalogURL !== 'string') {
      event.preventDefault()
      const section = document.getElementById('catalog')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="copperplate-condensed-ligth-font inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/design-catalog" className="text-gray-700 hover:text-blue-600 transition-colors">
                Catálogo
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronIcon />
                <span className="text-gray-500 ml-1 md:ml-2">{product.category}</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronIcon />
                <span className="text-gray-500 ml-1 md:ml-2 truncate">{product.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Contenido principal */}
        <div className="grid lg:grid-cols-2 gap-8 mb-6">
          {/* Imagen del producto */}
          <div className="space-y-1">
            <div className="relative">
              <Image
                src={product.image}
                alt={product.title}
                width={800}
                height={420}
                className="w-full rounded-lg"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl copperplate-bold-font font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.description}</p>
              <div className="hidden sm:flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href={getUrlLink(product.catalogURL)}
                onClick={handleCatalogLinkClick}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors text-lg flex items-center justify-center gap-2 group"
              >

                Ver Catálogo de diseños
              </Link>
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-xl copperplate-bold-font font-bold text-gray-900 mb-3">Información del Producto</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Personalización incluida</h3>
                  <p className="text-gray-600">
                    Incluye la personalización del piso si lo deseás, con 3 opciones adaptadas al diseño, sin costo
                    adicional.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
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
              <div className="flex items-start gap-3">
                <button className="w-full bg-green-400 px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-sm sm:text-lg flex items-center justify-center">
                  <Image
                    aria-hidden
                    src="../svg/whatsapp.svg"
                    alt="Whatsapp icon"
                    className="mr-2"
                    width={20}
                    height={20}
                  />
                  Quiero comprar / Quiero más info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        !product.catalogURL && (
          <section id="catalog" className="min-h-screen flex flex-col">
            <div className="flex-grow">
              <Gallery
                searchTerm={product.category}
                tags={product.tags}
                itemsPerPage={100}
              />
            </div>
        </section>
      )}
      <PriceList />
    </div>
  )
}
