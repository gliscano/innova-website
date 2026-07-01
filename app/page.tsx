import { Suspense } from 'react'
import type { Metadata } from 'next'
import AnimatedCards from './components/AnimatedCards'
import Footer from './components/Footer'
import FAQ from './components/FAQ'
import DesignCatalog from './components/gallery/DesignCatalog'
import { getCachedFolders } from './lib/cloudinaryFolders'
import HeroProps from './components/HeroProps'
import { HeroGallery } from './components/hero/HeroGallery'
// import { InspirationSection } from './components/inspiracion'
import LeadCaptureSection from './components/LeadCaptureSection'
import TestimonialsSection from './components/TestimonialsSection'
import StockPreview from './components/StockPreview'

export const metadata: Metadata = {
  title: 'Fondos Fotográficos y Backdrops para Fotógrafos, eventos y escenarios',
  description: 'Fondos fotográficos de alta definición para fotógrafos, eventos y escenarios.',
  openGraph: {
    title: 'Innova Backdrops | Fondos fotográficos personalizados',
    description: 'Fondos fotográficos de alta definición para fotógrafos, eventos y escenarios.',
    url: 'https://innova54.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Innova Backdrops | Fondos fotográficos de alta definición',
      },
    ],
  },
}

export default async function Home() {
  const folders = await getCachedFolders()
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroGallery />
        <AnimatedCards />
        <StockPreview />
        {/* <InspirationSection /> */}
        <DesignCatalog initialFolders={folders} />
        <HeroProps />
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
