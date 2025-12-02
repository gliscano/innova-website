'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface DefaultOptions {
  label: string
  phoneNumber: string
}

export interface WhatsAppDropdownProps {
  message: string
  buttonText?: string
  className?: string
}

const defaultOptions: DefaultOptions[] = [
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
}: WhatsAppDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = () => {
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={className}
        aria-label={buttonText}
        aria-expanded={isOpen}
      >
        <Image
          aria-hidden
          src="/svg/whatsapp.svg"
          alt="Whatsapp icon"
          className="mr-2"
          width={20}
          height={20}
        />
        <span>{buttonText}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {defaultOptions.map((option, index) => (
            <Link
              key={index}
              href={`https://wa.me/${option.phoneNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOptionClick}
              className="block px-4 py-3 text-black hover:bg-gray-100 transition-colors duration-150 text-left border-b border-gray-100 last:border-b-0"
            >
              {option.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

