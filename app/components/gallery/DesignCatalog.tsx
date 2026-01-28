"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProductSearch } from "../../hooks/useProductSearch"
import { ProductGridSkeleton } from "./ProductSkeleton"
import { SearchIcon } from "../icons"


export default function InnovaCatalog() {
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  
  const {
    searchTerm,
    selectedCategory,
    sortBy,
    isSearching,
    searchResultType,
    categoriesFromData,
    filteredProducts,
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    clearFilters,
    normalizeText
  } = useProductSearch()

  const handleViewDetails = (e: React.MouseEvent, category: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/design-catalog/${encodeURIComponent(category)}`)
  }

  // Filtrar categorías basado en el término de búsqueda
  const filteredCategories = categoriesFromData.filter((category) =>
    normalizeText(category.toLowerCase()).includes(normalizeText(categorySearchTerm.toLowerCase()))
  )
  
  // Agregar "Todos" al inicio si coincide con la búsqueda o si no hay término de búsqueda
  const allCategoriesList = categorySearchTerm === "" || normalizeText("todos").includes(normalizeText(categorySearchTerm.toLowerCase()))
    ? ["Todos", ...filteredCategories]
    : filteredCategories

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setCategorySearchTerm("")
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    if (category === "Todos") {
      setSearchTerm("")
    } else {
      setSearchTerm(category)
    }
    setIsDropdownOpen(false)
    setCategorySearchTerm("")
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 25) {
      setSearchTerm(value)
      setCategorySearchTerm(value)
    }
  }

  return (
    <div className="min-h-screen bg-opacity-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="mt-6 catalog-eyebrow">
          Diseños pensados para transformar cualquier espacio.
        </div>
        <h2 className="py-2 text-xl copperplate-bold-font catalog-title sm:text-4xl lg:col-span-2">
          Catálogo de Diseños
        </h2>
        <div className="mb-24 catalog-eyebrow">
          Elegí un diseño y hacelo parte de tu próxima historia.
        </div>
        <div className="catalog-divider" />
        <div className="max-h-72 relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
          {/* Filtros y búsqueda */}
          <div className={`mb-4 space-y-4 ${isDropdownOpen ? 'h-72' : ''}`}>
            {/* Dropdown de búsqueda combinado */}
            <div className="relative" ref={dropdownRef}>
              <label htmlFor="catalog-search" className="sr-only">
                Buscar en el catálogo de diseños fotográficos
              </label>
              
              {/* Barra de búsqueda con botón */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="catalog-search"
                    type="text"
                    placeholder="Buscar Catálogo..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    maxLength={25}
                    aria-describedby="search-category-designs"
                    aria-label="Buscar en el catálogo de diseños fotográficos"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-4 py-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                  aria-label="Mostrar categorías"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Dropdown de categorías */}
              {isDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-64 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
                  {/* Lista de categorías scrollable */}
                  <div className="overflow-y-auto max-h-56" role="listbox" aria-label="Categorías disponibles">
                    {allCategoriesList.length > 0 ? (
                      allCategoriesList.map((category) => (
                        <button
                          key={category}
                          role="option"
                          aria-selected={selectedCategory === category}
                          onClick={() => handleCategorySelect(category)}
                          className={`w-full text-left px-4 py-3 flex items-center hover:bg-purple-50 focus:outline-none focus:bg-purple-50 transition-colors ${
                            selectedCategory === category ? "bg-purple-100" : ""
                          }`}
                        >
                          <span className="text-sm text-gray-900">{category}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No se encontraron categorías
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap flex-row gap-4 items-center">
                <span className="text-sm text-black">
                  {`🔍 Descubrí ${filteredProducts.length} Catálogo${filteredProducts.length > 1 ? "s" : ""} listos para usar | Ordenar por:`}
                </span>
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
                {searchResultType && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      searchResultType === "exact"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {searchResultType === "exact" ? "Exacto" : "Sinónimo"}
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
            className="mt-8 px-2 grid gap-3 grid-cols-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map((product, index) => (
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
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <Image
                      src="/icons/star_featured_icon.png"
                      alt="Producto destacado"
                      width={24}
                      height={24}
                      className="absolute top-2 right-2 p-0.5 inline-flex items-center bg-white shadow-md rounded-3xl"
                    />
                  )}
                </div>

                <div className="h-36 flex flex-col items-stretch justify-between px-4 pb-4">
                  <div className="items-start justify-between">
                    <h3 className="mt-2 font-semibold text-sm sm:text-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleViewDetails(e, product.category)
                    }}
                    aria-label={`Abrir catálogo ${product.title}`}
                    className="w-full mt-3 gradient-orange-colors text-black px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Ver diseños
                  </button>
                </div>
              </Link>
            )
          )}
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
