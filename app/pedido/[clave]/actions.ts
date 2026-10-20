'use server'

import { findOrderByKey, saveCustomerData } from '@/app/lib/orders'
import { EDITABLE_STATUSES } from '@/app/lib/orderSchema'
import { parseCustomerData, type FieldErrors } from '@/app/lib/orderValidation'

export type SubmitOrderState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; errors?: FieldErrors }

const UNAVAILABLE = 'No pudimos guardar tus datos. Probá de nuevo en unos minutos.'

export async function submitOrder(
  clave: string,
  _prev: SubmitOrderState,
  formData: FormData,
): Promise<SubmitOrderState> {
  // Se vuelve a leer el pedido: el estado pudo cambiar en la planilla desde que el cliente abrió
  // la página, y hace falta saber en qué fila está hoy.
  const lookup = await findOrderByKey(clave)
  if (lookup.status === 'unavailable') return { status: 'error', message: UNAVAILABLE }
  if (lookup.status === 'not-found') {
    return { status: 'error', message: 'No encontramos este pedido. Escribinos por WhatsApp.' }
  }

  if (!EDITABLE_STATUSES.includes(lookup.order.estado)) {
    // Ya pagado, en producción o cancelado: no se pisan los datos. Al refrescar, la página muestra
    // el estado real.
    return { status: 'success' }
  }

  // Con datos precargados el DNI y el mail no llegan al navegador: vacíos = se mantienen los guardados.
  if (lookup.order.prefilled) {
    for (const name of ['dni', 'mail'] as const) {
      if (!String(formData.get(name) ?? '').trim()) formData.set(name, lookup.order.cliente[name])
    }
  }

  const { data, errors } = parseCustomerData(formData)
  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Revisá los campos marcados.', errors }
  }

  const saved = await saveCustomerData(lookup.context, data)
  return saved ? { status: 'success' } : { status: 'error', message: UNAVAILABLE }
}
