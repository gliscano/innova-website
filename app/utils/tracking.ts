'use client'

/**
 * Centralised tracking utility for GA4 + Meta Pixel.
 * Always guards against SSR with `typeof window !== 'undefined'`.
 * Pattern matches existing usage in GalleryItem.tsx and InspirationCard.tsx.
 */

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
