import type { Metadata } from 'next'
import NavidadPageContent from './NavidadPageContent'

export const metadata: Metadata = {
  title: 'Catálogo Navidad 2026',
  description: 'Descubrí los fondos fotográficos de Navidad 2026 de Innova: 6 categorías únicas para tu sesión. Tendencia, Interiores, Tradición Argentina, Mundo Infantil, Exterior y Cocinas.',
  openGraph: {
    title: 'Catálogo Navidad 2026 | Innova',
    description: 'Seis mundos para tu sesión perfecta. Fondos fotográficos de alta definición para Navidad 2026.',
    url: 'https://www.innova54.com/navidad',
    images: [{ url: '/images/innova/navidad/1.jpg', alt: 'Catálogo Navidad 2026 Innova' }],
  },
}

export default function NavidadPage() {
  return <NavidadPageContent />
}
