'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { defaultOptions } from './WhatsAppDropdown'
import { useSelectedSize } from '../context/SelectedSizeContext'
import { useCart } from '../context/CartContext'
import { trackWhatsAppClick } from '@/app/utils/tracking'
import { decodeSegment, formatFolderName } from '@/app/utils/catalogUtils'

const DEFAULT_MESSAGE = "Hola! Quiero consultar sobre sus fondos fotográficos"

/**
 * Mensaje según la página, para que ninguna conversación llegue sin contexto.
 * Se suma la URL (sin query) para que la vendedora vea exactamente qué estaba mirando.
 */
function contextMessage(pathname: string | null): string {
  const path = pathname ?? '/'
  let text = DEFAULT_MESSAGE

  const catalog = path.match(/^\/design-catalog\/([^/]+)/)
  if (catalog) {
    text = `Hola! Estoy viendo el catálogo *${formatFolderName(decodeSegment(catalog[1]))}* y tengo una consulta.`
  } else if (path.startsWith('/prices')) {
    text = 'Hola! Tengo una consulta sobre precios y medidas de los fondos.'
  } else if (path.startsWith('/navidad')) {
    text = 'Hola! Estoy viendo los diseños de Navidad y tengo una consulta.'
  } else if (path.startsWith('/preguntas-frecuentes')) {
    text = 'Hola! Leí las preguntas frecuentes y tengo una consulta.'
  } else if (path.startsWith('/terminos-y-condiciones')) {
    text = 'Hola! Tengo una consulta sobre los términos y condiciones.'
  }

  if (path !== '/' && typeof window !== 'undefined') {
    text += `\n${window.location.origin}${path}`
  }
  return text
}

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false)
  const [hiddenForHero, setHiddenForHero] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { isModalOpen } = useSelectedSize()
  const { count, canUndoSent } = useCart()
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

  // Con algo en "Mi pedido" el único camino a WhatsApp es enviarlo (la barra ocupa este lugar).
  // En /pedido/<clave> el cliente ya tiene el botón de su vendedora.
  if (isModalOpen || hiddenForHero || count > 0 || canUndoSent || pathname?.startsWith('/pedido/')) return null

  const message = contextMessage(pathname)

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
              href={`https://wa.me/${option.phoneNumber}?text=${encodeURIComponent(message)}`}
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
