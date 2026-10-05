import { Suspense } from 'react'
import type { Metadata } from 'next'
import AnimatedCards from './components/AnimatedCards'
import Footer from './components/Footer'
import FAQ from './components/FAQ'
import DesignCatalog from './components/gallery/DesignCatalog'
import NavidadBanner from './components/NavidadBanner'
import { getCachedFolders } from './lib/cloudinaryFolders'
import { SITE_URL } from './lib/siteUrl'
import HeroProps from './components/HeroProps'
import { HeroGallery } from './components/hero/HeroGallery'
import { HeroTopBar } from './components/hero/HeroTopBar'
// import { InspirationSection } from './components/inspiracion'
// import LeadCaptureSection from './components/LeadCaptureSection'
import TestimonialsSection from './components/TestimonialsSection'
import StockPreview from './components/StockPreview'

export const metadata: Metadata = {
  // El título va escrito completo acá a propósito: `title.template` del layout no aplica al mismo
  // segmento donde se define, y la home comparte segmento con el layout raíz.
  title: 'Innova - Fondos Fotográficos y Backdrops para Fotógrafos, eventos y marcas',
  description: 'Más de 4.500 diseños de fondos fotográficos en alta definición, distintas medidas y fondos personalizados para fotógrafos y eventos.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Innova Backdrops | Fondos fotográficos personalizados',
    description: 'Fondos fotográficos de alta definición para fotógrafos, eventos y escenarios.',
    url: SITE_URL,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Innova Backdrops | Fondos fotográficos de alta definición',
      },
    ],
  },
}

export default async function Home() {
  const folders = await getCachedFolders()
  // El buscador de la barra solo necesita nombre, título y conteo de cada carpeta.
  const searchFolders = folders.map(({ folderName, title, imageCount, isCollection }) => ({
    folderName,
    title,
    imageCount,
    isCollection,
  }))
  return (
    <div className="min-h-screen flex flex-col">
      <HeroTopBar folders={searchFolders} />
      <main className="flex-grow">
        <HeroGallery folders={folders} />
        <AnimatedCards />
        <StockPreview />
        {/* <InspirationSection /> */}
        <NavidadBanner />
        <DesignCatalog initialFolders={folders} />
        <HeroProps />
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
        <FAQ />
        {/* <LeadCaptureSection /> */}
      </main>
      <Footer />
    </div>
  )
}
