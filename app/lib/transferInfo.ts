/** Datos bancarios que ve el cliente después de completar el pedido. Se configuran en Vercel. */
export interface TransferInfo {
  titular: string
  banco: string
  cbu: string
  alias: string
}

export function getTransferInfo(): TransferInfo | null {
  const titular = process.env.TRANSFER_TITULAR ?? ''
  const banco = process.env.TRANSFER_BANCO ?? ''
  const cbu = process.env.TRANSFER_CBU ?? ''
  const alias = process.env.TRANSFER_ALIAS ?? ''
  // Sin CBU ni alias no hay a dónde transferir: la página pide que escriban por WhatsApp.
  if (!cbu && !alias) return null
  return { titular, banco, cbu, alias }
}
