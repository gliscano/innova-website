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
 /*  { 
    id: 0,
    name: 'Navidad Backdrop',
    image: '/images/innova/hero-09.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 1,
    name: 'Navidad Backdrop',
    image: '/images/innova/hero-11.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 2,
    name: 'Navidad Backdrop',
    image: '/images/innova/hero-10.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 3,
    name: 'autos Backdrop',
    image: '/images/innova/hero-1.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 4,
    name: 'Alas Backdrop',
    image: '/images/innova/hero-2.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 5,
    name: 'infantil Backdrop',
    image: '/images/innova/hero-3.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 6,
    name: 'escolar Backdrop',
    image: '/images/innova/hero-4.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 7,
    name: 'Grunge Backdrop',
    image: '/images/innova/hero-5.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 8,
    name: 'escolar infantil Backdrop',
    image: '/images/innova/hero-6.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 9,
    name: 'escolar Backdrop',
    image: '/images/innova/hero-7.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 10,
    name: 'infantil Backdrop',
    image: '/images/innova/hero-8.png',
    title: '',
    subtitle: ''
  } */
]

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
      <div className="mx-auto max-w-7xl">
        <div className="relative w-full h-[12rem] overflow-hidden">
          <PhotographyBackdrop backdrops={backdrops} showPreview={false} />
        </div>
      </div>
    </div>
  )
}

