import type { Metadata } from 'next'
import NavidadPageContent from './NavidadPageContent'

export const metadata: Metadata = {
  title: 'Navidad Exclusiva',
  description: 'Colección navideña exclusiva de fondos fotográficos Innova. Diseños únicos producidos en una sola edición para sesiones de Navidad.',
  openGraph: {
    title: 'Navidad Exclusiva | Innova',
    description: 'Fondos fotográficos navideños de edición limitada. Solo en Innova.',
    url: 'https://www.innova54.com/navidad',
    images: [{ url: '/images/innova/navidad/1.jpg', alt: 'Fondos Navidad Innova' }],
  },
}

export default function NavidadPage() {
  return <NavidadPageContent />
}
