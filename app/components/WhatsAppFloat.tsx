'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { defaultOptions } from './WhatsAppDropdown'
import { useSelectedSize } from '../context/SelectedSizeContext'
import { trackWhatsAppClick } from '@/app/utils/tracking'

const DEFAULT_MESSAGE = "Hola! Quiero consultar sobre sus fondos fotográficos"

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false)
  const [hiddenForHero, setHiddenForHero] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { isModalOpen } = useSelectedSize()
  const pathname = usePathname()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    const heroEl = document.querySelector('.nv-hero')
    if (!heroEl) {
      setHiddenForHero(false)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setHiddenForHero(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(heroEl)
    return () => observer.disconnect()
  }, [pathname])

  if (isModalOpen || hiddenForHero) return null

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden mb-1 w-52">
          <p className="text-xs text-gray-500 px-4 py-2 border-b border-gray-100 font-medium">
            Escribinos por WhatsApp
          </p>
          {defaultOptions.map((option, i) => (
            <Link
              key={i}
              href={`https://wa.me/${option.phoneNumber}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackWhatsAppClick(option.label); setIsOpen(false) }}
              className="flex items-center gap-2 px-4 py-3 hover:bg-green-50 text-sm text-gray-800 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <Image src="/svg/whatsapp.svg" alt="" width={16} height={16} aria-hidden />
              {option.label}
            </Link>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contactar por WhatsApp"
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white px-3 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Image src="/svg/whatsapp.svg" className='brightness-0 invert' alt="" width={22} height={22} aria-hidden />
      </button>
    </div>
  )
}
