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
        event_category: 'gallery_modal_open',
        event_label: 'openImageModal',
        value: currentImage.display_name || 'unknown',
      })
    }
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [currentIndex])

  const goToNext = useCallback(() => {
    if (images.length === 0) return
    
    const nextIndex = (currentIndex + 1) % images.length
    setCurrentIndex(nextIndex)
  }, [currentIndex, images.length])

  const goToPrevious = useCallback(() => {
    if (images.length === 0) return
    
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
  }, [currentIndex, images.length])

  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index)
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
