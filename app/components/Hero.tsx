import PhotographyBackdrop from './PhotographyBackdrop'

const backdrops = [
  { 
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
  }
]

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
      <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96" />
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-2 pt-6 lg:pt-12 lg:pb-12 lg:flex lg:px-8 lg:py-8">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-4">
          <h1 className="mt-4 pr-4 text-3xl copperplate-bold-font font-bold text-red-800 sm:text-5xl">
            <a
              href="/navidad"
              target="_self"
              rel="noopener noreferrer"
            >
              Ingresa al Lanzamiento de la Navidad 2025
            </a>
          </h1>
          <p className="mt-2 mb-6 text-lg leading-8 text-gray-600">
            Los diseños serán producidos en una única edición
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
        </div>
        <div className="relative w-full h-[11rem] md:h-[18rem] lg:h-[18rem] my-4 lg:my-4 overflow-hidden rounded-lg">
          <PhotographyBackdrop backdrops={backdrops} showPreview={false} />
        </div>
      </div>
    </div>
  )
}

