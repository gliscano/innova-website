import Header from './components/Header'
import Hero from './components/Hero'
import AnimatedCards from './components/AnimatedCards'
import Footer from './components/Footer'
import FAQ from './components/FAQ'
import ProductCategoryMenu from './components/ProductCategoryMenu'
import PriceList from './components/PriceList'
import DesignCatalog from './components/gallery/DesignCatalog'
import HeroProps from './components/HeroProps'
import { HeroGallery } from './components/hero/HeroGallery'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* <Hero /> */}
        <HeroGallery />
        <AnimatedCards />
        <DesignCatalog />
        <PriceList />
        <HeroProps />
        <ProductCategoryMenu />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}