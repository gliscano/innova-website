import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import type { CloudinaryFolder } from "../types/catalog"
import { catalogData } from "../data/catalogData"

interface SearchMatch {
  categories: string[]
  type: "exact"
}

export const useProductSearch = (folders: CloudinaryFolder[]) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("name")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchMatch | null>(null)

  const normalizationCache = useRef(new Map<string, string>())

  const categoriesFromData = useMemo(() => {
    return [...folders]
      .map((f) => f.folderName)
      .sort((a, b) => a.localeCompare(b))
  }, [folders])

  const normalizeText = useCallback((text: string): string => {
    const cached = normalizationCache.current.get(text)
    if (cached) return cached
    const normalized = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .trim()
    normalizationCache.current.set(text, normalized)
    return normalized
  }, [])

  const performExactSearch = useCallback(
    (term: string): SearchMatch | null => {
      if (!term || term.length < 2) return null
      const normalizedSearch = normalizeText(term)
      const matchedCategories = new Set<string>()

      folders.forEach((folder) => {
        if (
          normalizeText(folder.title).includes(normalizedSearch) ||
          normalizeText(folder.folderName).includes(normalizedSearch)
        ) {
          matchedCategories.add(folder.folderName)
        }
      })

      if (matchedCategories.size > 0) {
        return { categories: Array.from(matchedCategories), type: "exact" }
      }
      return null
    },
    [folders, normalizeText]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
      setSearchResult(null)
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    try {
      setSearchResult(performExactSearch(debouncedSearchTerm))
    } catch {
      setSearchResult(null)
    } finally {
      setIsSearching(false)
    }
  }, [debouncedSearchTerm, performExactSearch])

  const filteredProducts = useMemo(() => {
    let filtered = folders

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((f) => f.folderName === selectedCategory)
    }

    const normalizedSearch = searchTerm.length >= 2
      ? normalizeText(searchTerm)
      : null

    if (normalizedSearch) {
      filtered = filtered.filter((f) => {
        if (
          normalizeText(f.title).includes(normalizedSearch) ||
          normalizeText(f.folderName).includes(normalizedSearch)
        ) return true
        const item = catalogData.find((c) => c.category === f.folderName)
        if (!item) return false
        if (normalizeText(item.description).includes(normalizedSearch)) return true
        return item.tags.some((tag) => normalizeText(tag).includes(normalizedSearch))
      })
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "name-desc") return b.title.localeCompare(a.title, "es")
      if (sortBy === "count") return b.imageCount - a.imageCount
      if (normalizedSearch) {
        const aExact = normalizeText(a.folderName) === normalizedSearch
        const bExact = normalizeText(b.folderName) === normalizedSearch
        if (aExact !== bExact) return bExact ? 1 : -1
      }
      return a.title.localeCompare(b.title, "es")
    })
  }, [folders, selectedCategory, searchTerm, sortBy, normalizeText])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Todos")
    setSearchResult(null)
  }

  return {
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
    clearFilters,
    normalizeText,
  }
}
