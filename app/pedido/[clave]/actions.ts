'use server'

import { findOrderByKey, saveCustomerData } from '@/app/lib/orders'
import { EDITABLE_STATUSES } from '@/app/lib/orderSchema'
import { parseCustomerData, type FieldErrors } from '@/app/lib/orderValidation'

export type SubmitOrderState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; errors?: FieldErrors }

export async function submitOrder(
  clave: string,
  _prev: SubmitOrderState,
  formData: FormData,
): Promise<SubmitOrderState> {
  // Se vuelve a leer el pedido: el estado o el "requiere envío" pudo cambiar en la planilla
  // desde que el cliente abrió la página.
  const lookup = await findOrderByKey(clave)
  if (lookup.status === 'unavailable') {
    return { status: 'error', message: 'No pudimos guardar tus datos. Probá de nuevo en unos minutos.' }
  }
  if (lookup.status === 'not-found') {
    return { status: 'error', message: 'No encontramos este pedido. Escribinos por WhatsApp.' }
  }

  const { order } = lookup
  if (!EDITABLE_STATUSES.includes(order.estado)) {
    // Ya pagado, en producción o cancelado: no se pisan los datos. Al refrescar, la página
    // muestra el estado real.
    return { status: 'success' }
  }

  const { data, errors } = parseCustomerData(formData, order.requiereEnvio)
  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Revisá los campos marcados.', errors }
  }

  const saved = await saveCustomerData(order, data)
  if (!saved) {
    return { status: 'error', message: 'No pudimos guardar tus datos. Probá de nuevo en unos minutos.' }
  }
  return { status: 'success' }
}
