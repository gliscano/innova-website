import {
  appendRows,
  batchGet,
  batchUpdate,
  columnLetter,
  isSheetsConfigured,
  quoteSheet,
  type CellValue,
  type SheetRows,
} from './googleSheets'
import {
  ADDRESS_LOGISTICS,
  CLIENTES_COLUMNS,
  CLIENTES_SHEET,
  ENVIOS_COLUMNS,
  ENVIOS_SHEET,
  ITEMS_COLUMNS,
  ITEMS_SHEET,
  ORDER_STATUS,
  PEDIDOS_COLUMNS,
  PEDIDOS_SHEET,
  PICKUP,
  type CustomerData,
  type Order,
  type OrderItem,
} from './orderSchema'
import { displayPhone, normalizePhone } from './phone'

/**
 * Acceso a los pedidos de la planilla. El pedido lo crea Innova desde la planilla
 * (`apps-script/Pedidos.gs`); el sitio sólo lo lee por su clave y completa los datos del cliente,
 * y de paso mantiene al día las pestañas Clientes y Envíos para precargar la próxima compra.
 */

type HeaderMap = Map<string, number>
type Getter = (column: string) => CellValue | undefined

/** Lo que hace falta para volver a escribir: dónde está cada cosa en la planilla. */
export interface OrderContext {
  /** Fila (base 1) del pedido en Pedidos. */
  row: number
  pedidos: HeaderMap
  clientes: { header: HeaderMap; rows: SheetRows }
  envios: { header: HeaderMap; rows: SheetRows }
  /** El cliente ya había completado este pedido antes (es una corrección, no una compra nueva). */
  alreadyCompleted: boolean
  /** Sólo en modo demo: la clave del pedido en el store en memoria. */
  mockKey?: string
}

export type OrderLookup =
  | { status: 'found'; order: Order; context: OrderContext }
  | { status: 'not-found' }
  | { status: 'unavailable' }

/**
 * La clave la genera el script con `Utilities.getUuid()`: 32 caracteres hexadecimales (los pedidos
 * anteriores tienen 16 y siguen andando). Validar el formato antes de ir a Google evita gastar una
 * lectura en URLs inventadas.
 */
const KEY_REGEX = /^[a-f0-9]{16}(?:[a-f0-9]{16})?$/

// ─── Columnas por nombre ─────────────────────────────────────────────────────

function headerKey(name: string): string {
  return name.trim().toLowerCase()
}

/** Mapa encabezado → índice a partir de la fila 1. Falla si falta alguna columna requerida. */
function readHeader(sheet: string, row: CellValue[] | undefined, required: readonly string[]): HeaderMap {
  const header: HeaderMap = new Map()
  ;(row ?? []).forEach((name, i) => header.set(headerKey(String(name)), i))
  const missing = required.filter((name) => !header.has(headerKey(name)))
  if (missing.length) {
    throw new Error(`Faltan columnas en "${sheet}": ${missing.join(', ')}. Ejecutá configurarPlanilla.`)
  }
  return header
}

function getter(header: HeaderMap, row: CellValue[] | undefined): Getter {
  return (column) => row?.[header.get(headerKey(column)) ?? -1]
}

/** Escritura de una celda en notación A1. */
function cell(sheet: string, header: HeaderMap, column: string, row: number, value: CellValue) {
  return { range: `${quoteSheet(sheet)}!${columnLetter(header.get(headerKey(column))!)}${row}`, values: [[value]] }
}

/** Fila completa con cada valor en la posición que dice el encabezado. */
function rowFor(header: HeaderMap, values: Record<string, CellValue>): CellValue[] {
  const row: CellValue[] = new Array(Math.max(...header.values()) + 1).fill('')
  for (const [column, value] of Object.entries(values)) {
    const index = header.get(headerKey(column))
    if (index !== undefined) row[index] = value
  }
  return row
}

// ─── Lectura ─────────────────────────────────────────────────────────────────

function text(value: CellValue | undefined): string {
  return value === undefined ? '' : String(value).trim()
}

