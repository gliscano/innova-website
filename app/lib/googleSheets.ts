import { createSign } from 'node:crypto'

/**
 * Cliente mínimo de la API de Google Sheets autenticado con una cuenta de servicio.
 *
 * No usa `googleapis` a propósito: para leer y escribir rangos alcanza con firmar un JWT con
 * `node:crypto` y canjearlo por un access token, y así no se suman ~80 MB de dependencias.
 * La cuenta de servicio sólo ve las planillas que se compartieron con su mail.
 *
 * Solo servidor: lee la clave privada de las variables de entorno.
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

export type CellValue = string | number | boolean
export type SheetRows = CellValue[][]

let cachedToken: { value: string; expiresAt: number } | null = null

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url')
}

export function isSheetsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID)
}

async function getAccessToken(): Promise<string> {
  // Margen de un minuto para no usar un token que vence en medio de la request.
  if (cachedToken && cachedToken.expiresAt - 60_000 > Date.now()) return cachedToken.value

  const email = process.env.GOOGLE_SA_EMAIL
  // En Vercel la clave se pega con los saltos de línea escapados (`\n` literal).
  const privateKey = process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!email || !privateKey) throw new Error('Faltan GOOGLE_SA_EMAIL / GOOGLE_SA_PRIVATE_KEY')

  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(
    JSON.stringify({ iss: email, scope: SHEETS_SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  )
  const signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(privateKey)
  const assertion = `${header}.${claims}.${base64url(signature)}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Token de Google rechazado: ${res.status} ${await res.text()}`)

  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

async function sheetsFetch(path: string, init?: RequestInit): Promise<Response> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  if (!sheetId) throw new Error('Falta GOOGLE_SHEET_ID')

  const token = await getAccessToken()
  const res = await fetch(`${SHEETS_API}/${sheetId}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init?.headers },
    // Los pedidos cambian a mano en la planilla: nunca servir una lectura cacheada.
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Sheets API ${res.status}: ${await res.text()}`)
  return res
}

/**
 * Lee varios rangos en una sola llamada. Los números vuelven como números y las fechas como el
 * texto que se ve en la planilla.
 */
export async function batchGet(ranges: string[]): Promise<SheetRows[]> {
  const params = new URLSearchParams({
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  })
  for (const range of ranges) params.append('ranges', range)

  const res = await sheetsFetch(`/values:batchGet?${params}`)
  const data = (await res.json()) as { valueRanges: { values?: SheetRows }[] }
  return data.valueRanges.map((r) => r.values ?? [])
}

/** Escribe varios rangos en una sola llamada (atómica del lado de Google). */
export async function batchUpdate(data: { range: string; values: SheetRows }[]): Promise<void> {
  await sheetsFetch('/values:batchUpdate', {
    method: 'POST',
    body: JSON.stringify({ valueInputOption: 'RAW', data }),
  })
}
