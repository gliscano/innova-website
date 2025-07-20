/* eslint-disable  @typescript-eslint/no-explicit-any */

'use client'

import { useEffect, useRef, useState } from 'react'

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
    subtitle: 'Tenes dudas o consultas? Daimary y Jesus te van a ayudar!',
    animation: '/animations/whatsapp.json',
    href: 'https://wa.me/5491171142152',
  }
]

export default function AnimatedCards() {
  const animationRefs = useRef<unknown[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    if (!isClient) return

    const loadAnimations = async () => {
      try {
        const lottie = (await import('lottie-web')).default
        
        animationRefs.current.forEach((ref, index) => {
          if (ref) {
            lottie.loadAnimation({
              container: ref as any,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: cards[index].animation,
            })
          }
        })
      } catch (error) {
        console.error('Error loading lottie animations:', error)
      }
    }

    loadAnimations()
  }, [isClient])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="bg-gray-300">
      <div className="max-w-7xl mx-auto py-6 lg:py-12 px-4 sm:px-6 lg:py-8 lg:px-8">
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <a
              key={card.title}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row lg:flex-row align-center"
              href={card.href}
            >
              <div
                ref={(el) => (animationRefs.current[index] = el as unknown as any)}
                className="h-24 md:h-36 lg:h-36 px-2"
              ></div>
              <div className="px-2 py-2 sm:p-6">
                <h3 className="text-small sm:text-lg font-medium text-gray-900">{card.title}</h3>
                <h6 className="text-medium font-small text-gray-600 hidden md:block lg:block'">{card.subtitle}</h6>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
