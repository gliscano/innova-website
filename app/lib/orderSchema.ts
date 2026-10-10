/**
 * Forma de la planilla de pedidos. Es el contrato entre el sitio (que lee el pedido y completa los
 * datos del cliente) y `apps-script/Pedidos.gs` (que crea el pedido desde la planilla).
 *
 * Si se agrega, quita o reordena una columna, hay que cambiarla en los dos lados: el script tiene
 * su propia copia de estos encabezados en `COLUMNAS_PEDIDOS` / `COLUMNAS_ITEMS`.
 */

export const PEDIDOS_SHEET = 'Pedidos'
export const ITEMS_SHEET = 'Items'

/** Columnas de la pestaña Pedidos, en orden (A, B, C…). Una fila por compra. */
export const PEDIDOS_COLUMNS = [
  'ID',
  'Clave',
  'Estado',
  'Fecha',
  'Semana de entrega',
  'Cant. productos',
  'Total',
  'Monto a transferir',
  'Requiere envío',
  'Tel. WhatsApp',
  'Nombre',
  'DNI',
  'Mail',
  'Teléfono',
  'Empresa de envío',
  'Calle y número',
  'Dpto',
  'Ciudad',
  'Provincia',
  'Código postal',
  'Sucursal/Domicilio',
  'Link generado',
  'Datos completados',
  'Link',
] as const

/** Columnas de la pestaña Items, en orden. Una fila por producto de un pedido. */
export const ITEMS_COLUMNS = [
  'ID pedido',
  'Producto',
  'Modelo',
  'Medidas',
  'Precio unitario',
  'Cantidad',
  'Subtotal',
  'Diseño de piso',
] as const

type PedidosColumn = (typeof PEDIDOS_COLUMNS)[number]

/** Índice (base 0) de una columna de Pedidos. */
export function pedidosIndex(column: PedidosColumn): number {
  return PEDIDOS_COLUMNS.indexOf(column)
}

/** Letra A1 de una columna de Pedidos (sólo hasta Z: alcanza para las 24 que hay). */
export function pedidosLetter(column: PedidosColumn): string {
  return String.fromCharCode(65 + pedidosIndex(column))
}

/**
 * Estados del pedido. Los dos primeros los escribe el sistema (el script y el sitio); el resto los
 * cambia Innova a mano desde el desplegable de la planilla.
 */
export const ORDER_STATUS = {
  esperandoDatos: 'Esperando datos',
  esperandoPago: 'Esperando pago',
  pagado: 'Pagado',
  enProduccion: 'En producción',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

/** Estados en los que el cliente todavía puede cargar o corregir sus datos. */
export const EDITABLE_STATUSES: readonly string[] = [ORDER_STATUS.esperandoDatos, ORDER_STATUS.esperandoPago]

export const SHIPPING_COMPANIES = ['Andreani', 'Viacargo', 'Correo Argentino'] as const
export const DELIVERY_MODES = ['Sucursal', 'Domicilio'] as const

export const PROVINCIAS = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const

export interface OrderItem {
  /** Tipo de producto de la lista de precios, ej. "Fondo 2.90m Color Vivo HD". */
  producto: string
  /** Diseño elegido del catálogo. */
  modelo: string
  medidas: string
  precioUnitario: number
  cantidad: number
  subtotal: number
  piso: string
}

/** Datos que completa el cliente en `/pedido/[clave]`. */
export interface CustomerData {
  nombre: string
  dni: string
  mail: string
  telefono: string
  empresaEnvio: string
  calle: string
  dpto: string
  ciudad: string
  provincia: string
  codigoPostal: string
  modalidad: string
}

export interface Order {
  /** Fila (base 1) en la pestaña Pedidos, para poder actualizarla. */
  row: number
  id: string
  estado: string
  fecha: string
  semanaEntrega: string
  total: number
  montoTransferir: number
  requiereEnvio: boolean
  items: OrderItem[]
  cliente: CustomerData
}
