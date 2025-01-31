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
    subtitle: 'Explora modelos, dimensiones y compra tus productos ideales',
    animation: '/animations/store.json',
    href: 'https://store.innova54.com/',
  },
  { 
    title: 'Catálogo de diseños',
    subtitle: 'Descubre nuestra colección exclusiva por categorías',
    animation: '/animations/catalog.json',
    href: 'https://innova54store.empretienda.com.ar/catalogo-de-fondos',
  },
  { 
    title: 'Lista de medidas y precios',
    subtitle: 'Consulta nuestras opciones estándar y sus precios. ¡Todo al alcance de un clic!',
    animation: '/animations/list.json',
    href: '/prices',
  },
  { 
    title: 'Pasos para comprar fondos personalizados',
    subtitle: 'Fondos con dimensiones que se ajusten a tus ideas',
    animation: '/animations/steps.json',
    href: '/custom-backdrops',
  },
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
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <a
              key={card.title}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
              href={card.href}
            >
              <div
                ref={(el) => (animationRefs.current[index] = el as HTMLDivElement)}
                className="h-36 py-2"
              ></div>
              <div className="px-4 py-2 sm:p-6">
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
