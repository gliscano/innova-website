import { batchGet, batchUpdate, isSheetsConfigured, type CellValue, type SheetRows } from './googleSheets'
import {
  ITEMS_COLUMNS,
  ITEMS_SHEET,
  ORDER_STATUS,
  PEDIDOS_COLUMNS,
  PEDIDOS_SHEET,
  pedidosIndex,
  pedidosLetter,
  type CustomerData,
  type Order,
  type OrderItem,
} from './orderSchema'

/**
 * Acceso a los pedidos de la planilla. El pedido lo crea Innova desde la planilla
 * (`apps-script/Pedidos.gs`); el sitio sólo lo lee por su clave y completa los datos del cliente.
 */

export type OrderLookup =
  | { status: 'found'; order: Order }
  | { status: 'not-found' }
  | { status: 'unavailable' }

/**
 * La clave la genera el script con `Utilities.getUuid()`: 16 caracteres hexadecimales. Validar el
 * formato antes de ir a Google evita gastar una lectura en URLs inventadas.
 */
const KEY_REGEX = /^[a-f0-9]{16}$/

const LAST_COLUMN = pedidosLetter(PEDIDOS_COLUMNS[PEDIDOS_COLUMNS.length - 1])

function text(value: CellValue | undefined): string {
  return value === undefined ? '' : String(value).trim()
}

