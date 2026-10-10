'use client'

import { useState } from 'react'
import type { TransferInfo } from '@/app/lib/transferInfo'
import ContactWhatsApp from './ContactWhatsApp'

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin permiso de portapapeles: el valor sigue visible para copiarlo a mano.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2.5" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>{label}</p>
        <p className="font-semibold break-all" style={{ color: 'var(--ink)' }}>{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
        style={{ border: '1px solid var(--line-strong)', color: copied ? 'var(--ink)' : 'var(--accent)' }}
      >
        {copied ? '¡Copiado!' : 'Copiar'}
      </button>
    </div>
  )
}

interface Props {
  orderId: string
  nombre: string
  montoTransferir: number
  transfer: TransferInfo | null
  onEdit: () => void
}

export default function PaymentInfo({ orderId, nombre, montoTransferir, transfer, onEdit }: Props) {
  const amount = `$${montoTransferir.toLocaleString('es-AR')}`
  const firstName = nombre.split(' ')[0]

  return (
    <section
      aria-labelledby="payment-title"
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 shrink-0">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 id="payment-title" className="text-lg" style={{ color: 'var(--ink)' }}>
          {firstName ? `¡Listo, ${firstName}! Recibimos tus datos` : '¡Listo! Recibimos tus datos'}
        </h2>
      </div>

      <p className="text-sm sm:text-base mb-4" style={{ color: 'var(--ink-soft)' }}>
        Para confirmar tu pedido, transferí <strong style={{ color: 'var(--ink)' }}>{amount}</strong> y envianos el
        comprobante por WhatsApp.
      </p>

      {transfer ? (
        <div className="mb-5">
          {transfer.alias && <CopyRow label="Alias" value={transfer.alias} />}
          {transfer.cbu && <CopyRow label="CBU / CVU" value={transfer.cbu} />}
          <CopyRow label="Monto" value={String(montoTransferir)} />
          {(transfer.titular || transfer.banco) && (
            <p className="text-sm pt-2.5" style={{ color: 'var(--ink-soft)' }}>
              {[transfer.titular && `Titular: ${transfer.titular}`, transfer.banco].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm mb-5" style={{ color: 'var(--ink-soft)' }}>
          Escribinos por WhatsApp y te pasamos los datos para transferir.
        </p>
      )}

      <ContactWhatsApp
        label="Enviar comprobante a"
        message={`Hola! Te envío el comprobante de transferencia del pedido ${orderId}.`}
      />

      <button
        type="button"
        onClick={onEdit}
        className="block mx-auto mt-5 text-sm underline underline-offset-4"
        style={{ color: 'var(--ink-soft)' }}
      >
        Corregir mis datos
      </button>
    </section>
  )
}
