import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DesignCatalog from '../components/gallery/DesignCatalog'

export const metadata: Metadata = {
  title: 'Catálogo de Diseños',
  description: 'Explorá más de 10.000 diseños de fondos fotográficos. Filtrá por categoría, estilo y medida. Infantiles, Boho, Navidad, Baby Shower y mucho más.',
  openGraph: {
    title: 'Catálogo de Diseños | Innova',
    description: 'Más de 10.000 fondos fotográficos para cada tipo de sesión.',
    url: 'https://www.innova54.com/design-catalog',
  },
}

export default function DesignCatalogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <DesignCatalog />
      </main>
      <Footer />
    </div>
  )
}