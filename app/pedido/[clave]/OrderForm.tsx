'use client'

import { startTransition, useActionState, useEffect, useState, type CSSProperties, type InputHTMLAttributes } from 'react'
import { useRouter } from 'next/navigation'
import {
  DELIVERY_MODES,
  PROVINCIAS,
  SHIPPING_COMPANIES,
  type CustomerData,
} from '@/app/lib/orderSchema'
import type { CustomerField } from '@/app/lib/orderValidation'
import { trackOrderDataSubmitted } from '@/app/utils/tracking'
import type { SubmitOrderState } from './actions'

const inputClass =
  'w-full px-4 py-3 rounded-xl text-base disabled:opacity-60 focus:outline-none focus:ring-2'
const inputStyle = {
  border: '1px solid var(--line)',
  background: 'var(--surface)',
  color: 'var(--ink)',
  '--tw-ring-color': 'color-mix(in oklab, var(--accent) 30%, transparent)',
} as CSSProperties

interface Props {
  action: (prev: SubmitOrderState, formData: FormData) => Promise<SubmitOrderState>
  requiereEnvio: boolean
  defaults: CustomerData
  montoTransferir: number
  numItems: number
  onSaved: () => void
}

export default function OrderForm({ action, requiereEnvio, defaults, montoTransferir, numItems, onSaved }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action, { status: 'idle' })
  // Inputs controlados y envío por onSubmit (no `<form action>`): React 19 resetea el formulario
  // al terminar una action pasada por `action`, y un error de validación del servidor dejaba al
  // cliente sin la provincia elegida.
  const [values, setValues] = useState<CustomerData>(defaults)

  useEffect(() => {
    if (state.status !== 'success') return
    trackOrderDataSubmitted(montoTransferir, numItems)
    onSaved()
    // Vuelve a leer la planilla para que el resto de la página refleje el nuevo estado.
    router.refresh()
  }, [state, montoTransferir, numItems, onSaved, router])

  const errors = state.status === 'error' ? state.errors ?? {} : {}

  const set = (name: CustomerField) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [name]: e.target.value }))

  // Funciones que devuelven JSX, no componentes: un componente definido dentro del render se
  // remontaría en cada tecla y el input perdería el foco.
  const field = ({
    name,
    label,
    optional,
    ...rest
  }: { name: CustomerField; label: string; optional?: boolean } & InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>
        {label} {optional && <span className="font-normal" style={{ color: 'var(--ink-faint)' }}>(opcional)</span>}
      </label>
      <input
        id={name}
        name={name}
        value={values[name]}
        onChange={set(name)}
        required={!optional}
        disabled={pending}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className={inputClass}
        style={errors[name] ? { ...inputStyle, borderColor: '#dc2626' } : inputStyle}
        {...rest}
      />
      {errors[name] && (
        <p id={`${name}-error`} className="text-sm mt-1 text-red-600">{errors[name]}</p>
      )}
    </div>
  )

  const select = ({ name, label, options }: { name: CustomerField; label: string; options: readonly string[] }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>{label}</label>
      <select
        id={name}
        name={name}
        value={values[name]}
        onChange={set(name)}
        required
        disabled={pending}
        aria-invalid={Boolean(errors[name])}
        className={inputClass}
        style={errors[name] ? { ...inputStyle, borderColor: '#dc2626' } : inputStyle}
      >
        <option value="" disabled>Elegí una opción</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[name] && <p className="text-sm mt-1 text-red-600">{errors[name]}</p>}
    </div>
  )

  const choice = ({ name, label, options }: { name: CustomerField; label: string; options: readonly string[] }) => (
    <fieldset>
      <legend className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = values[name] === o
          return (
            <label
              key={o}
              className="cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{
                border: `1px solid ${checked ? 'var(--accent)' : 'var(--line)'}`,
                background: checked ? 'color-mix(in oklab, var(--accent) 10%, var(--surface))' : 'var(--surface)',
                color: checked ? 'var(--accent-dark)' : 'var(--ink)',
              }}
            >
              <input
                type="radio"
                name={name}
                value={o}
                checked={checked}
                onChange={set(name)}
                required
                disabled={pending}
                className="sr-only"
              />
              {o}
            </label>
          )
        })}
      </div>
      {errors[name] && <p className="text-sm mt-1 text-red-600">{errors[name]}</p>}
    </fieldset>
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        startTransition(() => formAction(formData))
      }}
      className="rounded-2xl p-5 sm:p-6 space-y-8"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      <section className="space-y-4">
        <h2 className="text-lg" style={{ color: 'var(--ink)' }}>Datos personales</h2>
        {field({ name: 'nombre', label: 'Nombre y apellido', autoComplete: 'name', maxLength: 100 })}
        <div className="grid sm:grid-cols-2 gap-4">
          {field({ name: 'dni', label: 'DNI', inputMode: 'numeric', autoComplete: 'off', maxLength: 11, placeholder: 'Sin puntos' })}
          {field({ name: 'telefono', label: 'Teléfono', type: 'tel', inputMode: 'tel', autoComplete: 'tel', maxLength: 30, placeholder: '11 1234 5678' })}
        </div>
        {field({ name: 'mail', label: 'Mail', type: 'email', inputMode: 'email', autoComplete: 'email', maxLength: 254 })}
      </section>

      {requiereEnvio && (
        <section className="space-y-4">
          <h2 className="text-lg" style={{ color: 'var(--ink)' }}>📦 Información para el envío</h2>
          {choice({ name: 'empresaEnvio', label: 'Empresa de envío', options: SHIPPING_COMPANIES })}
          {choice({ name: 'modalidad', label: '¿Dónde lo recibís?', options: DELIVERY_MODES })}
          <div className="grid sm:grid-cols-[1fr_8rem] gap-4">
            {field({ name: 'calle', label: 'Calle y número', autoComplete: 'address-line1', maxLength: 120 })}
            {field({ name: 'dpto', label: 'Dpto / Piso', optional: true, autoComplete: 'address-line2', maxLength: 30 })}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field({ name: 'ciudad', label: 'Ciudad / Localidad', autoComplete: 'address-level2', maxLength: 80 })}
            {field({ name: 'codigoPostal', label: 'Código postal', autoComplete: 'postal-code', maxLength: 8, placeholder: '1425' })}
          </div>
          {select({ name: 'provincia', label: 'Provincia', options: PROVINCIAS })}
          {values.modalidad === 'Sucursal' && (
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              Con tu dirección buscamos la sucursal de {values.empresaEnvio || 'la empresa'} más cercana.
            </p>
          )}
        </section>
      )}

      <div>
        {state.status === 'error' && (
          <p role="alert" className="text-sm mb-3 text-red-600">{state.message}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'var(--accent)' }}
        >
          {pending ? 'Guardando…' : 'Confirmar mis datos'}
        </button>
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--ink-faint)' }}>
          Usamos estos datos sólo para tu pedido y el envío.
        </p>
      </div>
    </form>
  )
}
