'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { GalleryImage, GallerySearchResponse, GalleryProps } from '../types/gallery'
import { trackGallerySearch } from '../utils/tracking'

interface UseGalleryImagesReturn {
  images: GalleryImage[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  totalCount: number
  loadMore: () => void
  refresh: () => void
}

/** Identifica el conjunto de parámetros con el que se pidió una tanda de imágenes. */
function paramsKey(props: Pick<GalleryProps, 'searchTerm' | 'folder' | 'itemsPerPage'>): string {
  return `${props.searchTerm ?? ''}|${props.folder ?? ''}|${props.itemsPerPage ?? ''}`
}

export function useGalleryImages(props: GalleryProps): UseGalleryImagesReturn {
  const seeded = Boolean(props.initialImages?.length)

  const [images, setImages] = useState<GalleryImage[]>(props.initialImages ?? [])
  const [isLoading, setIsLoading] = useState(!seeded)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(props.initialHasMore ?? true)
  const [totalCount, setTotalCount] = useState(props.initialTotalCount ?? 0)
  const [nextCursor, setNextCursor] = useState<string | null>(props.initialCursor ?? null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const isLoadingMoreRef = useRef(false)
  const propsRef = useRef(props)

  // Clave con la que el servidor sembró el estado inicial, y marca de si ya se consumió.
  const seedKeyRef = useRef(seeded ? paramsKey(props) : null)
  const seedConsumedRef = useRef(false)

  // Mantener props actualizados en ref para evitar dependencias circulares
  useEffect(() => {
    propsRef.current = props
  }, [props])

  const searchImages = useCallback(async (isLoadMore = false) => {
    // Guard: evitar llamadas concurrentes de "cargar más"
    if (isLoadMore && isLoadingMoreRef.current) return
    if (isLoadMore) isLoadingMoreRef.current = true

    try {
      if (!isLoadMore) setIsLoading(true)
      else setIsLoadingMore(true)
      setError(null)

      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const currentProps = propsRef.current
      const params = new URLSearchParams()
      if (currentProps.searchTerm) params.set('searchTerm', currentProps.searchTerm)
      if (currentProps.folder) params.set('folder', currentProps.folder)
      if (currentProps.itemsPerPage) params.set('maxResults', String(currentProps.itemsPerPage))
      if (isLoadMore && nextCursor) params.set('nextCursor', nextCursor)

      const url = `/api/cloudinary/search?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        signal: abortControllerRef.current.signal,
        cache: 'default',
      })

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

      // Sólo la búsqueda inicial cuenta como búsqueda: antes esto vivía fuera del guard y se
      // disparaba también en cada "cargar más", inflando el conteo de búsquedas en GA4.
      if (!isLoadMore && currentProps.searchTerm) {
        trackGallerySearch(currentProps.searchTerm, currentProps.folder)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return // Petición cancelada
      }
      setError('Error al cargar las imágenes. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
      isLoadingMoreRef.current = false
    }
  }, [nextCursor])

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore || isLoadingMoreRef.current) return
    searchImages(true)
  }, [isLoading, isLoadingMore, hasMore, searchImages])

  const refresh = useCallback(() => {
    setImages([])
    setNextCursor(null)
    setHasMore(true)
    setError(null)
    searchImages(false)
  }, [searchImages])

  // Búsqueda inicial y cuando cambien los parámetros.
  //
  // Cuando la página ya sembró las imágenes desde el servidor, la primera corrida no debe
  // resetear ni volver a pedir lo mismo. El guard compara claves en vez de limitarse a "es el
  // primer render" para no romper el reset ante cambio de props del que depende CollectionGallery
  // al cambiar de subcarpeta.
  useEffect(() => {
    const key = paramsKey({
      searchTerm: props.searchTerm,
      folder: props.folder,
      itemsPerPage: props.itemsPerPage,
    })

    if (!seedConsumedRef.current && seedKeyRef.current === key) {
      seedConsumedRef.current = true
      return
    }

    setImages([])
    setNextCursor(null)
    setHasMore(true)
    setError(null)
    searchImages(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.searchTerm, props.folder, props.itemsPerPage])

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
    isLoadingMore,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
  }
}
