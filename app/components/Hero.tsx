import PhotographyBackdrop from './PhotographyBackdrop'

const backdrops = [
  { 
    id: 0,
    name: 'Navidad Backdrop',
    image: '/images/innova/banners-navidad-desktop.jpg',
    title: '',
    subtitle: ''
  },
  { 
    id: 1,
    name: 'Navidad Backdrop',
    image: '/images/innova/banner_linea-newborn.jpg',
    title: '',
    subtitle: ''
  },
  { 
    id: 2,
    name: 'Navidad Backdrop',
    image: '/images/innova/banner_navidad_arbol.jpg',
    title: '',
    subtitle: ''
  },
]

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
      <div className="mx-auto max-w-7xl">
        <div className="relative w-full h-[9.2rem] lg:h-[25rem] overflow-hidden">
          <PhotographyBackdrop backdrops={backdrops} showPreview={false} />
        </div>
      </div>
    </div>
  )
}

