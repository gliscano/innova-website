"use client"

import { useState, useMemo } from "react"
import Image from "next/image"

// Datos de ejemplo basados en el catálogo actual
const catalogData = [
  {
    id: 1,
    title: "Catálogo de Pascuas",
    category: "Pascuas",
    image: "/placeholder.svg?height=300&width=400",
    description: "Diseños especiales para celebrar la Pascua con estilo",
    tags: ["pascuas", "celebración", "primavera"],
    featured: true,
    sizes: ["1x1m", "2x2m", "3x3m"],
  },
  {
    id: 2,
    title: "Catálogo de Infantiles",
    category: "Infantiles",
    image: "/placeholder.svg?height=300&width=400",
    description: "Diseños divertidos y coloridos para fotografía infantil",
    tags: ["niños", "infantil", "colorido"],
    featured: false,
    sizes: ["1x1m", "2x2m"],
  },
  {
    id: 3,
    title: "Fondos para Mascotas",
    category: "Mascotas",
    image: "/placeholder.svg?height=300&width=400",
    description: "Fondos especializados para fotografía de mascotas",
    tags: ["mascotas", "animales", "pets"],
    featured: true,
    sizes: ["2x2m", "3x3m"],
  },
  {
    id: 4,
    title: "Catálogo de Boho",
    category: "Boho",
    image: "/placeholder.svg?height=300&width=400",
    description: "Estilo bohemio elegante para sesiones únicas",
    tags: ["boho", "elegante", "bohemio"],
    featured: false,
    sizes: ["1.5x1.5m", "2x2m"],
  },
  {
    id: 5,
    title: "Catálogo Escolar",
    category: "Escolar",
    image: "/placeholder.svg?height=300&width=400",
    description: "Diseños perfectos para fotografía escolar",
    tags: ["escolar", "educación", "estudiantes"],
    featured: false,
    sizes: ["1x1m", "1.5x1.5m", "2x2m"],
  },
  {
    id: 6,
    title: "Catálogo de Fachadas",
    category: "Fachadas",
    image: "/placeholder.svg?height=300&width=400",
    description: "Fondos arquitectónicos y urbanos",
    tags: ["arquitectura", "urbano", "fachadas"],
    featured: false,
    sizes: ["2x3m", "3x3m"],
  },
  {
    id: 7,
    title: "Baby Shower",
    category: "Baby Shower",
    image: "/placeholder.svg?height=300&width=400",
    description: "Diseños especiales para revelación de género y baby shower",
    tags: ["baby shower", "gender reveal", "bebé"],
    featured: true,
    sizes: ["1x1m", "2x2m"],
  },
  {
    id: 8,
    title: "Catálogo de Escaleras",
    category: "Escaleras",
    image: "/placeholder.svg?height=300&width=400",
    description: "Fondos con escaleras para composiciones dinámicas",
    tags: ["escaleras", "arquitectura", "dinámico"],
    featured: false,
    sizes: ["2x2m", "2x3m"],
  },
  {
    id: 9,
    title: "Fondo Personalizado",
    category: "Personalizado",
    image: "/placeholder.svg?height=300&width=400",
    description: "Diseños completamente personalizados según tus necesidades",
    tags: ["personalizado", "único", "custom"],
    featured: true,
    sizes: ["Cualquiera"],
  },
]

const categories = [
  "Todos",
  "Pascuas",
  "Infantiles",
  "Mascotas",
  "Boho",
  "Escolar",
  "Fachadas",
  "Baby Shower",
  "Escaleras",
  "Personalizado",
]

export default function DesignCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProduct, setSelectedProduct] = useState<(typeof catalogData)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const filtered = catalogData.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Ordenar productos
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  const openModal = (product: (typeof catalogData)[0]) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Todos")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y búsqueda */}
        <div className="mb-8 space-y-4">
          {/* Barra de búsqueda principal */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar diseños, categorías, estilos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? "Todos" : category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Controles avanzados */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="featured">Destacados</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{filteredProducts.length} diseños encontrados</span>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                  } rounded-l-lg border-r border-gray-300`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                  } rounded-r-lg`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.featured && (
                  <span className="absolute top-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-white">
                    Destacado
                  </span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => openModal(product)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Vista Previa
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {product.category}
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                    Ver Catálogo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado vacío */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron diseños</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
            <button
              onClick={clearFilters}
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedProduct.title}</h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <span className="sr-only">Cerrar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.title}
                    width={600}
                    height={400}
                    className="w-full rounded-lg"
                  />
                  <div className="space-y-4">
                    <div>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {selectedProduct.category}
                      </span>
                    </div>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 text-blue-600 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <h4 className="font-medium">Tiempo de entrega</h4>
                          <p className="text-sm text-gray-600">12 días hábiles</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 text-blue-600 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <div>
                          <h4 className="font-medium">¿Lo necesitás antes?</h4>
                          <p className="text-sm text-gray-600">Mirá nuestros Fondos en Stock, con entrega inmediata.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 text-blue-600 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                          />
                        </svg>
                        <div>
                          <h4 className="font-medium">Personalización incluida</h4>
                          <p className="text-sm text-gray-600">
                            Incluye la personalización del piso si lo deseás, con 3 opciones adaptadas al diseño, sin
                            costo adicional.
                          </p>
                        </div>
                      </div>
                    </div>




                    <div className="space-y-2">
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                        Ver Catálogo de diseños
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
