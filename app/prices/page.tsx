import './prices.css'
import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PriceList from '../components/PriceList'
import { getCachedFolders } from '../lib/cloudinaryFolders'

export const metadata: Metadata = {
  title: 'Precios y Medidas',
  description: 'Consultá todos los precios y medidas disponibles de nuestros fondos fotográficos. Backdrops de 1.5m y 2.9m de ancho, pisos, híbridos y más.',
  openGraph: {
    title: 'Precios y Medidas | Innova',
    description: 'Fondos fotográficos en todos los tamaños. Consultá precios actualizados.',
    url: 'https://www.innova54.com/prices',
  },
}

export default async function PricesPage() {
  const folders = await getCachedFolders()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow prices-page">
        <PriceList initialFolders={folders} />
      </main>
      <Footer />
    </div>
  )
}
