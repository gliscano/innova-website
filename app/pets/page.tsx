import Header from '../components/Header'
import Footer from '../components/Footer'
import PhotographyBackdrop from '../components/PhotographyBackdrop'

export default function PetsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PhotographyBackdrop />
      </main>
      <Footer />
    </div>
  )
}
