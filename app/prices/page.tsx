import PriceList from '../components/PriceList'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PricesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PriceList />
      </main>
      <Footer />
    </div>
  )
}