'use client'

/**
 * Centralised tracking utility for GA4 + Meta Pixel.
 * Always guards against SSR with `typeof window !== 'undefined'`.
 * Pattern matches existing usage in GalleryItem.tsx and InspirationCard.tsx.
 */

import { readAnonCookie } from '../lib/anonId'

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

/* ── Favoritos ──────────────────────────────────────────────────────────────
 * Todos llevan `anon_id`. Es lo que hace que la cookie anónima valga la pena en
 * fase 1 (nada del lado servidor la lee todavía): permite medir personas
 * distintas que guardan, favoritos por persona, y si quien guarda convierte a
 * WhatsApp — o sea, el caso de negocio para financiar el backend de fase 2.
 */

export function trackFavoriteAdd(designName: string, folder?: string): void {
  if (typeof window === 'undefined') return
  if (window.gtag) {
    window.gtag('event', 'favorite_add', {
      event_category: 'favorites',
      event_label: designName,
      folder: folder ?? '',
      anon_id: readAnonCookie() ?? '',
    })
  }
  if (window.fbq) {
    window.fbq('trackCustom', 'FavoriteAdd', {
      content_name: designName,
      content_category: folder ?? '',
    })
  }
}

export function trackFavoriteRemove(designName: string): void {
  if (typeof window === 'undefined') return
  if (window.gtag) {
    window.gtag('event', 'favorite_remove', {
      event_category: 'favorites',
      event_label: designName,
      anon_id: readAnonCookie() ?? '',
    })
  }
}

export function trackFavoritesView(source: 'home' | 'page' | 'fab', count: number): void {
  if (typeof window === 'undefined') return
  if (window.gtag) {
    window.gtag('event', 'favorites_view', {
      event_category: 'favorites',
      event_label: source,
      value: count,
      anon_id: readAnonCookie() ?? '',
    })
  }
}

export function trackFavoritesWhatsApp(count: number, truncated: boolean): void {
  if (typeof window === 'undefined') return
  if (window.gtag) {
    window.gtag('event', 'favorites_whatsapp', {
      event_category: 'favorites',
      value: count,
      truncated,
      anon_id: readAnonCookie() ?? '',
    })
  }
  if (window.fbq) {
    // Señal más fuerte que el `Contact` de trackWhatsAppClick: una consulta por
    // varios diseños es un lead materialmente mejor.
    window.fbq('track', 'Lead', {
      content_name: 'favoritos_bulk',
      num_items: count,
    })
  }
}
