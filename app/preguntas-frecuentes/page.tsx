import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FAQ from '../components/FAQ'
import JsonLd, { breadcrumbSchema, faqPageSchema } from '../components/JsonLd'
import { faqCategories } from '../data/faqsData'
import { SITE_URL, absoluteUrl } from '../lib/siteUrl'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Resolvemos tus dudas sobre fondos fotográficos Innova: materiales, tiempos de producción, medidas, envíos y formas de pago.',
  alternates: { canonical: absoluteUrl('/preguntas-frecuentes') },
  openGraph: {
    title: 'Preguntas Frecuentes | Innova',
    description: 'Todo lo que necesitás saber sobre nuestros fondos fotográficos.',
    url: absoluteUrl('/preguntas-frecuentes'),
  },
}

export default function PricesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={faqPageSchema(faqCategories)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: SITE_URL },
          { name: 'Preguntas Frecuentes', url: absoluteUrl('/preguntas-frecuentes') },
        ])}
      />
      <Header />
      <main className="flex-grow">
        <FAQ headingLevel="h1" />
      </main>
      <Footer />
    </div>
  )
}