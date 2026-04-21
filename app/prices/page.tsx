import type { Metadata } from 'next'
import PriceList from '../components/PriceList'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Precios y Medidas',
  description: 'Consultá todos los precios y medidas disponibles de nuestros fondos fotográficos. Backdrops de 1.5m y 2.9m de ancho, pisos, híbridos y más.',
  openGraph: {
    title: 'Precios y Medidas | Innova',
    description: 'Fondos fotográficos en todos los tamaños. Consultá precios actualizados.',
    url: 'https://www.innova54.com/prices',
  },
}

export default function PricesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PriceList />
      </main>
      <Footer />
    </div>
  )
}