'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { GalleryImage, GallerySearchResponse, GalleryProps } from '../types/gallery'

interface UseGalleryImagesReturn {
  images: GalleryImage[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  totalCount: number
  loadMore: () => void
  refresh: () => void
}

export function useGalleryImages(props: GalleryProps): UseGalleryImagesReturn {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const isLoadingMoreRef = useRef(false)

  const searchImages = useCallback(async (isLoadMore = false) => {
    if (isLoadingMoreRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      const params = new URLSearchParams()
      if (props.searchTerm) params.set('searchTerm', props.searchTerm)
      if (props.folder) params.set('folder', props.folder)
      if (props.collection) params.set('collection', props.collection)
      if (props.itemsPerPage) params.set('maxResults', String(props.itemsPerPage))
      if (props.tags && props.tags.length > 0) {
        // múltiple: repetir param o usar coma. Usamos repetido para mejor cacheabilidad
        props.tags.forEach(tag => params.append('tags', tag))
      }
      if (isLoadMore && nextCursor) params.set('nextCursor', nextCursor)

      const url = `/api/cloudinary/search?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        signal: abortControllerRef.current.signal,
        // Dejar que el runtime maneje el cache del GET; SWR puede usarse aparte si se desea
      })

      if (process.env.NODE_ENV !== 'production') {
        console.log('gallery search response status', response.status)
      }

      if (!response.ok) {
        throw new Error('Error en la búsqueda')
      }

      const data: GallerySearchResponse = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (isLoadMore) {
        setImages(prev => [...prev, ...data.images])
      } else {
        setImages(data.images)
      }

      setNextCursor(data.nextCursor || null)
      setHasMore(data.hasMore)
      setTotalCount(data.totalCount)

      // Trackear en Google Analytics
      /* if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'gallery_search', {
          event_category: 'gallery',
          event_label: props.searchTerm || 'general',
          value: data.images.length,
        })
      } */

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return // Petición cancelada
      }
      
      console.error('Error buscando imágenes:', err)
      setError('Error al cargar las imágenes. Intenta de nuevo.')
      
    } finally {
      setIsLoading(false)
      isLoadingMoreRef.current = false
    }
  }, [props, nextCursor])

  const loadMore = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('gallery loadMore')
    }
    if (isLoading || !hasMore || isLoadingMoreRef.current)
    {
      if (process.env.NODE_ENV !== 'production') {
        console.log('gallery loadMore skipped')
      }
      return
    }
      
    
    isLoadingMoreRef.current = true
    searchImages(true)
  }, [isLoading, hasMore, searchImages])

  const refresh = useCallback(() => {
    setImages([])
    setNextCursor(null)
    setHasMore(true)
    setError(null)
    searchImages(false)
  }, [searchImages])

  // Búsqueda inicial y cuando cambien los parámetros
  useEffect(() => {
    refresh()
  }, [props.searchTerm, props.tags?.join(','), props.folder, props.collection])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    images,
    isLoading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
  }
}
