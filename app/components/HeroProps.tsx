import PhotographyBackdrop from './PhotographyBackdrop'

const PropsNewborn = [
  { 
    id: 0,
    name: 'Props Luna mágica ',
    image: '/images/innova/props/cards-props-1.jpg',
    title: '',
    subtitle: ''
  },
  { 
    id: 1,
    name: 'Props Luna mágica',
    image: '/images/innova/props/cards-props-2.jpg',
    title: '',
    subtitle: ''
  },
  { 
    id: 2,
    name: 'Props Hoja de ensuño',
    image: '/images/innova/props/cards-props-3.jpg',
    title: '',
    subtitle: ''
  },
  { 
    id: 3,
    name: 'Props Nido de nubes',
    image: '/images/innova/props/cards-props-4.jpg',
    title: '',
    subtitle: ''
  },
  { 
    id: 4,
    name: 'Props Soft Nest',
    image: '/images/innova/props/cards-props-5.jpg',
    title: '',
    subtitle: ''
  }
]

export default function HeroProps() {
  return (
    <div className="relative isolate overflow-hidden gradient-light-colors-props">     
      <div className="mx-auto max-w-7xl px-6 pb-2 pt-6 lg:pt-12 lg:pb-12 lg:flex lg:px-8 lg:py-8">
        <div className="mx-auto max-w-md flex-shrink-0 lg:mx-0 lg:w-md lg:pt-4">
          <h1 className="mt-4 pr-4 text-3xl copperplate-condensed-bold-font text-amber-800 sm:text-5xl">
            <a
              href="https://innova54store.empretienda.com.ar/linea-new-born"
              target="_self"
              rel="noopener noreferrer"
            >
              Línea Newborn
              Almohadones y Mantas  
            </a>
          </h1>
          <p className="mt-2 mb-6 copperplate-condensed-ligth-font text-lg leading-8 text-slate-700">
            Ideal para composiciones lleva de ternura
          </p>
          <span className="mt-8 pr-4inline-flex items-center justify-center bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 backdrop-blur-sm">
            <a
              href="https://innova54store.empretienda.com.ar/linea-new-born"
              target="_self"
              rel="noopener noreferrer"
            >
              Quiero ver los productos!
            </a>
          </span>
        </div>
        <div className="relative w-full h-[11rem] md:h-[18rem] lg:h-[21rem] my-4 lg:my-4 overflow-hidden rounded-lg">
          <PhotographyBackdrop backdrops={PropsNewborn} showPreview={false} />
        </div>
      </div>
    </div>
  )
}