function num(value: CellValue | undefined): number {
  if (typeof value === 'number') return value
  const parsed = Number(text(value).replace(/[^\d,-]/g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

function bool(value: CellValue | undefined): boolean {
  if (typeof value === 'boolean') return value
  return /^(s[ií]|true|x|1)$/i.test(text(value))
}

function parseOrder(row: CellValue[], rowNumber: number, itemRows: SheetRows): Order {
  const cell = (column: (typeof PEDIDOS_COLUMNS)[number]) => row[pedidosIndex(column)]
  const id = text(cell('ID'))

  const items: OrderItem[] = itemRows
    .filter((item) => text(item[0]) === id)
    .map((item) => {
      const cell = (column: (typeof ITEMS_COLUMNS)[number]) => item[ITEMS_COLUMNS.indexOf(column)]
      const precioUnitario = num(cell('Precio unitario'))
      const cantidad = num(cell('Cantidad')) || 1
      return {
        producto: text(cell('Producto')),
        modelo: text(cell('Modelo')),
        medidas: text(cell('Medidas')),
        precioUnitario,
        cantidad,
        subtotal: num(cell('Subtotal')) || precioUnitario * cantidad,
        piso: text(cell('Diseño de piso')),
      }
    })

  const total = num(cell('Total')) || items.reduce((sum, item) => sum + item.subtotal, 0)

  return {
    row: rowNumber,
    id,
    estado: text(cell('Estado')),
    fecha: text(cell('Fecha')),
    semanaEntrega: text(cell('Semana de entrega')),
    total,
    montoTransferir: num(cell('Monto a transferir')) || total,
    requiereEnvio: bool(cell('Requiere envío')),
    items,
    cliente: {
      nombre: text(cell('Nombre')),
      dni: text(cell('DNI')),
      mail: text(cell('Mail')),
      telefono: text(cell('Teléfono')),
      empresaEnvio: text(cell('Empresa de envío')),
      calle: text(cell('Calle y número')),
      dpto: text(cell('Dpto')),
      ciudad: text(cell('Ciudad')),
      provincia: text(cell('Provincia')),
      codigoPostal: text(cell('Código postal')),
      modalidad: text(cell('Sucursal/Domicilio')),
    },
  }
}

export async function findOrderByKey(key: string): Promise<OrderLookup> {
  if (!KEY_REGEX.test(key)) return { status: 'not-found' }
  if (isMockEnabled()) return mockFind(key)
  if (!isSheetsConfigured()) {
    console.error('[orders] Faltan las variables de Google Sheets')
    return { status: 'unavailable' }
  }

  try {
    const [pedidos, items] = await batchGet([
      `${PEDIDOS_SHEET}!A2:${LAST_COLUMN}`,
      `${ITEMS_SHEET}!A2:${String.fromCharCode(64 + ITEMS_COLUMNS.length)}`,
    ])
    const claveIdx = pedidosIndex('Clave')
    const index = pedidos.findIndex((row) => text(row[claveIdx]) === key)
    if (index === -1) return { status: 'not-found' }
    // +2: los datos arrancan en la fila 2 (la 1 son los encabezados) y la API es base 1.
    return { status: 'found', order: parseOrder(pedidos[index], index + 2, items) }
  } catch (err) {
    console.error('[orders] Error leyendo la planilla:', err)
    return { status: 'unavailable' }
  }
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false })
}

/**
 * Guarda los datos del cliente en la fila del pedido y lo pasa a "Esperando pago". Escribe sólo
 * las columnas del cliente: lo que cargó Innova (productos, precios) no se toca desde la web.
 */
export async function saveCustomerData(order: Order, cliente: CustomerData): Promise<boolean> {
  if (isMockEnabled()) return mockSave(order, cliente)

  const r = order.row
  const clientValues: CellValue[] = [
    cliente.nombre,
    cliente.dni,
    cliente.mail,
    cliente.telefono,
    cliente.empresaEnvio,
    cliente.calle,
    cliente.dpto,
    cliente.ciudad,
    cliente.provincia,
    cliente.codigoPostal,
    cliente.modalidad,
  ]

  try {
    await batchUpdate([
      { range: `${PEDIDOS_SHEET}!${pedidosLetter('Estado')}${r}`, values: [[ORDER_STATUS.esperandoPago]] },
      {
        range: `${PEDIDOS_SHEET}!${pedidosLetter('Nombre')}${r}:${pedidosLetter('Sucursal/Domicilio')}${r}`,
        values: [clientValues],
      },
      {
        range: `${PEDIDOS_SHEET}!${pedidosLetter('Datos completados')}${r}`,
        values: [[formatTimestamp(new Date())]],
      },
    ])
    return true
  } catch (err) {
    console.error('[orders] Error guardando los datos del cliente:', err)
    return false
  }
}

// ─── Modo demo para desarrollo ───────────────────────────────────────────────
// `ORDERS_MOCK=1 npm run dev` permite ver cada estado de /pedido sin credenciales de Google.
// Nunca se activa en producción.

function isMockEnabled(): boolean {
  return process.env.ORDERS_MOCK === '1' && process.env.NODE_ENV !== 'production'
}

const emptyCustomer: CustomerData = {
  nombre: '', dni: '', mail: '', telefono: '', empresaEnvio: '', calle: '', dpto: '',
  ciudad: '', provincia: '', codigoPostal: '', modalidad: '',
}

function mockOrder(id: string, estado: string, requiereEnvio: boolean): Order {
  const items: OrderItem[] = [
    { producto: 'Fondo 2.90m Color Vivo HD', modelo: 'Bosque encantado', medidas: '2,9 x 2,5 m', precioUnitario: 72000, cantidad: 1, subtotal: 72000, piso: 'Madera clara' },
    { producto: 'Fondo 1.50m Color Vivo HD', modelo: 'Nubes pastel', medidas: '1,5 x 2 m', precioUnitario: 39000, cantidad: 2, subtotal: 78000, piso: '' },
  ]
  return {
    row: 0, id, estado, fecha: '10/10/2026', semanaEntrega: 'Semana del 26/10', total: 150000,
    montoTransferir: 75000, requiereEnvio, items, cliente: { ...emptyCustomer },
  }
}

const globalForMock = globalThis as unknown as { __innovaMockOrders?: Map<string, Order> }

function mockStore(): Map<string, Order> {
  globalForMock.__innovaMockOrders ??= new Map([
    ['00000000000000a1', mockOrder('INN-0001', ORDER_STATUS.esperandoDatos, true)],
    ['00000000000000a2', mockOrder('INN-0002', ORDER_STATUS.esperandoDatos, false)],
    ['00000000000000a3', mockOrder('INN-0003', ORDER_STATUS.pagado, true)],
    ['00000000000000a4', mockOrder('INN-0004', ORDER_STATUS.cancelado, false)],
  ])
  return globalForMock.__innovaMockOrders
}

function mockFind(key: string): OrderLookup {
  const order = mockStore().get(key)
  return order ? { status: 'found', order: structuredClone(order) } : { status: 'not-found' }
}

function mockSave(order: Order, cliente: CustomerData): boolean {
  for (const stored of mockStore().values()) {
    if (stored.id === order.id) {
      stored.cliente = cliente
      stored.estado = ORDER_STATUS.esperandoPago
    }
  }
  return true
}
