import Header from '../components/Header'
import Footer from '../components/Footer'
import DesignCatalog from '../components/gallery/DesignCatalog'

export default function DesignCatalogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <DesignCatalog />
      </main>
      <Footer />
    </div>
  )
}