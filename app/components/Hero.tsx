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
        {/* <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-4">
          <h1 className="mt-4 pr-4 text-3xl copperplate-bold-font font-bold text-red-800 sm:text-5xl">
            <a
              href="/navidad"
              target="_self"
              rel="noopener noreferrer"
            >
              Navidad Exclusiva 2025
            </a>
          </h1>
          <p className="mt-2 mb-6 text-lg leading-8 text-red-700">
            Los diseños serán producidos en una única edición
            <br/>
            <span className='hidden md:block lg:block'>Propuesta única • Solo 1 vez • Solo en Innova</span>
          </p>
          <span className="mt-8 pr-4inline-flex items-center justify-center bg-red-800/90 hover:bg-red-700 text-white px-6 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 backdrop-blur-sm">
            <a
              href="/navidad"
              target="_self"
              rel="noopener noreferrer"
            >
              Quiero más info!
            </a>
          </span>
        </div> */}
        <div className="relative w-full h-[12rem] overflow-hidden rounded-lg">
          <PhotographyBackdrop backdrops={backdrops} showPreview={false} />
        </div>
      </div>
    </div>
  )
}

