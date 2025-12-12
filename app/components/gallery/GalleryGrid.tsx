'use client'

import { useEffect, useRef, useCallback } from 'react'
import { GalleryGridProps } from '../../types/gallery'
import GalleryItem from './GalleryItem'

export default function GalleryGrid({ 
  images, 
  onImageClick, 
  isLoading, 
  hasMore, 
  onLoadMore 
}: GalleryGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastImageRef = useRef<HTMLDivElement | null>(null)

  // Callback para el último elemento (trigger de carga infinita)
  const lastImageElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return
    
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore()
      }
    }, {
      rootMargin: '100px', // Trigger 100px antes de que llegue al final
      threshold: 0.1,
    })
    
    if (node) {
      observerRef.current.observe(node)
      lastImageRef.current = node
    }
  }, [isLoading, hasMore, onLoadMore])

  // Cleanup del observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  if (images.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron imágenes
        </h3>
        <p className="text-gray-600">
          Intenta ajustar los parámetros de búsqueda
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Grid de imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((image, index) => {
          const isLast = index === images.length - 1
          
          return (
            <div
              key={image.id}
              ref={isLast ? lastImageElementRef : null}
            >
              <GalleryItem
                image={image}
                onClick={() => onImageClick(index)}
                index={index}
              />
            </div>
          )
        })}
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Indicador de fin de lista */}
      {!hasMore && images.length > 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600">
            Has visto todas las imágenes disponibles
          </p>
        </div>
      )}
    </div>
  )
}
