'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

type cardsProps = { 
  title: string,
  subtitle: string,
  animation: string,
  href: string,
}

const cards: Array<cardsProps> = [
  { 
    title: 'Ir a la tienda',
    subtitle: 'Encuentra y compra los productos que necesitas!',
    animation: '/animations/store.json',
    href: 'https://store.innova54.com/',
  },
  { 
    title: 'Catálogo de diseños',
    subtitle: 'Mira nuestra colección exclusiva... Son unas bellezas!',
    animation: '/animations/catalog.json',
    href: 'https://innova54store.empretienda.com.ar/catalogo-de-fondos',
  },
  { 
    title: 'Escribir a Whatsapp',
    subtitle: 'Tienes dudas o consultas? Daimary y Jesus te van a ayudar!',
    animation: '/animations/whatsapp.json',
    href: '/prices',
  },
  /* { 
    title: 'Pasos para comprar fondos personalizados',
    subtitle: 'Fondos con dimensiones que se ajusten a tus ideas',
    animation: '/animations/steps.json',
    href: '/custom-backdrops',
  }, */
]

export default function AnimatedCards() {
  const animationRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    animationRefs.current.forEach((ref, index) => {
      if (ref) {
        lottie.loadAnimation({
          container: ref,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: cards[index].animation,
        })
      }
    })
  }, [])

  return (
    <div className="bg-rose-gold">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {cards.map((card, index) => (
            <a
              key={card.title}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300 flex align-center"
              href={card.href}
            >
              <div
                ref={(el) => (animationRefs.current[index] = el as HTMLDivElement)}
                className="h-36 px-2"
              ></div>
              <div className="px-2 py-2 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                <h6 className="text-medium font-small text-gray-400">{card.subtitle}</h6>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
