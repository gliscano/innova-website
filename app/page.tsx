import { Suspense } from 'react'
import type { Metadata } from 'next'
import AnimatedCards from './components/AnimatedCards'
import Footer from './components/Footer'
import FAQ from './components/FAQ'
import ProductCategoryMenu from './components/ProductCategoryMenu'
import DesignCatalog from './components/gallery/DesignCatalog'
import { getCachedFolders } from './lib/cloudinaryFolders'
import HeroProps from './components/HeroProps'
import { HeroGallery } from './components/hero/HeroGallery'
import { HomeSizePickerWithPrices } from './components/HomeSizePickerWithPrices'
import { InspirationSection } from './components/inspiracion'
import LeadCaptureSection from './components/LeadCaptureSection'
import TestimonialsSection from './components/TestimonialsSection'

export const metadata: Metadata = {
  title: 'Fondos Fotográficos y Backdrops para Fotógrafos',
  description: 'Fondos fotográficos (backdrops) y props de diseño exclusivo para fotógrafos y decoradores en Argentina. Más de 10.000 diseños. Producción a medida.',
  openGraph: {
    title: 'Innova Backdrops | Fondos fotográficos personalizados',
    description: 'Diseñamos fondos fotográficos de alta definición para fotógrafos, eventos y estudios creativos.',
    url: 'https://www.innova54.com',
  },
}

export default async function Home() {
  const folders = await getCachedFolders()
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroGallery />
        <AnimatedCards />
        <InspirationSection />
        <DesignCatalog initialFolders={folders} />
        <HomeSizePickerWithPrices />
        <HeroProps />
        <ProductCategoryMenu />
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
        <FAQ />
        <LeadCaptureSection />
      </main>
      <Footer />
    </div>
  )
}
