'use client'

import { useState, useRef, useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { trackWhatsAppClick } from '@/app/utils/tracking'

export interface DefaultOptions {
  label: string
  phoneNumber: string
}

export interface WhatsAppDropdownProps {
  message: string
  buttonText?: string
  className?: string
  iconClassName?: string
  /** Solo el ícono (botón cuadrado); `buttonText` queda como aria-label. */
  iconOnly?: boolean
  wrapperClassName?: string
  /** Después de elegir vendedora (el link ya se abrió con el mensaje armado). */
  onSelect?: (label: string) => void
}

export const defaultOptions: DefaultOptions[] = [
  {
    label: 'Hablar con Daniela',
    phoneNumber: "5491171419752"
  },
  {
    label: 'Hablar con Daimary',
    phoneNumber: "5491171142152"
  }
]

export default function WhatsAppDropdown({
  message,
  buttonText = 'Acción',
  className = '',
  iconClassName = '',
  iconOnly = false,
  wrapperClassName = 'relative w-full',
  onSelect,
}: WhatsAppDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleScroll = () => setIsOpen(false)

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  const toggleDropdown = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const dropdownH = defaultOptions.length * 52
      const spaceAbove = rect.top
      // Centrado sobre el botón, pero sin salirse de la pantalla (botón chico pegado al borde).
      const left = Math.min(Math.max(rect.left + rect.width / 2 - 112, 8), window.innerWidth - 232)

      if (spaceAbove >= dropdownH) {
        setDropdownStyle({ position: 'fixed', bottom: window.innerHeight - rect.top + 8, left, width: 224, zIndex: 9999 })
      } else {
        setDropdownStyle({ position: 'fixed', top: rect.bottom + 8, left, width: 224, zIndex: 9999 })
      }
    }
    setIsOpen(v => !v)
  }

  const handleOptionClick = (label: string) => {
    trackWhatsAppClick(label)
    setIsOpen(false)
    onSelect?.(label)
  }

  return (
    <div className={wrapperClassName} ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className={className}
        aria-label={buttonText}
        aria-expanded={isOpen}
        title={iconOnly ? buttonText : undefined}
      >
        <Image
          aria-hidden
          src="/svg/whatsapp.svg"
          alt="Whatsapp icon"
          className={`${iconOnly ? '' : 'mr-2'} ${iconClassName}`}
          width={20}
          height={20}
        />
        {!iconOnly && <span>{buttonText}</span>}
        {!iconOnly && <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>}
      </button>

      {isOpen && (
        <div
          style={{
            ...dropdownStyle,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-md)',
          }}
          className="rounded-lg overflow-hidden"
        >
          {defaultOptions.map((option, index) => (
            <Link
              key={index}
              href={`https://wa.me/${option.phoneNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleOptionClick(option.label)}
              style={{ color: 'var(--ink)', borderBottom: index < defaultOptions.length - 1 ? '1px solid var(--line)' : undefined }}
              className="block px-4 py-3 transition-colors duration-150 text-left hover:bg-[var(--surface-2)]"
            >
              {option.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

