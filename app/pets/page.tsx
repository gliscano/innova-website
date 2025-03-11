import Header from '../components/Header'
import Footer from '../components/Footer'
import PhotographyBackdrop from '../components/PhotographyBackdrop'

const backdrops = [
  { id: 0, name: 'Enchanted Forest', image: '/images/innpets/innpets-1.jpg', title: '', subtitle: '' },
  { id: 1, name: 'Beach Paradise', image: '/images/innpets/innpets-2.jpg', title: '', subtitle: '' },
  { id: 2, name: 'Cozy Living Room', image: '/images/innpets/innpets-3.jpg', title: '', subtitle: '' },
  { id: 3, name: 'Starry Night', image: '/images/innpets/innpets-4.jpg', title: '', subtitle: '' },
  { id: 4, name: 'Flower Garden', image: '/images/innpets/innpets-5.jpg', title: '', subtitle: '' },
]

export default function PetsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex items-center justify-center">
        <div className="relative w-[calc(177vh)] h-[calc(80vh)] mt-4 overflow-hidden">
          <PhotographyBackdrop backdrops={backdrops} showPreview={true} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
