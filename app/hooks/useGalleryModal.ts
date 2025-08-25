'use client'

import { useState, useCallback, useEffect } from 'react'
import { GalleryImage } from '../types/gallery'

interface UseGalleryModalReturn {
  isOpen: boolean
  currentIndex: number
  currentImage: GalleryImage | null
  openModal: (index: number) => void
  closeModal: () => void
  goToNext: () => void
  goToPrevious: () => void
  goToImage: (index: number) => void
}

export function useGalleryModal(images: GalleryImage[]): UseGalleryModalReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentImage = images[currentIndex] || null

  const openModal = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
    
    // Trackear apertura del modal en Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gallery_modal_open', {
        event_category: 'gallery',
        event_label: `image_${index}`,
        value: index,
      })
    }
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    
    // Trackear cierre del modal en Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gallery_modal_close', {
        event_category: 'gallery',
        event_label: `image_${currentIndex}`,
        value: currentIndex,
      })
    }
  }, [currentIndex])

  const goToNext = useCallback(() => {
    if (images.length === 0) return
    
    const nextIndex = (currentIndex + 1) % images.length
    setCurrentIndex(nextIndex)
    
    // Trackear navegación en Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gallery_navigation', {
        event_category: 'gallery',
        event_label: 'next',
        value: nextIndex,
      })
    }
  }, [currentIndex, images.length])

  const goToPrevious = useCallback(() => {
    if (images.length === 0) return
    
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    
    // Trackear navegación en Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gallery_navigation', {
        event_category: 'gallery',
        event_label: 'previous',
        value: prevIndex,
      })
    }
  }, [currentIndex, images.length])

  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index)
      
      // Trackear navegación directa en Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'gallery_navigation', {
          event_category: 'gallery',
          event_label: 'direct',
          value: index,
        })
      }
    }
  }, [images.length])

  // Navegación con teclado
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          closeModal()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNext()
          break
        case 'ArrowLeft':
          event.preventDefault()
          goToPrevious()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToNext, goToPrevious, closeModal])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return {
    isOpen,
    currentIndex,
    currentImage,
    openModal,
    closeModal,
    goToNext,
    goToPrevious,
    goToImage,
  }
}
