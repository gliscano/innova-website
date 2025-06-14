import Image from "next/image"
import Link from "next/link"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import { getCatalogItemByIndex } from "@/app/utils/catalogUtils"
import { catalogData } from "@/app/data/catalogData"
import PriceList from "@/app/components/PriceList"
import { use } from "react"

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
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getCatalogItemByIndex(Number.parseInt(params.id))

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
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

  return (
    <div className="min-h-screen bg-gray-50">
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
              {product.featured && (
                <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
                  Destacado
                </span>
              )}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl copperplate-bold-font font-bold text-gray-900 mb-4">{product.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.description}</p>
              <div className="flex flex-wrap gap-2">
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
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors text-lg">
                Ver Catálogo Completo
              </button>
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl copperplate-bold-font font-bold text-gray-900 mb-8">Información del Producto</h2>

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
                  <h3 className="text-lg font-semibold text-gray-900">Tiempo de entrega</h3>
                  <p className="text-gray-600">12 días hábiles</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">¿Lo necesitás antes?</h3>
                  <p className="text-gray-600">Mirá nuestros Fondos en Stock, con entrega inmediata.</p>
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
                  <h3 className="text-lg font-semibold text-gray-900">Personalización incluida</h3>
                  <p className="text-gray-600">
                    Incluye la personalización del piso si lo deseás, con 3 opciones adaptadas al diseño, sin costo
                    adicional.
                  </p>
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
                  <h3 className="text-lg font-semibold text-gray-900">¿Cómo comprar?</h3>
                  <ol className="text-gray-600 list-decimal ml-4 space-y-1">
                    <li>Elegí un diseño del catálogo</li>
                    <li>Ve a Productos y Fondos personalizados</li>
                    <li>Seleccioná la medida y realizá tu compra</li>
                    <li>Escribenos para definir el diseño y las opciones de piso</li>
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
                  <h3 className="text-lg font-semibold text-gray-900">Materiales Premium</h3>
                  <ul className="text-gray-600 list-disc ml-4 space-y-1">
                    <li>Tela lavable, plegable y antiarrugas</li>
                    <li>Cero rebote de luz</li>
                    <li>Colores vibrantes y duraderos</li>
                  </ul>
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
                  <h3 className="text-lg font-semibold text-gray-900">Medidas estándar y Personalizadas</h3>
                  <ul className="text-gray-600 list-disc ml-4 space-y-1">
                    <li>Anchos disponibles: 2,90 m y 1,50 m</li>
                    <li>Largos: desde 1 m hasta 30 m</li>
                    <li>¿Otra medida? ¡También hacemos fondos personalizados!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PriceList />
      <Footer />
    </div>
  )
}
