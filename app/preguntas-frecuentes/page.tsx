import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FAQ from '../components/FAQ'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Resolvemos tus dudas sobre fondos fotográficos Innova: materiales, tiempos de producción, medidas, envíos y formas de pago.',
  openGraph: {
    title: 'Preguntas Frecuentes | Innova',
    description: 'Todo lo que necesitás saber sobre nuestros fondos fotográficos.',
    url: 'https://www.innova54.com/preguntas-frecuentes',
  },
}

export default function PricesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}