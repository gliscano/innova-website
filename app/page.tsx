import AnimatedCards from './components/AnimatedCards'
import Footer from './components/Footer'
import FAQ from './components/FAQ'
import ProductCategoryMenu from './components/ProductCategoryMenu'
import DesignCatalog from './components/gallery/DesignCatalog'
import HeroProps from './components/HeroProps'
import { HeroGallery } from './components/hero/HeroGallery'
import { HomeSizePickerWithPrices } from './components/HomeSizePickerWithPrices'
import { InspirationSection } from './components/inspiracion'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* <Hero /> */}
        <HeroGallery />
        <AnimatedCards />
        <InspirationSection />
        <DesignCatalog />
        <HomeSizePickerWithPrices />
        <HeroProps />
        <ProductCategoryMenu />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}