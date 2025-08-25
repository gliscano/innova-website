'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  '/images/innova/neoprene.jpg',
  '/images/innova/banner_01.jpg',
  '/images/innova/banner_02.jpg',
  '/images/innova/banner_03.jpg',
]


export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(()=> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('carousel index', currentIndex)
    }
  }, [currentIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt={`Studio workspace ${index + 1}`}
            className='object-fill'
            fill={true}
          />
        </div>
      ))}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Previous image"
      >
        <Image
         aria-hidden
         src="svg/chevron-left.svg"
         alt="left btn"
         className="text-gray-800"
         width={24}
         height={24}
        />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Next image"
      >
        <Image
         aria-hidden
         src="svg/chevron-right.svg"
         alt="Right btn"
         className="text-gray-800"
         width={24}
         height={24}
        />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full focus:outline-none ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}