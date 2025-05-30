'use client'

import Image from 'next/image'

type cardsProps = { 
  title: string,
  image: string,
  href: string,
}

const cards: Array<cardsProps> = [
  { 
    title: 'Set y Fondos de Tela',
    image: '/images/innova/icon-product-type-01.png',
    href: 'https://innova54store.empretienda.com.ar/productos-en-stock/fondos-en-tela',
  },
  { 
    title: 'Set y Fondos Híbridos',
    image: '/images/innova/icon-product-type-04.png',
    href: 'https://innova54store.empretienda.com.ar/productos-en-stock/fondos-hibridos',
  },
  { 
    title: 'Fondos para mascotas',
    image: '/images/innova/icon-product-type-02.png',
    href: 'https://innova54store.empretienda.com.ar/productos-en-stock/innpets-mascotas',
  },
  { 
    title: 'Pisos y Alfombras',
    image: '/images/innova/icon-product-type-03.png',
    href: 'https://innova54store.empretienda.com.ar/productos-en-stock/pisos-simil-neoprene',
  }
]

export default function ProductCategoryMenu() {

  return (
    <div className="bg-yellow-gold">
      <div className="max-w-7xl mx-auto py-6 px-8 sm:px-6 lg:py-8 lg:px-8 flex flex-col justify-center">
        <h1 className='font-bold tracking-tight text-gray-900 sm:text-2xl text-center pb-4'>
          Que queres ver?
        </h1>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 flex align-center">
          {cards.map((card) => (
            <a
              key={card.title}
              className="bg-rose-gold-light rounded-xl p-1 flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
              href={card.href}
            >
              <Image
                src={card.image}
                alt={card.title}
                width={128}
                height={128}
                className="object-cover"
              />
              <div className="px-2 py-2 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
