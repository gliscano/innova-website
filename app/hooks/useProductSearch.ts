import { useState, useEffect, useMemo, useRef } from "react"
import { catalogData } from "../data/catalogData"

interface SearchMatch {
  categories: string[]
  tags: string[]
  type: "exact"
}

export const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("featured")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchMatch | null>(null)
  
  // Cache para normalización de texto
  const normalizationCache = useRef(new Map<string, string>())
  
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

    return [...sorted]
  }, [])

  // Función optimizada para normalizar texto (solo acentos)
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

  // Función simplificada para búsquedas exactas
  const performExactSearch = (searchTerm: string): SearchMatch | null => {
    if (!searchTerm || searchTerm.length < 2) return null

    const normalizedSearch = normalizeText(searchTerm)
    const matchedCategories = new Set<string>()
    const matchedTags = new Set<string>()

    // Búsqueda exacta en todas las propiedades
    catalogData.forEach((product) => {
      // Buscar en título
      if (normalizeText(product.title).includes(normalizedSearch)) {
        matchedCategories.add(product.category)
        product.tags.forEach(tag => matchedTags.add(tag))
      }

      // Buscar en categoría
      if (normalizeText(product.category).includes(normalizedSearch)) {
        matchedCategories.add(product.category)
        product.tags.forEach(tag => matchedTags.add(tag))
      }

      // Buscar en descripción
      if (normalizeText(product.description).includes(normalizedSearch)) {
        matchedCategories.add(product.category)
        product.tags.forEach(tag => matchedTags.add(tag))
      }

      // Buscar en tags
      product.tags.forEach((tag) => {
        if (normalizeText(tag).includes(normalizedSearch)) {
          matchedCategories.add(product.category)
          matchedTags.add(tag)
        }
      })

      // Buscar en recommendedUse
      product.recommendedUse?.forEach((use) => {
        if (normalizeText(use).includes(normalizedSearch)) {
          matchedCategories.add(product.category)
          product.tags.forEach(tag => matchedTags.add(tag))
        }
      })
    })

    // Retornar resultado si se encontraron coincidencias
    if (matchedCategories.size > 0 || matchedTags.size > 0) {
      return {
        categories: Array.from(matchedCategories),
        tags: Array.from(matchedTags),
        type: "exact" as const,
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

  // Lógica de búsqueda principal simplificada
  useEffect(() => {
    const performSearch = () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setSearchResult(null)
        setIsSearching(false)
        return
      }

      setIsSearching(true)

      try {
        const searchMatches = performExactSearch(debouncedSearchTerm)
        setSearchResult(searchMatches)
      } catch (error) {
        console.error("Error searching:", error)
        setSearchResult(null)
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearchTerm])

  const filteredProducts = useMemo(() => {
    let filtered = catalogData

    // Aplicar filtro de categoría
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Aplicar búsqueda si hay término de búsqueda
    if (searchResult && (searchResult.categories.length > 0 || searchResult.tags.length > 0)) {
      filtered = filtered.filter((product) => {
        // Si el producto está en las categorías encontradas
        if (searchResult.categories.includes(product.category)) {
          return true
        }
        
        // Si el producto tiene tags que coinciden
        if (product.tags.some(tag => searchResult.tags.includes(normalizeText(tag)))) {
          return true
        }

        return false
      })
    }

    // Aplicar ordenamiento
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      const normalizedSearch = normalizeText(debouncedSearchTerm)
      filtered.sort((a, b) => {
        const aExactCategory = normalizeText(a.category) === normalizedSearch
        const bExactCategory = normalizeText(b.category) === normalizedSearch

        // Priorizar coincidencia exacta en category
        if (aExactCategory !== bExactCategory) {
          return bExactCategory ? 1 : -1
        }

        // Secundario: criterio seleccionado
        switch (sortBy) {
          case "name":
            return a.title.localeCompare(b.title)
          case "featured":
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        }
      })
    } else {
      switch (sortBy) {
        case "name":
          filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "featured":
        default:
          filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          break
      }
    }

      return filtered
  }, [selectedCategory, sortBy, searchResult, debouncedSearchTerm])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Todos")
    setSearchResult(null)
  }

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
    searchResultType: searchResult?.type || null,
    categoriesFromData,
    filteredProducts,
    
    // Funciones
    clearFilters,
    normalizeText
  }
}

