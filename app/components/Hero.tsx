import PhotographyBackdrop from './PhotographyBackdrop'

const backdrops = [
  { 
    id: 0,
    name: 'Pascuas Backdrop',
    image: '/images/innova/background-pascuas.jpg',
    title: '',
    subtitle: ''
  },{ 
    id: 1,
    name: 'Romantico Backdrop',
    image: '/images/innova/background-romantico.jpg',
    title: '',
    subtitle: ''
  },{ 
    id: 2,
    name: 'Professional Backdrop',
    image: '/images/innova/background-profesional.jpg',
    title: '',
    subtitle: ''
  },
]

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto">
        <div className="relative w-full h-[10.2rem] lg:h-[21rem] overflow-hidden">
          <PhotographyBackdrop backdrops={backdrops} showPreview={false} />
        </div>
      </div>
    </div>
  )
}

