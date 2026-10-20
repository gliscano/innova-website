'use client'

import Image from 'next/image'
import { defaultOptions } from '@/app/components/WhatsAppDropdown'
import { trackWhatsAppClick } from '@/app/utils/tracking'

interface Props {
  message: string
  label?: string
  /**
   * Nombre de la vendedora del pedido (columna Vendedora). Con ella se muestra sólo su botón; si el
   * pedido no tiene o no coincide con ninguna, se muestran las dos.
   */
  vendedora?: string
}

/**
 * Botón de WhatsApp con el mensaje ya escrito. Vive en un componente cliente porque
 * `defaultOptions` sale de un módulo `'use client'` y no se puede leer desde un server component.
 */
export default function ContactWhatsApp({ message, label = 'Escribir a', vendedora }: Props) {
  const sellers = defaultOptions.map((option) => ({
    name: option.label.replace(/^Hablar con /, ''),
    phone: option.phoneNumber,
  }))
  const assigned = vendedora
    ? sellers.filter((s) => s.name.toLowerCase() === vendedora.trim().toLowerCase())
    : []
  const shown = assigned.length ? assigned : sellers

  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-center">
      {shown.map(({ name, phone }) => (
        <a
          key={phone}
          href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(`pedido_${name}`)}
          className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#25D366' }}
        >
          <Image src="/svg/whatsapp.svg" className="brightness-0 invert" alt="" width={16} height={16} aria-hidden />
          {label} {name}
        </a>
      ))}
    </div>
  )
}