function num(value: CellValue | undefined): number {
  if (typeof value === 'number') return value
  const parsed = Number(text(value).replace(/[^\d,.-]/g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

function bool(value: CellValue | undefined): boolean {
  if (typeof value === 'boolean') return value
  return /^(s[ií]|true|x|1)$/i.test(text(value))
}

function parseItems(header: HeaderMap, rows: SheetRows, orderId: string): OrderItem[] {
  return rows
    .map((row) => getter(header, row))
    .filter((get) => text(get('ID pedido')) === orderId)
    .map((get) => ({
      producto: text(get('Producto')),
      modelo: text(get('Modelo')),
      ancho: num(get('Ancho')),
      alto: num(get('Alto')),
      cantidad: num(get('Cantidad')) || 1,
      incluyePiso: bool(get('Incluye piso')),
      largoPared: num(get('Largo pared')),
      largoPiso: num(get('Largo piso')),
      pisoDiseno: text(get('Diseño de piso')),
    }))
}

function customerFromOrder(get: Getter): CustomerData {
  return {
    nombre: text(get('Nombre')),
    dni: text(get('DNI')),
    mail: text(get('Mail')),
    telefono: displayPhone(text(get('Teléfono'))),
    logistica: text(get('Logística')),
    calle: text(get('Calle y número')),
    dpto: text(get('Dpto')),
    ciudad: text(get('Ciudad')),
    provincia: text(get('Provincia')),
    codigoPostal: text(get('Código postal')),
    modalidad: text(get('Sucursal/Domicilio')),
  }
}

/**
 * Datos de una compra anterior del mismo teléfono (el que cargó la vendedora). Se usan sólo para
 * precargar el formulario: el cliente los revisa y confirma.
 */
function customerFromHistory(
  phone: string,
  clientes: OrderContext['clientes'],
  envios: OrderContext['envios'],
): CustomerData | null {
  const key = normalizePhone(phone)
  if (!key) return null

  const clientRow = clientes.rows.find((row) => normalizePhone(text(getter(clientes.header, row)('Teléfono'))) === key)
  if (!clientRow) return null
  const client = getter(clientes.header, clientRow)

  // La dirección usada más recientemente. "Última vez usada" es texto dd/m/aaaa, así que no se
  // compara: las filas nuevas van al final y reusar una actualiza su fecha, pero la que manda es la
  // última fila agregada o actualizada. Para eso alcanza con quedarse con la última del cliente.
  const addresses = envios.rows
    .map((row) => getter(envios.header, row))
    .filter((get) => normalizePhone(text(get('Teléfono'))) === key)
  const latest = addresses[addresses.length - 1]
  const address = (column: string) => (latest ? text(latest(column)) : '')

  return {
    nombre: text(client('Nombre')),
    dni: text(client('DNI')),
    mail: text(client('Mail')),
    telefono: displayPhone(phone),
    logistica: address('Logística'),
    calle: address('Calle y número'),
    dpto: address('Dpto'),
    ciudad: address('Ciudad'),
    provincia: address('Provincia'),
    codigoPostal: address('Código postal'),
    modalidad: address('Sucursal/Domicilio'),
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
    const [pedidosRows, itemsRows, clientesRows, enviosRows] = await batchGet(
      [PEDIDOS_SHEET, ITEMS_SHEET, CLIENTES_SHEET, ENVIOS_SHEET].map((sheet) => `${quoteSheet(sheet)}!A:AZ`),
    )
    const pedidos = readHeader(PEDIDOS_SHEET, pedidosRows[0], PEDIDOS_COLUMNS)
    const items = readHeader(ITEMS_SHEET, itemsRows[0], ITEMS_COLUMNS)
    const clientes = { header: readHeader(CLIENTES_SHEET, clientesRows[0], CLIENTES_COLUMNS), rows: clientesRows.slice(1) }
    const envios = { header: readHeader(ENVIOS_SHEET, enviosRows[0], ENVIOS_COLUMNS), rows: enviosRows.slice(1) }

    const index = pedidosRows.findIndex((row, i) => i > 0 && text(getter(pedidos, row)('Clave')) === key)
    if (index === -1) return { status: 'not-found' }

    const get = getter(pedidos, pedidosRows[index])
    const id = text(get('ID'))
    const total = num(get('Total'))
    const sena = num(get('Seña')) || total
    const alreadyCompleted = Boolean(text(get('Datos completados')))

    // Primera vez que abre el link: si ese teléfono ya compró antes, se precargan sus datos.
    const history = alreadyCompleted ? null : customerFromHistory(text(get('Teléfono')), clientes, envios)

    const order: Order = {
      id,
      estado: text(get('Estado')),
      fecha: text(get('Fecha')),
      semanaEntrega: text(get('Semana de entrega')),
      total,
      sena,
      resta: Math.max(0, total - sena),
      vendedora: text(get('Vendedora')),
      items: parseItems(items, itemsRows.slice(1), id),
      cliente: history ?? customerFromOrder(get),
      prefilled: Boolean(history),
    }
    // index es base 0 sobre las filas leídas desde A1; la API es base 1.
    return { status: 'found', order, context: { row: index + 1, pedidos, clientes, envios, alreadyCompleted } }
  } catch (err) {
    console.error('[orders] Error leyendo la planilla:', err)
    return { status: 'unavailable' }
  }
}

// ─── Escritura ───────────────────────────────────────────────────────────────

function formatTimestamp(date: Date): string {
  return date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false })
}

function sameAddress(get: Getter, cliente: CustomerData): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
  return (
    norm(text(get('Calle y número'))) === norm(cliente.calle) &&
    norm(text(get('Dpto'))) === norm(cliente.dpto) &&
    norm(text(get('Ciudad'))) === norm(cliente.ciudad) &&
    norm(text(get('Código postal'))) === norm(cliente.codigoPostal)
  )
}

