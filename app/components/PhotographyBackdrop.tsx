'use client'

import { useState } from 'react'
import Image from 'next/image'

const backdrops = [
  { id: 1, name: 'Enchanted Forest', image: '/images/innpets/innpets-1.jpg?height=800&width=1200&text=Enchanted+Forest' },
  { id: 2, name: 'Beach Paradise', image: '/images/innpets/innpets-2.jpg?height=800&width=1200&text=Beach+Paradise' },
  { id: 3, name: 'Cozy Living Room', image: '/images/innpets/innpets-3.jpg?height=800&width=1200&text=Cozy+Living+Room' },
  { id: 4, name: 'Starry Night', image: '/images/innpets/innpets-4.jpg?height=800&width=1200&text=Starry+Night' },
  { id: 5, name: 'Flower Garden', image: '/images/innpets/innpets-5.jpg?height=800&width=1200&text=Flower+Garden' },
]

export default function PhotographyBackdrop() {
  const [currentBackdrop, setCurrentBackdrop] = useState(backdrops[0])

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-gray-100 overflow-hidden">
      <Image
        src={'/svg/backdrop-stand.svg'}
        alt={"backdrop-stand"}
        layout="fill"
        objectFit="cover"
        className="object-cover mt-1"
      />
      <div className="absolute bg-white inset-0 flex items-center justify-center mx-32 my-1">
        <Image
          src={currentBackdrop.image}
          alt={currentBackdrop.name}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-white bg-opacity-5" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {backdrops.map((backdrop) => (
          <button
            key={backdrop.id}
            onClick={() => setCurrentBackdrop(backdrop)}
            className={`w-16 h-16 rounded-full border-4 ${
              currentBackdrop.id === backdrop.id ? 'border-white' : 'border-gray-400'
            } overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <Image
              src={backdrop.image}
              alt={backdrop.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="absolute top-8 left-1/2 transform -translate-x-3/4 text-left">
        <h1 className="text-4xl font-bold text-white mb-4 opacity-75">Elige el fondo perfecto para tu mascota</h1>
        <p className="text-xl text-gray-200">...</p>
      </div>
    </div>
  )
}