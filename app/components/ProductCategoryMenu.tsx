'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import Image from 'next/image'

type cardsProps = { 
  title: string,
  image: string,
  href: string,
}

const cards: Array<cardsProps> = [
  { 
    title: 'Set y Fondos de Tela',
    image: '/images/innova/icon-product-type-01.jpg',
    href: 'https://store.innova54.com/',
  },
  { 
    title: 'Fondos para mascotas',
    image: '/images/innova/icon-product-type-02.jpg',
    href: 'https://innova54store.empretienda.com.ar/catalogo-de-fondos',
  },
  { 
    title: 'Pisos y Alfombras',
    image: '/images/innova/icon-product-type-03.jpg',
    href: '/prices',
  }
]

export default function ProductCategoryMenu() {

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:pb-16 lg:px-8 flex flex-col justify-center">
        <h1 className='font-bold tracking-tight text-gray-900 sm:text-2xl text-center my-4'>
          Que quieres ver?
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-3 flex align-center">
          {cards.map((card, index) => (
            <a
              key={card.title}
              className="bg-white rounded-xl flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
              href={card.href}
            >
              <Image
                src={card.image}
                alt={card.title}
                width={128}
                height={128}
                className="object-cover"
              />
              <div className="px-4 py-2 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