/**
 * Guarda los datos del cliente en la fila del pedido y lo pasa a "Esperando pago". Escribe sólo
 * las columnas del cliente: lo que cargó Innova (productos, precios) no se toca desde la web.
 * Después actualiza Clientes (por teléfono) y Envíos (si eligió una logística con dirección).
 */
export async function saveCustomerData(context: OrderContext, cliente: CustomerData): Promise<boolean> {
  if (isMockEnabled()) return mockSave(context, cliente)

  const now = formatTimestamp(new Date())
  const phoneKey = normalizePhone(cliente.telefono)
  const P = (column: string, value: CellValue) => cell(PEDIDOS_SHEET, context.pedidos, column, context.row, value)

  const updates = [
    P('Estado', ORDER_STATUS.esperandoPago),
    P('Nombre', cliente.nombre),
    P('Teléfono', phoneKey || cliente.telefono),
    P('DNI', cliente.dni),
    P('Mail', cliente.mail),
    P('Logística', cliente.logistica),
    P('Requiere envío', cliente.logistica === PICKUP ? 'No' : 'Sí'),
    P('Calle y número', cliente.calle),
    P('Dpto', cliente.dpto),
    P('Ciudad', cliente.ciudad),
    P('Provincia', cliente.provincia),
    P('Código postal', cliente.codigoPostal),
    P('Sucursal/Domicilio', cliente.modalidad),
    P('Datos completados', now),
  ]
  const appends: { sheet: string; row: CellValue[] }[] = []

  // Clientes: una fila por teléfono. Corregir el mismo pedido no cuenta como otra compra.
  if (phoneKey) {
    const { header, rows } = context.clientes
    const index = rows.findIndex((r) => normalizePhone(text(getter(header, r)('Teléfono'))) === phoneKey)
    if (index === -1) {
      appends.push({
        sheet: CLIENTES_SHEET,
        row: rowFor(header, {
          'Teléfono': phoneKey,
          'Nombre': cliente.nombre,
          'DNI': cliente.dni,
          'Mail': cliente.mail,
          'Primera compra': now,
          'Última compra': now,
          'Cant. pedidos': 1,
        }),
      })
    } else {
      // +2: las filas leídas arrancan en la 2 (la 1 es el encabezado) y la API es base 1.
      const C = (column: string, value: CellValue) => cell(CLIENTES_SHEET, header, column, index + 2, value)
      updates.push(C('Nombre', cliente.nombre), C('DNI', cliente.dni), C('Mail', cliente.mail))
      if (!context.alreadyCompleted) {
        const count = num(getter(header, rows[index])('Cant. pedidos'))
        updates.push(C('Última compra', now), C('Cant. pedidos', count + 1))
      }
    }
  }

  // Envíos: una fila por dirección distinta; si repite una, se actualiza esa fila.
  if (phoneKey && ADDRESS_LOGISTICS.includes(cliente.logistica)) {
    const { header, rows } = context.envios
    const values: Record<string, CellValue> = {
      'Teléfono': phoneKey,
      'Logística': cliente.logistica,
      'Sucursal/Domicilio': cliente.modalidad,
      'Calle y número': cliente.calle,
      'Dpto': cliente.dpto,
      'Ciudad': cliente.ciudad,
      'Provincia': cliente.provincia,
      'Código postal': cliente.codigoPostal,
      'Última vez usada': now,
    }
    const index = rows.findIndex((r) => {
      const get = getter(header, r)
      return normalizePhone(text(get('Teléfono'))) === phoneKey && sameAddress(get, cliente)
    })
    if (index === -1) {
      appends.push({ sheet: ENVIOS_SHEET, row: rowFor(header, values) })
    } else {
      for (const [column, value] of Object.entries(values)) {
        updates.push(cell(ENVIOS_SHEET, header, column, index + 2, value))
      }
    }
  }

  try {
    // Primero el pedido (lo importante), en una sola escritura; Clientes y Envíos se agregan después.
    await batchUpdate(updates)
    for (const { sheet, row } of appends) await appendRows(sheet, [row])
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
  nombre: '', dni: '', mail: '', telefono: '', logistica: '', calle: '', dpto: '',
  ciudad: '', provincia: '', codigoPostal: '', modalidad: '',
}

const returningCustomer: CustomerData = {
  nombre: 'Ana Pérez', dni: '30123456', mail: 'ana@example.com', telefono: '5491155551234',
  logistica: 'Correo Argentino', calle: 'Av. Siempreviva 742', dpto: '', ciudad: 'Lanús',
  provincia: 'Buenos Aires', codigoPostal: '1824', modalidad: 'Domicilio',
}

function mockOrder(id: string, estado: string, extra: Partial<Order> = {}): Order {
  const items: OrderItem[] = [
    {
      producto: 'Fondo 2.90m Color Vivo HD', modelo: 'Bosque encantado', ancho: 2.9, alto: 3.5, cantidad: 1,
      incluyePiso: true, largoPared: 2.5, largoPiso: 1, pisoDiseno: 'Madera clara',
    },
    {
      producto: 'Fondo 1.50m Color Vivo HD', modelo: 'Nubes pastel', ancho: 1.5, alto: 2, cantidad: 2,
      incluyePiso: false, largoPared: 0, largoPiso: 0, pisoDiseno: '',
    },
  ]
  return {
    id, estado, fecha: '16/10/2026', semanaEntrega: '03/11/2026', total: 150000, sena: 75000, resta: 75000,
    vendedora: 'Daniela', items, cliente: { ...emptyCustomer, telefono: '5491100000000' }, prefilled: false,
    ...extra,
  }
}

const globalForMock = globalThis as unknown as { __innovaMockOrders?: Map<string, Order> }

function mockStore(): Map<string, Order> {
  globalForMock.__innovaMockOrders ??= new Map([
    ['00000000000000a1', mockOrder('INN-0001', ORDER_STATUS.esperandoDatos)],
    // Cliente que ya compró: llega con sus datos y su última dirección precargados.
    ['00000000000000a2', mockOrder('INN-0002', ORDER_STATUS.esperandoDatos, {
      vendedora: 'Daimary', cliente: { ...returningCustomer }, prefilled: true,
    })],
    ['00000000000000a3', mockOrder('INN-0003', ORDER_STATUS.pagado)],
    ['00000000000000a4', mockOrder('INN-0004', ORDER_STATUS.cancelado, { vendedora: '' })],
  ])
  return globalForMock.__innovaMockOrders
}

function mockFind(key: string): OrderLookup {
  const order = mockStore().get(key)
  if (!order) return { status: 'not-found' }
  const empty = { header: new Map(), rows: [] }
  return {
    status: 'found',
    order: structuredClone(order),
    context: { row: 0, pedidos: new Map(), clientes: empty, envios: empty, alreadyCompleted: false, mockKey: key },
  }
}

function mockSave(context: OrderContext, cliente: CustomerData): boolean {
  const stored = context.mockKey ? mockStore().get(context.mockKey) : undefined
  if (stored) Object.assign(stored, { cliente, estado: ORDER_STATUS.esperandoPago, prefilled: false })
  return true
}
