/**
 * Forma de la planilla de pedidos. Es el contrato entre el sitio (que lee el pedido y completa los
 * datos del cliente) y `apps-script/Pedidos.gs` (que crea el pedido desde la planilla).
 *
 * Las columnas se buscan por el **nombre del encabezado** (fila 1), no por su posición: se pueden
 * reordenar o agregar columnas a mano en la planilla sin tocar código. El orden de estas listas es
 * sólo el que usa `configurarPlanilla` al crear las pestañas. Lo que sí tiene que coincidir con el
 * script (`COLUMNAS_*` en `Pedidos.gs`) son los nombres.
 */

export const PEDIDOS_SHEET = 'Pedidos'
export const ITEMS_SHEET = 'Items'
export const CLIENTES_SHEET = 'Clientes'
export const ENVIOS_SHEET = 'Envíos'

/** Una fila por compra. */
export const PEDIDOS_COLUMNS = [
  'ID',
  'Estado',
  'Nombre',
  'Teléfono',
  'ID cliente',
  'Total',
  'Seña',
  'Cobrado',
  'Resta',
  'Vendedora',
  'Fecha',
  'Semana de entrega',
  'Cant. productos',
  'Requiere envío',
  'Logística',
  'DNI',
  'Mail',
  'Calle y número',
  'Dpto',
  'Ciudad',
  'Provincia',
  'Código postal',
  'Sucursal/Domicilio',
  'Link',
  'Link generado',
  'Datos completados',
  'Clave',
] as const

/** Una fila por producto de un pedido. */
export const ITEMS_COLUMNS = [
  'ID pedido',
  'Producto',
  'Modelo',
  'Ancho',
  'Alto',
  'Incluye piso',
  'Largo pared',
  'Largo piso',
  'Diseño de piso',
  'Precio unitario',
  'Precio diseño',
  'Cantidad',
  'Subtotal',
] as const

/**
 * Una fila por cliente, identificado por su `ID cliente` (un UUID). El teléfono es un dato más: con
 * él la vendedora encuentra al cliente al cargar un pedido, pero el sitio nunca actualiza un
 * cliente por el teléfono que se escribe en el formulario, sino por el ID que trae el pedido.
 */
export const CLIENTES_COLUMNS = [
  'ID cliente',
  'Teléfono',
  'Nombre',
  'DNI',
  'Mail',
  'Primera compra',
  'Última compra',
  'Cant. pedidos',
] as const

/** Una fila por dirección distinta de cada cliente (sólo Correo Argentino / Viacargo piden dirección). */
export const ENVIOS_COLUMNS = [
  'ID cliente',
  'Teléfono',
  'Logística',
  'Sucursal/Domicilio',
  'Calle y número',
  'Dpto',
  'Ciudad',
  'Provincia',
  'Código postal',
  'Última vez usada',
] as const

export type PedidosColumn = (typeof PEDIDOS_COLUMNS)[number]
export type ItemsColumn = (typeof ITEMS_COLUMNS)[number]
export type ClientesColumn = (typeof CLIENTES_COLUMNS)[number]
export type EnviosColumn = (typeof ENVIOS_COLUMNS)[number]

/**
 * Estados del pedido. Los dos primeros los escribe el sistema (el script y el sitio). "Seña
 * recibida" y "Pagado" los pone el script al cargar la columna Cobrado; el resto los cambia Innova a
 * mano desde el desplegable de la planilla.
 */
export const ORDER_STATUS = {
  esperandoDatos: 'Esperando datos',
  esperandoPago: 'Esperando pago',
  senaRecibida: 'Seña recibida',
  pagado: 'Pagado',
  enProduccion: 'En producción',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

/** Estados en los que el cliente todavía puede cargar o corregir sus datos. */
export const EDITABLE_STATUSES: readonly string[] = [ORDER_STATUS.esperandoDatos, ORDER_STATUS.esperandoPago]

/** Formas de entrega que elige el cliente. */
export const LOGISTICS = ['Andreani', 'Correo Argentino', 'Viacargo', 'Retiro en tienda'] as const
export const PICKUP = 'Retiro en tienda'
/** Logísticas para las que el cliente completa la dirección de envío en el formulario. */
export const ADDRESS_LOGISTICS: readonly string[] = ['Correo Argentino', 'Viacargo']
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

/**
 * Lo que ve el cliente de cada producto. Sin precios a propósito: al cliente sólo se le muestra el
 * total del pedido (el precio de diseño y los precios unitarios son internos).
 */
export interface OrderItem {
  /** Tipo de producto de la lista de precios, ej. "Fondo 2.90m Color Vivo HD". */
  producto: string
  /** Diseño elegido del catálogo. */
  modelo: string
  ancho: number
  alto: number
  cantidad: number
  incluyePiso: boolean
  largoPared: number
  largoPiso: number
  pisoDiseno: string
}

/** Datos que completa el cliente en `/pedido/[clave]`. */
export interface CustomerData {
  nombre: string
  dni: string
  mail: string
  telefono: string
  /** Una de `LOGISTICS`. */
  logistica: string
  calle: string
  dpto: string
  ciudad: string
  provincia: string
  codigoPostal: string
  modalidad: string
}

export interface Order {
  id: string
  estado: string
  fecha: string
  semanaEntrega: string
  total: number
  /** Lo que el cliente transfiere ahora. Igual al total si no se cobra seña. */
  sena: number
  /**
   * Lo que Innova confirmó que entró en la cuenta (columna Cobrado, la carga la vendedora al ver la
   * plata en el banco, no el comprobante). 0 mientras no se cobró nada.
   */
  cobrado: number
  /** Lo que falta pagar: total − cobrado una vez que hay un cobro; antes, total − seña. */
  resta: number
  vendedora: string
  items: OrderItem[]
  cliente: CustomerData
  /** Los datos del cliente vienen de una compra anterior (pestañas Clientes / Envíos), no de este pedido. */
  prefilled: boolean
}
