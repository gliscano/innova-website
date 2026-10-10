import type { Order } from '@/app/lib/orderSchema'

function price(value: number): string {
  return `$${value.toLocaleString('es-AR')}`
}

/** Detalle de solo lectura de lo que cargó Innova: productos, total y entrega. */
export default function OrderSummary({ order }: { order: Order }) {
  const hasDeposit = order.montoTransferir > 0 && order.montoTransferir < order.total

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
          <li key={i} className="py-3 flex gap-4 justify-between" style={{ borderColor: 'var(--line)' }}>
            <div className="min-w-0">
              <p className="font-semibold" style={{ color: 'var(--ink)' }}>
                {item.cantidad > 1 && <span>{item.cantidad} × </span>}
                {item.modelo || item.producto || 'Producto'}
              </p>
              <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                {[item.modelo && item.producto, item.medidas].filter(Boolean).join(' · ')}
              </p>
              {item.piso && (
                <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Diseño de piso: {item.piso}</p>
              )}
            </div>
            <p className="font-semibold whitespace-nowrap" style={{ color: 'var(--ink)' }}>{price(item.subtotal)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-3 pt-3 space-y-1 text-sm" style={{ borderTop: '1px solid var(--line-strong)' }}>
        <div className="flex justify-between text-base font-semibold" style={{ color: 'var(--ink)' }}>
          <dt>Total</dt>
          <dd>{price(order.total)}</dd>
        </div>
        {hasDeposit && (
          <div className="flex justify-between" style={{ color: 'var(--ink-soft)' }}>
            <dt>Seña a transferir</dt>
            <dd>{price(order.montoTransferir)}</dd>
          </div>
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
        <div className="flex justify-between" style={{ color: 'var(--ink-soft)' }}>
          <dt>Entrega</dt>
          <dd>{order.requiereEnvio ? 'Envío por encomienda' : 'Retiro / entrega a coordinar'}</dd>
        </div>
      </dl>
    </section>
  )
}
