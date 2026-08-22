'use client'

/**
 * Centralised tracking utility for GA4 + Meta Pixel.
 * Always guards against SSR with `typeof window !== 'undefined'`.
 * Pattern matches existing usage in GalleryItem.tsx and InspirationCard.tsx.
 */

/** Wrapper único sobre gtag para no repetir el guard de SSR en cada evento. */
function gaEvent(name: string, params: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', name, params)
}

export function trackWhatsAppClick(label?: string): void {
  if (typeof window === 'undefined') return
  if (window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'contact',
      event_label: label ?? 'unknown',
    })
  }
  if (window.fbq) {
    window.fbq('track', 'Contact')
  }
}

export function trackViewContent(contentName: string, contentCategory?: string): void {
  if (typeof window === 'undefined') return
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_category: contentCategory ?? '',
    })
  }
}

export function trackSearch(searchString: string): void {
  if (typeof window === 'undefined') return
  if (window.gtag) {
    window.gtag('event', 'search', {
      event_category: 'catalog',
      event_label: searchString,
    })
  }
  if (window.fbq) {
    window.fbq('track', 'Search', { search_string: searchString })
  }
}

/** CTA principal/secundario del hero de la home. */
export function trackHeroCta(target: 'catalog' | 'stock'): void {
  gaEvent(target === 'catalog' ? 'hero_catalog_click' : 'hero_stock_click', {
    event_category: 'hero',
    event_label: target,
  })
}

/**
 * Salida hacia la tienda externa. Hasta ahora los seis links de salida a
 * store.innova54.com / empretienda no emitían ningún evento, así que el corte del funnel entre
 * dominios era invisible en Analytics.
 */
export function trackStoreExit(destination: string, ctaLocation: string): void {
  gaEvent('store_exit', {
    event_category: 'outbound',
    event_label: ctaLocation,
    destination,
  })
}

export function trackGalleryImageClick(folder: string, index: number): void {
  gaEvent('gallery_image_click', {
    event_category: 'gallery',
    event_label: folder,
    image_index: index,
  })
}

export function trackGalleryModalOpen(folder: string): void {
  gaEvent('gallery_modal_open', {
    event_category: 'gallery',
    event_label: folder,
  })
}

export function trackGallerySearch(searchTerm: string, folder?: string): void {
  gaEvent('gallery_search', {
    event_category: 'gallery',
    event_label: searchTerm,
    folder: folder ?? '',
  })
}
