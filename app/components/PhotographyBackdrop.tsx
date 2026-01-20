'use client'


import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BackdropProps } from '../types/pets'

type PhotographyBackdropProps = {
  backdrops: Array<BackdropProps>;
  showPreview: boolean;
}

export default function PhotographyBackdrop({ backdrops, showPreview }: PhotographyBackdropProps) {
  const [currentBackdropId, setCurrentBackdropId] = useState(backdrops[0]?.id || 0)
  const timerToChangeImage = 4000;

  // Precargar solo la imagen actual y la siguiente (precarga condicional)
  useEffect(() => {
    const currentIndex = backdrops.findIndex(b => b.id === currentBackdropId)
    if (currentIndex === -1) return
    
    const nextIndex = (currentIndex + 1) % backdrops.length
    
    // Precargar solo la actual y la siguiente
    const imagesToPreload = [
      backdrops[currentIndex],
      backdrops[nextIndex]
    ].filter(Boolean)
    
    imagesToPreload.forEach((backdrop) => {
      const img = new window.Image()
      img.src = backdrop.image
    })
  }, [currentBackdropId, backdrops])

  useEffect(() => {
    const timer = setInterval(() => {     
      try {
        setCurrentBackdropId((prevId) => {
          const currentIndex = backdrops.findIndex(b => b.id === prevId)
          const nextIndex = (currentIndex + 1) % backdrops.length
          return backdrops[nextIndex].id
        })
      } catch (error) {
        console.error('Error en cambio de backdrop:', error)
        setCurrentBackdropId(backdrops[0]?.id || 0)        
      }
    }, timerToChangeImage)
    return () => clearInterval(timer)
  }, [backdrops])
  
  const currentBackdrop = backdrops.find(b => b.id === currentBackdropId) || backdrops[0]
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {backdrops.map((backdrop) => (
          <div
            key={backdrop.id}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
              currentBackdropId === backdrop.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={backdrop.image}
              alt={backdrop.name}
              className="w-full h-full object-cover"
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-opacity-5" />
      <div className="absolute inset-x-0 bottom-0 h-32" />

      {showPreview && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {backdrops.map((backdrop) => (
            <button
              key={backdrop.id}
              onClick={() => setCurrentBackdropId(backdrop.id)}
              className={`w-16 h-16 rounded-full border-4 ${
                currentBackdropId === backdrop.id ? 'border-white' : 'border-gray-400'
              } overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <Image
                src={backdrop.image}
                alt={backdrop.name}
                width={64}
                height={64}
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
      {currentBackdrop.title && (
      <div className="absolute top-8 left-1/2 transform -translate-x-3/4 text-left">
          <h1 className="text-4xl font-bold text-white mb-4 opacity-75">{currentBackdrop.title}</h1>
          <p className="text-xl text-gray-200">{currentBackdrop.subtitle}</p>
        </div>
      )}
    </div>
  )
}