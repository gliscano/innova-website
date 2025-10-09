import { useState, useEffect, useMemo, useRef } from "react"
import { getAllTags } from "../utils/catalogUtils"
import { catalogData, synonymsCatalog } from "../data/catalogData"

// Constantes para el sistema de cuotas
const MAX_AI_SEARCHES_PER_SESSION = 5

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

export const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("featured")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult>(null)
  const [aiSearchesUsed, setAiSearchesUsed] = useState(0)
  
  // Cache para normalización de texto
  const normalizationCache = useRef(new Map<string, string>())
  
  // Extraer todos los tags únicos del catálogo
  const allTags = getAllTags()
  
  // Construir categorías a partir de catalogData y ordenar por featured (true primero)
  const categoriesFromData = useMemo(() => {
    const categoryToHasFeatured = new Map<string, boolean>()
    catalogData.forEach((product) => {
      const previous = categoryToHasFeatured.get(product.category) || false
      categoryToHasFeatured.set(product.category, previous || !!product.featured)
    })

    const sorted = Array.from(categoryToHasFeatured.entries())
      .sort((a, b) => {
        // featured true primero
        const byFeatured = Number(b[1]) - Number(a[1])
        if (byFeatured !== 0) return byFeatured
        // secundario: orden alfabético
        return a[0].localeCompare(b[0])
      })
      .map(([name]) => name)

    return ["Todos", ...sorted]
  }, [])

  // Función para normalizar acentos y caracteres especiales con cache
  const normalizeText = (text: string): string => {
    const cacheKey = text
    if (normalizationCache.current.has(cacheKey)) {
      return normalizationCache.current.get(cacheKey)!
    }
    
    const normalized = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos (acentos)
      .trim()
    
    normalizationCache.current.set(cacheKey, normalized)
    return normalized
  }

  // Función para calcular similitud entre strings
  const calculateSimilarity = (str1: string, str2: string): number => {
    const normalizedStr1 = normalizeText(str1)
    const normalizedStr2 = normalizeText(str2)
    
    if (normalizedStr1 === normalizedStr2) return 1.0
    
    const distance = levenshteinDistance(normalizedStr1, normalizedStr2)
    const maxLength = Math.max(normalizedStr1.length, normalizedStr2.length)
    
    return maxLength === 0 ? 1.0 : (maxLength - distance) / maxLength
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
    const normalizedSearch = normalizeText(searchTerm)
    const relatedTerms: string[] = []

    // Buscar sinónimos directos
    Object.entries(synonymsCatalog).forEach(([key, values]) => {
      const normalizedKey = normalizeText(key)
      const normalizedValues = values.map(value => normalizeText(value))
      
      if (normalizedValues.includes(normalizedSearch) || normalizedKey.includes(normalizedSearch)) {
        relatedTerms.push(key, ...values)
      }
    })

    // Buscar términos similares usando fuzzy matching en tags
    allTags.forEach((tag) => {
      const similarity = calculateSimilarity(normalizedSearch, normalizeText(tag))
      if (similarity > 0.7 && similarity < 1.0) {
        // Similitud alta pero no exacta
        relatedTerms.push(tag)
      }
    })

    // Buscar términos similares en categorías
    categoriesFromData.slice(1).forEach((category) => {
      const similarity = calculateSimilarity(normalizedSearch, normalizeText(category.toLowerCase()))
      if (similarity > 0.7 && similarity < 1.0) {
        relatedTerms.push(category.toLowerCase())
      }
    })

    // Buscar términos similares en recommendedUse de todos los productos
    catalogData.forEach((product) => {
      product.recommendedUse?.forEach((use) => {
        const similarity = calculateSimilarity(normalizedSearch, normalizeText(use.toLowerCase()))
        if (similarity > 0.7 && similarity < 1.0) {
          relatedTerms.push(use.toLowerCase())
        }
      })
    })

    return Array.from(new Set(relatedTerms))
  }

  // Función híbrida avanzada para coincidencias
  const checkAdvancedMatches = (searchTerm: string): DirectSearchResult | HybridSearchResult | null => {
    if (!searchTerm || searchTerm.length < 2) return null

    const normalizedSearch = normalizeText(searchTerm)
    const matchedCategories: string[] = []
    const matchedTags: string[] = []
    let confidence = 0
    let isDirectMatch = false

    // 1. Coincidencias exactas (máxima confianza)
    categoriesFromData.slice(1).forEach((category) => {
      if (normalizeText(category.toLowerCase()) === normalizedSearch || normalizeText(category.toLowerCase()).includes(normalizedSearch)) {
        matchedCategories.push(category)
        confidence = Math.max(confidence, 1.0)
        isDirectMatch = true
      }
    })

    allTags.forEach((tag) => {
      if (normalizeText(tag) === normalizedSearch || normalizeText(tag).includes(normalizedSearch)) {
        matchedTags.push(tag)
        confidence = Math.max(confidence, 1.0)
        isDirectMatch = true
      }
    })

    // 2. Coincidencias en títulos, descripciones y recommendedUse (alta confianza)
    catalogData.forEach((product) => {
      const titleMatch = normalizeText(product.title.toLowerCase()).includes(normalizedSearch)
      const descriptionMatch = normalizeText(product.description.toLowerCase()).includes(normalizedSearch)
      const recommendedUseMatch = product.recommendedUse?.some(use => 
        normalizeText(use.toLowerCase()).includes(normalizedSearch)
      ) || false

      if (titleMatch || descriptionMatch || recommendedUseMatch) {
        if (!matchedCategories.includes(product.category)) {
          matchedCategories.push(product.category)
        }
        product.tags.forEach((tag) => {
          if (!matchedTags.includes(normalizeText(tag.toLowerCase()))) {
            matchedTags.push(normalizeText(tag.toLowerCase()))
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
        categoriesFromData.slice(1).forEach((category) => {
          if (normalizeText(category.toLowerCase()).includes(normalizeText(term)) || normalizeText(term).includes(normalizeText(category.toLowerCase()))) {
            if (!matchedCategories.includes(category)) {
              matchedCategories.push(category)
              confidence = Math.max(confidence, 0.8)
            }
          }
        })

        // Buscar tags relacionados
        allTags.forEach((tag) => {
          if (normalizeText(tag).includes(normalizeText(term)) || normalizeText(term).includes(normalizeText(tag))) {
            if (!matchedTags.includes(tag)) {
              matchedTags.push(tag)
              confidence = Math.max(confidence, 0.8)
            }
          }
        })

        // Buscar productos con recommendedUse relacionado
        catalogData.forEach((product) => {
          const hasMatchingRecommendedUse = product.recommendedUse?.some(use => 
            normalizeText(use.toLowerCase()).includes(normalizeText(term)) || 
            normalizeText(term).includes(normalizeText(use.toLowerCase()))
          )
          
          if (hasMatchingRecommendedUse && !matchedCategories.includes(product.category)) {
            matchedCategories.push(product.category)
            confidence = Math.max(confidence, 0.8)
          }
        })
      })
    }

    // 4. Fuzzy matching para coincidencias aproximadas (confianza media)
    if (matchedCategories.length === 0 && matchedTags.length === 0) {
      categoriesFromData.slice(1).forEach((category) => {
        const similarity = calculateSimilarity(normalizedSearch, normalizeText(category.toLowerCase()))
        if (similarity > 0.75) {
          matchedCategories.push(category)
          confidence = Math.max(confidence, similarity * 0.7)
        }
      })

      allTags.forEach((tag) => {
        const similarity = calculateSimilarity(normalizedSearch, normalizeText(tag))
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

        setSearchResult(null)

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
          searchResult.tags.length === 0 || product.tags.some((tag) => searchResult.tags.includes(normalizeText(tag.toLowerCase())))

        return matchesCategory && matchesTags
      })

      // Ordenar por relevancia
      return filtered.sort((a, b) => {
        if (selectedCategory !== "Todos") {
          if (a.category === selectedCategory && b.category !== selectedCategory) return -1
          if (a.category !== selectedCategory && b.category === selectedCategory) return 1
        }

        const aTagMatches = a.tags.filter((tag) => searchResult.tags.includes(normalizeText(tag.toLowerCase()))).length
        const bTagMatches = b.tags.filter((tag) => searchResult.tags.includes(normalizeText(tag.toLowerCase()))).length

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
        const normalizedSearchTerm = normalizeText(debouncedSearchTerm.toLowerCase())
        
        const matchesSearch =
          !debouncedSearchTerm ||
          normalizeText(product.title.toLowerCase()).includes(normalizedSearchTerm) ||
          normalizeText(product.description.toLowerCase()).includes(normalizedSearchTerm) ||
          product.tags.some((tag) => normalizeText(tag.toLowerCase()).includes(normalizedSearchTerm)) ||
          product.recommendedUse?.some((use) => normalizeText(use.toLowerCase()).includes(normalizedSearchTerm))

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

  return {
    // Estados
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
    
    // Funciones
    clearFilters,
    normalizeText
  }
}

