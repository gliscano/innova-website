'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

const cards = [
  { title: 'Ir a la tienda', animation: '/animations/store.json' },
  { title: 'Escribir a WhatsApp', animation: '/animations/whatsapp.json' },
  { title: 'Catálogo de diseños', animation: '/animations/catalog.json' },
  { title: 'Lista de medidas y precios', animation: '/animations/list.json' },
  { title: 'Pasos para fondos a medidas', animation: '/animations/steps.json' },
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              <div
                ref={(el) => (animationRefs.current[index] = el as HTMLDivElement)}
                className="h-48"
              ></div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
