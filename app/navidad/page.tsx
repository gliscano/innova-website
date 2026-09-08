import type { Metadata } from 'next'
import NavidadPageContent from './NavidadPageContent'
import { absoluteUrl } from '../lib/siteUrl'

export const metadata: Metadata = {
  title: 'Catálogo Navidad 2026',
  description: 'Descubrí los fondos fotográficos de Navidad 2026 de Innova: 6 categorías únicas para tu sesión. Tendencia, Interiores, Tradición Argentina, Mundo Infantil, Exterior y Cocinas.',
  alternates: { canonical: absoluteUrl('/navidad') },
  openGraph: {
    title: 'Catálogo Navidad 2026 | Innova',
    description: 'Seis mundos para tu sesión perfecta. Fondos fotográficos de alta definición para Navidad 2026.',
    url: absoluteUrl('/navidad'),
    images: [{ url: '/images/innova/navidad/1.jpg', width: 1200, height: 630, alt: 'Catálogo Navidad 2026 Innova' }],
  },
}

export default function NavidadPage() {
  return <NavidadPageContent />
}
