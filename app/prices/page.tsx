import './prices.css'
import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PriceList from '../components/PriceList'
import JsonLd, { breadcrumbSchema, priceProductsSchema } from '../components/JsonLd'
import { getCachedFolders } from '../lib/cloudinaryFolders'
import { SITE_URL, absoluteUrl } from '../lib/siteUrl'

export const metadata: Metadata = {
  title: 'Precios y Medidas',
  description: 'Consultá todos los precios y medidas disponibles de nuestros fondos fotográficos. Backdrops de 1.5m y 2.9m de ancho, pisos, híbridos y más.',
  alternates: { canonical: absoluteUrl('/prices') },
  openGraph: {
    title: 'Precios y Medidas | Innova',
    description: 'Fondos fotográficos en todos los tamaños. Consultá precios actualizados.',
    url: absoluteUrl('/prices'),
  },
}

export default async function PricesPage() {
  const folders = await getCachedFolders()
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={priceProductsSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: SITE_URL },
          { name: 'Precios y Medidas', url: absoluteUrl('/prices') },
        ])}
      />
      <Header />
      <main className="flex-grow prices-page">
        <PriceList initialFolders={folders} />
      </main>
      <Footer />
    </div>
  )
}
