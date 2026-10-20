import type { Order, OrderItem } from '@/app/lib/orderSchema'

function price(value: number): string {
  return `$${value.toLocaleString('es-AR')}`
}

function meters(value: number): string {
  return value.toLocaleString('es-AR', { maximumFractionDigits: 2 })
}

function sizeLabel(item: OrderItem): string {
  return item.ancho && item.alto ? `${meters(item.ancho)} × ${meters(item.alto)} m` : ''
}

/**
 * Detalle de solo lectura de lo que cargó Innova. A propósito no muestra precios por producto: al
 * cliente sólo le llega el total (el precio de diseño y los unitarios son internos).
 */
export default function OrderSummary({ order }: { order: Order }) {
  const hasDeposit = order.sena > 0 && order.sena < order.total

  return (
    <section
      aria-labelledby="order-summary-title"
      className="rounded-2xl p-5 sm:p-6 mb-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      <h2 id="order-summary-title" className="text-lg mb-4" style={{ color: 'var(--ink)' }}>
        Datos del pedido
      </h2>

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

      <dl className="mt-3 pt-3 space-y-1 text-sm" style={{ borderTop: '1px solid var(--line-strong)' }}>
        <div className="flex justify-between text-base font-semibold" style={{ color: 'var(--ink)' }}>
          <dt>Total</dt>
          <dd>{price(order.total)}</dd>
        </div>
        {hasDeposit && (
          <>
            <div className="flex justify-between" style={{ color: 'var(--ink-soft)' }}>
              <dt>Seña a transferir</dt>
              <dd>{price(order.sena)}</dd>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--ink-soft)' }}>
              <dt>Resta</dt>
              <dd>{price(order.resta)}</dd>
            </div>
          </>
        )}
        {order.fecha && (
          <div className="flex justify-between" style={{ color: 'var(--ink-soft)' }}>
            <dt>Fecha</dt>
            <dd>{order.fecha}</dd>
          </div>
        )}
        {order.semanaEntrega && (
          <div className="flex justify-between" style={{ color: 'var(--ink-soft)' }}>
            <dt>Entrega estimada</dt>
            <dd>{order.semanaEntrega}</dd>
          </div>
        )}
        {order.cliente.logistica && !order.prefilled && (
          <div className="flex justify-between" style={{ color: 'var(--ink-soft)' }}>
            <dt>Entrega</dt>
            <dd>{order.cliente.logistica}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
