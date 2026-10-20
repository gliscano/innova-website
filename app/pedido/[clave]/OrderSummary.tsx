import { CalendarDays, Store, Truck } from 'lucide-react'
import { EDITABLE_STATUSES, PICKUP, type Order, type OrderItem } from '@/app/lib/orderSchema'

function price(value: number): string {
  return `$${value.toLocaleString('es-AR')}`
}

function meters(value: number): string {
  return value.toLocaleString('es-AR', { maximumFractionDigits: 2 })
}

function sizeLabel(item: OrderItem): string {
  return item.ancho && item.alto ? `${meters(item.ancho)} × ${meters(item.alto)} m` : ''
}

/** "16/10/2026" → "16 de octubre". Si la planilla trae otro formato, se muestra tal cual. */
function longDate(value: string): string {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim())
  if (!match) return value
  const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function SectionLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--ink-soft)' }}>
      {children}
    </h3>
  )
}

/**
 * Detalle de solo lectura de lo que cargó Innova. A propósito no muestra precios por producto: al
 * cliente sólo le llega el total (el precio de diseño y los unitarios son internos).
 *
 * Tres bloques (productos, pago, entrega) y un dato protagonista por bloque. Mientras espera el pago,
 * lo que el cliente tiene que hacer es transferir, así que se destaca ese monto y no el total; una
 * vez que Innova carga lo cobrado, se muestra lo recibido y lo que resta.
 */
export default function OrderSummary({ order }: { order: Order }) {
  const awaitingPayment = EDITABLE_STATUSES.includes(order.estado)
  const hasDeposit = order.sena > 0 && order.sena < order.total
  const toTransfer = Math.max(0, order.sena - order.cobrado)
  const logistica = !order.prefilled ? order.cliente.logistica : ''
  const pickup = logistica === PICKUP
  const showDelivery = Boolean(order.semanaEntrega || logistica)

  return (
    <section
      aria-labelledby="order-summary-title"
      className="rounded-2xl p-5 sm:p-6 mb-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      <div className="mb-4">
        <h2 id="order-summary-title" className="text-lg" style={{ color: 'var(--ink)' }}>
          Datos del pedido
        </h2>
        {order.fecha && (
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Pedido del {longDate(order.fecha)}</p>
        )}
      </div>

      <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
        {order.items.map((item, i) => (
          <li key={i} className="py-3" style={{ borderColor: 'var(--line)' }}>
            <p className="font-semibold" style={{ color: 'var(--ink)' }}>
              {item.cantidad > 1 && <span>{item.cantidad} × </span>}
              {item.modelo || item.producto || 'Producto'}
            </p>
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              {[item.modelo && item.producto, sizeLabel(item)].filter(Boolean).join(' · ')}
            </p>
            {item.incluyePiso && (
              <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                Con piso
                {item.largoPared > 0 && item.largoPiso > 0 &&
                  `: pared ${meters(item.largoPared)} m + piso ${meters(item.largoPiso)} m`}
                {item.pisoDiseno && ` · Diseño de piso: ${item.pisoDiseno}`}
              </p>
            )}
          </li>
        ))}
      </ul>

      <section aria-labelledby="order-payment-title" className="mt-3 pt-5" style={{ borderTop: '1px solid var(--line-strong)' }}>
        <SectionLabel id="order-payment-title">Pago</SectionLabel>
        <dl className="tabular-nums">
          <div className="flex justify-between items-baseline font-semibold" style={{ color: 'var(--ink)' }}>
            <dt>Total</dt>
            <dd>{price(order.total)}</dd>
          </div>
        </dl>
        {awaitingPayment ? (
          <dl
            className="tabular-nums mt-3 rounded-xl px-4 py-3"
            style={{
              background: 'color-mix(in oklab, var(--accent) 8%, var(--surface))',
              border: '1px solid color-mix(in oklab, var(--accent) 25%, var(--surface))',
            }}
          >
            <div className="flex justify-between items-baseline gap-4">
              <dt className="text-sm font-medium" style={{ color: 'var(--accent-dark)' }}>
                {order.cobrado > 0 ? 'Falta transferir' : hasDeposit ? 'Seña a transferir' : 'A transferir'}
              </dt>
              <dd className="text-xl font-semibold" style={{ color: 'var(--accent-dark)' }}>{price(toTransfer)}</dd>
            </div>
            {order.cobrado > 0 && (
              <Row label="Ya recibimos" value={price(order.cobrado)} />
            )}
            {hasDeposit && (
              <Row label="Resta abonar" value={price(order.total - order.sena)} />
            )}
          </dl>
        ) : order.cobrado > 0 && (
          <dl
            className="tabular-nums mt-3 rounded-xl px-4 py-3"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}
          >
            <div className="flex justify-between items-baseline gap-4" style={{ color: 'var(--ink)' }}>
              <dt className="text-sm font-medium">Recibimos</dt>
              <dd className="text-xl font-semibold">{price(order.cobrado)}</dd>
            </div>
            {order.resta > 0 ? (
              <Row label="Resta abonar" value={price(order.resta)} />
            ) : (
              <Row label="Pago completo" value="✓" />
            )}
          </dl>
        )}
      </section>

      {showDelivery && (
        <section aria-labelledby="order-delivery-title" className="mt-5 pt-5" style={{ borderTop: '1px solid var(--line)' }}>
          <SectionLabel id="order-delivery-title">Entrega</SectionLabel>
          <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink)' }}>
            {order.semanaEntrega && (
              <li className="flex items-center gap-3">
                <CalendarDays aria-hidden className="size-4 shrink-0" style={{ color: 'var(--ink-soft)' }} />
                <span>Estimada para la semana del {longDate(order.semanaEntrega)}</span>
              </li>
            )}
            {logistica && (
              <li className="flex items-center gap-3">
                {pickup ? (
                  <Store aria-hidden className="size-4 shrink-0" style={{ color: 'var(--ink-soft)' }} />
                ) : (
                  <Truck aria-hidden className="size-4 shrink-0" style={{ color: 'var(--ink-soft)' }} />
                )}
                <span>{pickup ? 'Retiro en tienda' : `Envío por ${logistica}`}</span>
              </li>
            )}
          </ul>
        </section>
      )}
    </section>
  )
}
