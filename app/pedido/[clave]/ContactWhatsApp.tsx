'use client'

import Image from 'next/image'
import { defaultOptions } from '@/app/components/WhatsAppDropdown'
import { trackWhatsAppClick } from '@/app/utils/tracking'

/**
 * Un botón por vendedora, con el mensaje ya escrito. Vive en un componente cliente porque
 * `defaultOptions` sale de un módulo `'use client'` y no se puede leer desde un server component.
 */
export default function ContactWhatsApp({ message, label = 'Escribir a' }: { message: string; label?: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-center">
      {defaultOptions.map((option) => {
        const name = option.label.replace(/^Hablar con /, '')
        return (
          <a
            key={option.phoneNumber}
            href={`https://wa.me/${option.phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick(`pedido_${name}`)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: '#25D366' }}
          >
            <Image src="/svg/whatsapp.svg" className="brightness-0 invert" alt="" width={16} height={16} aria-hidden />
            {label} {name}
          </a>
        )
      })}
    </div>
  )
}
