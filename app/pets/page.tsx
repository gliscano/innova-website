import Header from '../components/Header'
import Footer from '../components/Footer'
import PhotographyBackdrop from '../components/PhotographyBackdrop'
import { BackdropProps } from '../types/pets'

const backdrops = [
  { id: 0, name: 'Enchanted Forest', image: '/images/innpets/innpets-1.jpg' },
  { id: 1, name: 'Beach Paradise', image: '/images/innpets/innpets-2.jpg' },
  { id: 2, name: 'Cozy Living Room', image: '/images/innpets/innpets-3.jpg' },
  { id: 3, name: 'Starry Night', image: '/images/innpets/innpets-4.jpg' },
  { id: 4, name: 'Flower Garden', image: '/images/innpets/innpets-5.jpg' },
]

export default function PetsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="relative w-full h-[calc(100vh)] mt-4 overflow-hidden">
          <PhotographyBackdrop backdrops={backdrops} showPreview={true} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
