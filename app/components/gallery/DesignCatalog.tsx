"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProductSearch } from "../../hooks/useProductSearch"
import { ProductGridSkeleton } from "./ProductSkeleton"
import { 
  SearchIcon, 
  LoadingSpinner, 
  LightningIcon, 
  CheckIcon, 
  EyeIcon, 
  WarningIcon 
} from "../icons"


export default function InnovaCatalog() {
  const router = useRouter()
  const categoryScrollRef = useRef<HTMLDivElement>(null)
  
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    isSearching,
    searchResult,
    searchResultType,
    remainingAISearches,
    categoriesFromData,
    filteredProducts,
    clearFilters,
    normalizeText
  } = useProductSearch()

  const scrollCategories = (direction: "left" | "right") => {
    const container = categoryScrollRef.current
    if (!container) return
    const amount = Math.floor(container.clientWidth * 0.8)
    container.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  const handleViewDetails = (e: React.MouseEvent, category: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/design-catalog/${encodeURIComponent(category)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
          {/* Filtros y búsqueda */}
          <div className="mb-8 space-y-4">
            {/* Ayuda para búsqueda */}
            <div id="search-help" className="rounded-lg p-2">
              <div className="flex items-center gap-2">
                <p className="text-sm text-blue-800">
                  Busca por categoría, tipo de fotografía, ocasión o estilo. Ejemplos: "navidad", "infantil", "maternidad", "eventos"
                </p>
              </div>
            </div>
            {/* Barra de búsqueda principal */}
            <div className="relative">
              <label htmlFor="catalog-search" className="sr-only">
                Buscar en el catálogo de diseños fotográficos
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? <LoadingSpinner /> : <SearchIcon />}
              </div>
              <input
                id="catalog-search"
                type="text"
                placeholder="Buscar catálogo de diseños"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.length <= 25) {
                    setSearchTerm(value)
                  }
                }}
                maxLength={25}
                aria-describedby="search-help search-counter"
                aria-label="Buscar en el catálogo de diseños fotográficos"
                className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span 
                  id="search-counter"
                  className={`text-xs pr-3 ${searchTerm.length >= 20 ? "text-red-500" : "text-gray-400"}`}
                  aria-label={`${searchTerm.length} de 25 caracteres utilizados`}
                >
                  {searchTerm.length}/25
                </span>
                <LightningIcon />
                <span 
                  className={`text-xs ${remainingAISearches <= 1 ? "text-red-600" : "text-blue-600"}`}
                  aria-label={`Búsquedas con IA disponibles: ${remainingAISearches} de 5`}
                >
                  IA: {remainingAISearches}/5
                </span>
              </div>
            </div>

            {/* Advertencia de cuota IA */}
            {remainingAISearches <= 1 && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <WarningIcon />
                  <p className="text-sm text-red-800">
                    {remainingAISearches === 0
                      ? "Has agotado tus búsquedas con IA por hoy. Se usará búsqueda inteligente local."
                      : "Te queda 1 búsqueda con IA para consultas muy complejas."}
                  </p>
                </div>
              </div>
            )}

            {/* Filtros rápidos - Carrusel */}
            <div className="relative">
              <button
                type="button"
                aria-label="Desplazar categorías a la izquierda"
                onClick={() => scrollCategories("left")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    scrollCategories("left")
                  }
                }}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center h-8 w-8 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div
                ref={categoryScrollRef}
                role="tablist"
                aria-label="Filtros de categorías"
                className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory px-8 py-2 sm:mx-10 sm:overflow-x-hidden"
              >
                {categoriesFromData.map((category, index) => (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={selectedCategory === category}
                    aria-controls={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    tabIndex={selectedCategory === category ? 0 : -1}
                    onClick={() => setSelectedCategory(category === selectedCategory ? "Todos" : category)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault()
                        const nextIndex = (index + 1) % categoriesFromData.length
                        setSelectedCategory(categoriesFromData[nextIndex])
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault()
                        const prevIndex = index === 0 ? categoriesFromData.length - 1 : index - 1
                        setSelectedCategory(categoriesFromData[prevIndex])
                      }
                    }}
                    className={`flex-none snap-start px-4 py-2 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Desplazar categorías a la derecha"
                onClick={() => scrollCategories("right")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    scrollCategories("right")
                  }
                }}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center h-8 w-8 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                <label htmlFor="sort-select" className="sr-only">
                  Ordenar productos por
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Ordenar productos por criterio"
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="featured">Destacados</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{filteredProducts.length} diseños encontrados</span>
                {searchResultType && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      searchResultType === "direct"
                        ? "bg-green-100 text-green-800"
                        : searchResultType === "hybrid"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {searchResultType === "direct" ? "Exacto" : searchResultType === "hybrid" ? "Inteligente" : "IA"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {isSearching ? (
          <ProductGridSkeleton />
        ) : (
          <div 
            role="grid"
            aria-label={`Catálogo de diseños fotográficos. ${filteredProducts.length} productos encontrados`}
            className="grid gap-2 grid-cols-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map((product, index) => {
            const matchingTags =
              searchResult?.tags.filter((tag) =>
                product.tags.some((productTag) => normalizeText(productTag.toLowerCase()) === normalizeText(tag.toLowerCase())),
              ) || []

            return (
              <Link
                key={product.id}
                href={`/design-catalog/${encodeURIComponent(product.category)}`}
                role="gridcell"
                aria-rowindex={Math.floor(index / 4) + 1}
                aria-colindex={(index % 4) + 1}
                aria-label={`${product.title}. ${product.description}. Categoría: ${product.category}`}
                className="bg-white rounded-lg content-between shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 block focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabIndex={0}
              >
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="w-full h-24 object-contain group-hover:scale-105 transition-transform duration-300 mt-1"
                  />
                  {product.featured && (
                    <Image
                      src="/icons/star_featured_icon.png"
                      alt="Producto destacado"
                      width={24}
                      height={24}
                      className="absolute top-0 right-2 p-0.5 inline-flex items-center bg-white shadow-md rounded-3xl"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <>
                      <button
                        onClick={(e) => handleViewDetails(e, product.category)}
                        aria-label={`Ver detalles del catálogo ${product.title}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-100 text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-100 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <EyeIcon />
                        Ver Detalles
                      </button>
                    </>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="mt-2 font-semibold text-sm sm:text-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag) => {
                        const isMatch = searchResult?.tags.includes(normalizeText(tag.toLowerCase()))

                        return (
                          <span
                            key={tag}
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              isMatch
                                ? searchResultType === "direct"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : searchResultType === "hybrid"
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    : "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {isMatch && <CheckIcon />}
                            {tag}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
          </div>
        )}

        {/* Diseño no encontrado */}
        {!isSearching && filteredProducts.length === 0 && (
          <div 
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center text-center py-12"
          >
            <div className="text-gray-400 mb-2 flex">
              <SearchIcon />
              <h3 className="text-lg font-medium text-gray-900 px-2">No se encontraron diseños</h3>
            </div>
            <p className="text-gray-600 mb-6">Intenta una búsqueda más general</p>
            <div className="flex flex-row items-center justify-center text-center gap-2">
              <button
                onClick={clearFilters}
                aria-label="Limpiar filtros y mostrar todos los diseños"
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Ver todos los diseños
              </button>
              <button 
                aria-label="Contactar por WhatsApp para consultar sobre diseños"
                className="flex flex-row bg-green-200 mt-2 px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <Image
                  aria-hidden="true"
                  src="../svg/whatsapp.svg"
                  alt=""
                  className="mr-2"
                  width={20}
                  height={20}
                />
                Prefiero consultar
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
