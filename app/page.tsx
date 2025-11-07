import Header from './components/Header'
import Hero from './components/Hero'
import AnimatedCards from './components/AnimatedCards'
import Footer from './components/Footer'
import FAQ from './components/FAQ'
import ProductCategoryMenu from './components/ProductCategoryMenu'
import PriceList from './components/PriceList'
import CustomBackdropProcess from './components/CustomBackdropProcess'
import DesignCatalog from './components/gallery/DesignCatalog'
import HeroProps from './components/HeroProps'
import HeroAboutUs from './components/HeroAboutUs'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AnimatedCards />
        <DesignCatalog />
        <PriceList />
        <HeroProps />
        <ProductCategoryMenu />
        <CustomBackdropProcess />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}