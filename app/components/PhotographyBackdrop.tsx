'use client'


import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BackdropProps } from '../types/pets'

type PhotographyBackdropProps = {
  backdrops: Array<BackdropProps>;
  showPreview: boolean;
}

export default function PhotographyBackdrop({ backdrops, showPreview }: PhotographyBackdropProps) {
  const [currentBackdrop, setCurrentBackdrop] = useState(backdrops[0])

  useEffect(() => {
    const timer = setInterval(() => {     
      try {
        setCurrentBackdrop((preState) => {
          const nextIndex = (preState.id + 1) % backdrops.length;
          console.log('nextIndex', nextIndex);

          return backdrops[nextIndex]
        })
      } catch (error) {
        setCurrentBackdrop(backdrops[0])
      }
    }, 2000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={'/svg/backdrop-stand.svg'}
        alt={"backdrop-stand"}
        layout="fill"
        objectFit="contain"
        className="object-cover mt-1"
      />
      <div className="absolute inset-0 flex items-center justify-center mx-32 my-1">
        <Image
          src={currentBackdrop.image}
          alt={currentBackdrop.name}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-opacity-5" />
      <div className="absolute inset-x-0 bottom-0 h-32" />

      {showPreview && (
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
      )}
      <div className="absolute top-8 left-1/2 transform -translate-x-3/4 text-left">
        <h1 className="text-4xl font-bold text-white mb-4 opacity-75">...</h1>
        <p className="text-xl text-gray-200">...</p>
      </div>
    </div>
  )
}