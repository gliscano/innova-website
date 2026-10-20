import type { Metadata } from 'next'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { findOrderByKey } from '@/app/lib/orders'
import { EDITABLE_STATUSES, ORDER_STATUS, type Order } from '@/app/lib/orderSchema'
import { getTransferInfo } from '@/app/lib/transferInfo'
import { submitOrder } from './actions'
import OrderSummary from './OrderSummary'
import OrderClientArea from './OrderClientArea'
import ContactWhatsApp from './ContactWhatsApp'

// Página privada de cada cliente: que no la indexe nadie, aunque el link se comparta.
export const metadata: Metadata = {
  title: 'Tu pedido',
  robots: { index: false, follow: false },
  // La URL lleva la clave del pedido: que no viaje como referrer a ninguna página, ni del sitio.
  referrer: 'no-referrer',
}

/**
 * Datos que llegan al navegador. Si vienen precargados de una compra anterior, el DNI y el mail no
 * salen del servidor: si la vendedora cargó mal el teléfono, el link es de otra persona y no tiene
 * que ver esos datos. Se muestra sólo cómo terminan, y si el cliente los deja vacíos el servidor usa
 * los guardados (ver `submitOrder`).
 */
function clientView(order: Order) {
  if (!order.prefilled) return { cliente: order.cliente, saved: undefined }
  const { dni, mail } = order.cliente
  const [user, domain] = mail.split('@')
  return {
    cliente: { ...order.cliente, dni: '', mail: '' },
    saved: {
      dni: dni ? `•••${dni.slice(-3)}` : '',
      mail: user && domain ? `${user[0]}•••@${domain}` : '',
    },
  }
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
      <h1 className="text-2xl mb-3" style={{ color: 'var(--ink)' }}>{title}</h1>
      <div className="text-sm sm:text-base" style={{ color: 'var(--ink-soft)' }}>{children}</div>
    </div>
  )
}

export default async function PedidoPage({ params }: { params: Promise<{ clave: string }> }) {
  const { clave } = await params
  const lookup = await findOrderByKey(clave)

  let content: React.ReactNode
  if (lookup.status === 'unavailable') {
    content = (
      <Notice title="No pudimos cargar tu pedido">
        <p className="mb-5">Estamos teniendo un problema temporal. Probá de nuevo en unos minutos o escribinos.</p>
        <ContactWhatsApp message="Hola! No puedo abrir el link de mi pedido" />
      </Notice>
    )
  } else if (lookup.status === 'not-found' || lookup.order.estado === ORDER_STATUS.cancelado) {
    content = (
      <Notice title="Este link no está activo">
        <p className="mb-5">Puede que esté incompleto o que el pedido ya no esté vigente. Escribinos y lo revisamos.</p>
        <ContactWhatsApp
          vendedora={lookup.status === 'found' ? lookup.order.vendedora : undefined}
          message="Hola! El link de mi pedido no funciona"
        />
      </Notice>
    )
  } else {
    const { order } = lookup
    const editable = EDITABLE_STATUSES.includes(order.estado)
    const { cliente, saved } = clientView(order)
    content = (
      <>
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--ink-soft)' }}>
            Pedido {order.id}
          </p>
          <h1 className="text-2xl sm:text-3xl" style={{ color: 'var(--ink)' }}>
            {editable ? '¡Gracias por elegirnos!' : '¡Tu pedido está confirmado!'}
          </h1>
          {editable && order.estado === ORDER_STATUS.esperandoDatos && (
            <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--ink-soft)' }}>
              Revisá el detalle y completá tus datos para que podamos avanzar con tu pedido.
            </p>
          )}
        </div>

        <OrderSummary order={order} />

        {editable ? (
          <OrderClientArea
            action={submitOrder.bind(null, clave)}
            orderId={order.id}
            estado={order.estado}
            cliente={cliente}
            saved={saved}
            prefilled={order.prefilled}
            sena={Math.max(0, order.sena - order.cobrado)}
            total={order.total}
            vendedora={order.vendedora}
            numItems={order.items.reduce((n, item) => n + item.cantidad, 0)}
            transfer={getTransferInfo()}
          />
        ) : (
          <Notice title={`Estado: ${order.estado}`}>
            <p className="mb-5">
              {order.estado === ORDER_STATUS.senaRecibida ? 'Ya recibimos tu seña' : 'Ya recibimos tu pago'}. Cualquier
              consulta sobre tu pedido, escribinos.
            </p>
            <ContactWhatsApp vendedora={order.vendedora} message={`Hola! Consulto por mi pedido ${order.id}`} />
          </Notice>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-2)' }}>
      <Header />
      <main className="flex-grow w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">{content}</main>
      <Footer />
    </div>
  )
}
