"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getAllTags } from "../utils/catalogUtils"
import { catalogData, synonymsCatalog } from "../data/catalogData"
import { categories } from "../data/categoriesData"
import Lottie from "lottie-web"

// Extraer todos los tags únicos del catálogo
const allTags = getAllTags()

// Constantes para el sistema de cuotas
const MAX_AI_SEARCHES_PER_SESSION = 5
const AI_QUOTA_KEY = "innova_ai_searches_count"
const AI_QUOTA_DATE_KEY = "innova_ai_searches_date"

interface AISearchResult {
  categories: string[]
  tags: string[]
  explanation: string
}

interface DirectSearchResult {
  categories: string[]
  tags: string[]
  type: "direct"
  confidence: number
}

interface HybridSearchResult {
  categories: string[]
  tags: string[]
  type: "hybrid"
  confidence: number
}

type SearchResult = AISearchResult | DirectSearchResult | HybridSearchResult | null

// Componentes SVG reutilizables
const SearchIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const LightningIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const WarningIcon = () => (
  <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

export default function InnovaCatalog() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("featured")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult>(null)
  const [aiSearchesUsed, setAiSearchesUsed] = useState(0)

  const animationRef = useRef(null)

    useEffect(() => {
      if(animationRef.current) {
        Lottie.loadAnimation({
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          container: document.getElementById('animated-lottie') as unknown as any,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/animations/catalog.json',
        })
      }
    }, [])

  // Cargar contador de búsquedas IA al inicializar
  useEffect(() => {
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem(AI_QUOTA_DATE_KEY)
    const savedCount = localStorage.getItem(AI_QUOTA_KEY)

    if (savedDate === today && savedCount) {
      setAiSearchesUsed(Number.parseInt(savedCount))
    } else {
      // Nuevo día, resetear contador
      localStorage.setItem(AI_QUOTA_DATE_KEY, today)
      localStorage.setItem(AI_QUOTA_KEY, "0")
      setAiSearchesUsed(0)
    }
  }, [])

  // Función para calcular similitud entre strings (algoritmo de Levenshtein simplificado)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const editDistance = levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Función avanzada para encontrar sinónimos y palabras relacionadas
  const findRelatedTerms = (searchTerm: string): string[] => {
    const normalizedSearch = searchTerm.toLowerCase().trim()
    const relatedTerms: string[] = []

    // Buscar sinónimos directos
    Object.entries(synonymsCatalog).forEach(([key, values]) => {
      if (values.includes(normalizedSearch) || key.includes(normalizedSearch)) {
        relatedTerms.push(key, ...values)
      }
    })

    // Buscar términos similares usando fuzzy matching
    allTags.forEach((tag) => {
      const similarity = calculateSimilarity(normalizedSearch, tag)
      if (similarity > 0.7 && similarity < 1.0) {
        // Similitud alta pero no exacta
        relatedTerms.push(tag)
      }
    })

    categories.slice(1).forEach((category) => {
      const similarity = calculateSimilarity(normalizedSearch, category.toLowerCase())
      if (similarity > 0.7 && similarity < 1.0) {
        relatedTerms.push(category.toLowerCase())
      }
    })

    return Array.from(new Set(relatedTerms))
  }

  // Función híbrida avanzada para coincidencias
  const checkAdvancedMatches = (searchTerm: string): DirectSearchResult | HybridSearchResult | null => {
    if (!searchTerm || searchTerm.length < 2) return null

    const normalizedSearch = searchTerm.toLowerCase().trim()
    const matchedCategories: string[] = []
    const matchedTags: string[] = []
    let confidence = 0
    let isDirectMatch = false

    // 1. Coincidencias exactas (máxima confianza)
    categories.slice(1).forEach((category) => {
      if (category.toLowerCase() === normalizedSearch || category.toLowerCase().includes(normalizedSearch)) {
        matchedCategories.push(category)
        confidence = Math.max(confidence, 1.0)
        isDirectMatch = true
      }
    })

    allTags.forEach((tag) => {
      if (tag === normalizedSearch || tag.includes(normalizedSearch)) {
        matchedTags.push(tag)
        confidence = Math.max(confidence, 1.0)
        isDirectMatch = true
      }
    })

    // 2. Coincidencias en títulos y descripciones (alta confianza)
    catalogData.forEach((product) => {
      if (
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)
      ) {
        if (!matchedCategories.includes(product.category)) {
          matchedCategories.push(product.category)
        }
        product.tags.forEach((tag) => {
          if (!matchedTags.includes(tag.toLowerCase())) {
            matchedTags.push(tag.toLowerCase())
          }
        })
        confidence = Math.max(confidence, 0.9)
        isDirectMatch = true
      }
    })

    // 3. Búsqueda con sinónimos (confianza media-alta)
    const relatedTerms = findRelatedTerms(normalizedSearch)
    if (relatedTerms.length > 0) {
      relatedTerms.forEach((term) => {
        // Buscar categorías relacionadas
        categories.slice(1).forEach((category) => {
          if (category.toLowerCase().includes(term) || term.includes(category.toLowerCase())) {
            if (!matchedCategories.includes(category)) {
              matchedCategories.push(category)
              confidence = Math.max(confidence, 0.8)
            }
          }
        })

        // Buscar tags relacionados
        allTags.forEach((tag) => {
          if (tag.includes(term) || term.includes(tag)) {
            if (!matchedTags.includes(tag)) {
              matchedTags.push(tag)
              confidence = Math.max(confidence, 0.8)
            }
          }
        })
      })
    }

    // 4. Fuzzy matching para coincidencias aproximadas (confianza media)
    if (matchedCategories.length === 0 && matchedTags.length === 0) {
      categories.slice(1).forEach((category) => {
        const similarity = calculateSimilarity(normalizedSearch, category.toLowerCase())
        if (similarity > 0.75) {
          matchedCategories.push(category)
          confidence = Math.max(confidence, similarity * 0.7)
        }
      })

      allTags.forEach((tag) => {
        const similarity = calculateSimilarity(normalizedSearch, tag)
        if (similarity > 0.75) {
          matchedTags.push(tag)
          confidence = Math.max(confidence, similarity * 0.7)
        }
      })
    }

    // Retornar resultado si se encontraron coincidencias
    if (matchedCategories.length > 0 || matchedTags.length > 0) {
      return {
        categories: matchedCategories,
        tags: matchedTags,
        type: isDirectMatch && confidence >= 0.9 ? "direct" : "hybrid",
        confidence,
      }
    }

    return null
  }

  // Función para determinar si se debe usar IA (casos extremadamente complejos)
  const shouldUseAI = (searchTerm: string, hybridResult: DirectSearchResult | HybridSearchResult | null): boolean => {
    // No usar IA si se alcanzó la cuota
    if (aiSearchesUsed >= MAX_AI_SEARCHES_PER_SESSION) {
      return false
    }

    // No usar IA si hay coincidencias híbridas con alta confianza
    if (hybridResult && hybridResult.confidence > 0.7) {
      return false
    }

    // Usar IA solo para casos complejos:
    // 1. Búsquedas largas (más de 10 caracteres)
    // 2. Sin coincidencias híbridas o con baja confianza
    // 3. Términos que parecen ser consultas complejas (contienen múltiples palabras)
    const words = searchTerm.trim().split(/\s+/)
    const isComplexQuery = words.length > 1 && searchTerm.length > 10

    return isComplexQuery && (!hybridResult || hybridResult.confidence < 0.5)
  }

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Lógica de búsqueda principal
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setSearchResult(null)
        return
      }

      setIsSearching(true)

      try {
        // Primero, intentar coincidencias híbridas avanzadas
        const hybridMatches = checkAdvancedMatches(debouncedSearchTerm)

        if (hybridMatches) {
          setSearchResult(hybridMatches)
          setIsSearching(false)
          return
        }

        // Solo usar IA para casos extremadamente complejos
        if (shouldUseAI(debouncedSearchTerm, hybridMatches)) {
          const response = await fetch("/api/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ searchTerm: debouncedSearchTerm }),
          })

          if (!response.ok) {
            throw new Error("Error en la búsqueda")
          }

          const data = await response.json()
          setSearchResult(data)

          // Incrementar contador de búsquedas IA
          const newCount = aiSearchesUsed + 1
          setAiSearchesUsed(newCount)
          localStorage.setItem(AI_QUOTA_KEY, newCount.toString())
        } else {
          setSearchResult(null)
        }
      } catch (error) {
        console.error("Error searching:", error)
        setSearchResult(null)
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearchTerm, aiSearchesUsed])

  const filteredProducts = useMemo(() => {
    // Si tenemos resultados de búsqueda, usarlos para filtrar
    if (searchResult && (searchResult.categories.length > 0 || searchResult.tags.length > 0)) {
      const filtered = catalogData.filter((product) => {
        const matchesCategory =
          selectedCategory === "Todos" ||
          selectedCategory === product.category ||
          (searchResult.categories.includes(product.category) && selectedCategory === "Todos")

        const matchesTags =
          searchResult.tags.length === 0 || product.tags.some((tag) => searchResult.tags.includes(tag.toLowerCase()))

        return matchesCategory && matchesTags
      })

      // Ordenar por relevancia
      return filtered.sort((a, b) => {
        if (selectedCategory !== "Todos") {
          if (a.category === selectedCategory && b.category !== selectedCategory) return -1
          if (a.category !== selectedCategory && b.category === selectedCategory) return 1
        }

        const aTagMatches = a.tags.filter((tag) => searchResult.tags.includes(tag.toLowerCase())).length
        const bTagMatches = b.tags.filter((tag) => searchResult.tags.includes(tag.toLowerCase())).length

        if (aTagMatches !== bTagMatches) {
          return bTagMatches - aTagMatches
        }

        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1

        return a.title.localeCompare(b.title)
      })
    } else {
      // Búsqueda tradicional
      const filtered = catalogData.filter((product) => {
        const matchesSearch =
          !debouncedSearchTerm ||
          product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))

        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory

        return matchesSearch && matchesCategory
      })

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
    }
  }, [debouncedSearchTerm, selectedCategory, sortBy, searchResult])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Todos")
    setSearchResult(null)
  }

  // Determinar el tipo de resultado para mostrar
  const getSearchResultType = () => {
    if (!searchResult) return null
    if ("type" in searchResult) {
      return searchResult.type === "direct" ? "direct" : "hybrid"
    }
    return "ai"
  }

  const searchResultType = getSearchResultType()
  const remainingAISearches = MAX_AI_SEARCHES_PER_SESSION - aiSearchesUsed

  const handleViewDetails = (e: React.MouseEvent, productId: string | number) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/design-catalog/${String(productId)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
            aria-hidden="true"
          />
            {/* Filtros y búsqueda */}
            <div className="mb-8 space-y-4">
              {/* Barra de búsqueda principal */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isSearching ? <LoadingSpinner /> : <SearchIcon />}
                </div>
                <input
                  type="text"
                  placeholder="Buscar diseños (máx. 25 caracteres)..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 25) {
                      setSearchTerm(value)
                    }
                  }}
                  maxLength={25}
                  className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className={`text-xs pr-3 ${searchTerm.length >= 20 ? "text-red-500" : "text-gray-400"}`}>
                    {searchTerm.length}/25
                  </span>
                  <LightningIcon />
                  <span className={`text-xs ${remainingAISearches <= 1 ? "text-red-600" : "text-blue-600"}`}>
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

              {/* Filtros rápidos */}
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 1).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
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

              {/* Controles */}
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
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const matchingTags =
              searchResult?.tags.filter((tag) =>
                product.tags.some((productTag) => productTag.toLowerCase() === tag.toLowerCase()),
              ) || []

            return (
              <Link
                key={product.id}  
                href={`/design-catalog/${product.id}`}
                className="bg-white rounded-lg content-between shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 block focus:outline-none"
                tabIndex={0}
              >
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="w-full h-24 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <Image
                      src="/icons/star_featured_icon.png"
                      alt="Producto destacado"
                      width={40}
                      height={40}
                      className="absolute bottom-2 right-2 inline-flex items-center px-2.5"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <>
                      <button
                        onClick={(e) => handleViewDetails(e, product.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-100 text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-100 flex items-center gap-2"
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
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag) => {
                        const isMatch = searchResult?.tags.includes(tag.toLowerCase())

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

        {/* Estado vacío */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <SearchIcon />
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
    </div>
  )
}
