import Header from '../components/Header'
import Footer from '../components/Footer'
import FAQ from '../components/FAQ'

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