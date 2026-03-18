'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { GalleryImage, GallerySearchResponse } from '../types/gallery'

const ITEMS_PER_PAGE = 12
const DEFAULT_FOLDER = 'latest-creations'

function shuffleImages(images: GalleryImage[]): GalleryImage[] {
  const shuffled = [...images]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface UseInspirationFeedProps {
  folder?: string
  initialImages?: GalleryImage[]
  initialCursor?: string | null
  initialHasMore?: boolean
}

export interface UseInspirationFeedReturn {
  allImages: GalleryImage[]
  filteredImages: GalleryImage[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  totalCount: number
  searchTerm: string
  activeCategory: string | null
  categories: string[]
  setSearchTerm: (term: string) => void
  setActiveCategory: (cat: string | null) => void
  loadMore: () => void
  retry: () => void
}

export function useInspirationFeed({
  folder = DEFAULT_FOLDER,
  initialImages = [],
  initialCursor = null,
  initialHasMore = true,
}: UseInspirationFeedProps = {}): UseInspirationFeedReturn {
  const [allImages, setAllImages] = useState<GalleryImage[]>(() => shuffleImages(initialImages))
  const [isLoading, setIsLoading] = useState(initialImages.length === 0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [totalCount, setTotalCount] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor)
  const [searchTerm, setSearchTermState] = useState('')
  const [activeCategory, setActiveCategoryState] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const isLoadingMoreRef = useRef(false)

  const fetchImages = useCallback(
    async (cursor?: string | null) => {
      const isLoadMore = !!cursor

      if (isLoadMore && isLoadingMoreRef.current) return
      if (isLoadMore) isLoadingMoreRef.current = true

      try {
        if (!isLoadMore) setIsLoading(true)
        else setIsLoadingMore(true)

        setError(null)

        if (abortRef.current) abortRef.current.abort()
        abortRef.current = new AbortController()

        const params = new URLSearchParams()
        params.set('maxResults', String(ITEMS_PER_PAGE))
        if (folder) params.set('folder', folder)
        if (cursor) params.set('nextCursor', cursor)

        const res = await fetch(`/api/cloudinary/search?${params.toString()}`, {
          signal: abortRef.current.signal,
          cache: 'default',
        })

        if (!res.ok) throw new Error('Error al cargar imágenes')

        const data: GallerySearchResponse = await res.json()
        if (data.error) throw new Error(data.error)
        const randomImages = shuffleImages(data.images || [])

        if (isLoadMore) {
          setAllImages(prev => [...prev, ...randomImages])
        } else {
          setAllImages(randomImages)
        }

        setNextCursor(data.nextCursor || null)
        setHasMore(data.hasMore)
        setTotalCount(data.totalCount)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError('No pudimos cargar las creaciones. Intenta de nuevo.')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
        isLoadingMoreRef.current = false
      }
    },
    [folder],
  )

  // Carga inicial
  useEffect(() => {
    if (initialImages.length === 0) {
      fetchImages()
    }
    return () => {
      abortRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder])

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore || isLoadingMoreRef.current) return
    fetchImages(nextCursor)
  }, [hasMore, isLoading, isLoadingMore, nextCursor, fetchImages])

  const retry = useCallback(() => {
    setAllImages([])
    setNextCursor(null)
    setHasMore(true)
    setError(null)
    fetchImages()
  }, [fetchImages])

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term)
  }, [])

  const setActiveCategory = useCallback((cat: string | null) => {
    setActiveCategoryState(cat)
  }, [])

  // Deriva categorías de los tags de las imágenes cargadas, ordenadas por frecuencia
  const categories = useMemo(() => {
    const tagCount: Record<string, number> = {}
    allImages.forEach(img => {
      img.tags?.forEach(tag => {
        if (tag.trim()) tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([tag]) => tag)
  }, [allImages])

  // Filtro local: combina búsqueda por texto + filtro por categoría
  const filteredImages = useMemo(() => {
    let imgs = allImages
    const query = searchTerm.toLowerCase().trim()

    if (query) {
      imgs = imgs.filter(img => {
        const name = (img.display_name || img.id || '').toLowerCase()
        const tags = (img.tags || []).join(' ').toLowerCase()
        return name.includes(query) || tags.includes(query)
      })
    }

    if (activeCategory) {
      imgs = imgs.filter(img =>
        img.tags?.some(tag => tag.toLowerCase() === activeCategory.toLowerCase()),
      )
    }

    return imgs
  }, [allImages, searchTerm, activeCategory])

  return {
    allImages,
    filteredImages,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalCount,
    searchTerm,
    activeCategory,
    categories,
    setSearchTerm,
    setActiveCategory,
    loadMore,
    retry,
  }
}
