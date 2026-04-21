'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function LeadCaptureSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-14 px-4 bg-gradient-to-br from-[var(--rose-gold)] to-[var(--yellow-gold)] bg-opacity-10">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
          Comunidad Innova
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Recibí novedades y diseños exclusivos
        </h2>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          Suscribite y enterate primero de colecciones nuevas, promociones y tips para fotógrafos y decoradores.
        </p>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-green-800 text-lg">¡Ya estás suscripto!</p>
            <p className="text-green-700 text-sm mt-1">Te vamos a avisar cuando haya novedades.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                disabled={status === 'submitting'}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent disabled:opacity-60 text-sm"
              />
              <input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
                disabled={status === 'submitting'}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent disabled:opacity-60 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="gradient-orange-colors text-black font-semibold px-6 py-3 rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {status === 'submitting' ? 'Enviando...' : 'Suscribirme gratis'}
            </button>

            {status === 'error' && (
              <p className="text-white text-sm">
                Hubo un problema al suscribirte. Intentá de nuevo o escribinos por WhatsApp.
              </p>
            )}

            <p className="text-xs text-gray-400 mt-1">
              Sin spam. Podés darte de baja cuando quieras.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
