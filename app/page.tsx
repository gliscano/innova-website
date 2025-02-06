import Header from './components/Header'
import Hero from './components/Hero'
import AnimatedCards from './components/AnimatedCards'
import Footer from './components/Footer'
import ProductCategoryMenu from './components/ProductCategoryMenu'
import PriceList from './components/PriceList'
import CustomBackdropProcess from './components/CustomBackdropProcess'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AnimatedCards />
        <ProductCategoryMenu />
        <PriceList />
        <CustomBackdropProcess />
      </main>
      <Footer />
    </div>
  )
}