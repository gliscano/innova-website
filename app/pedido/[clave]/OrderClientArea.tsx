'use client'

import { useState } from 'react'
import { ORDER_STATUS, type CustomerData } from '@/app/lib/orderSchema'
import type { TransferInfo } from '@/app/lib/transferInfo'
import type { SubmitOrderState } from './actions'
import OrderForm from './OrderForm'
import PaymentInfo from './PaymentInfo'

interface Props {
  action: (prev: SubmitOrderState, formData: FormData) => Promise<SubmitOrderState>
  orderId: string
  estado: string
  requiereEnvio: boolean
  cliente: CustomerData
  montoTransferir: number
  numItems: number
  transfer: TransferInfo | null
}

/**
 * Alterna entre el formulario y los datos de transferencia. Un pedido "Esperando pago" ya tiene
 * los datos del cliente: arranca mostrando cómo pagar, con la opción de corregir.
 */
export default function OrderClientArea({ estado, cliente, ...props }: Props) {
  const [editing, setEditing] = useState(estado === ORDER_STATUS.esperandoDatos)

  if (editing) {
    return (
      <OrderForm
        action={props.action}
        requiereEnvio={props.requiereEnvio}
        defaults={cliente}
        montoTransferir={props.montoTransferir}
        numItems={props.numItems}
        onSaved={() => setEditing(false)}
      />
    )
  }

  return (
    <PaymentInfo
      orderId={props.orderId}
      nombre={cliente.nombre}
      montoTransferir={props.montoTransferir}
      transfer={props.transfer}
      onEdit={() => setEditing(true)}
    />
  )
}
