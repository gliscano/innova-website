/**
 * Deja un teléfono argentino en el formato que usa wa.me (549 + área + número). Es la clave de la
 * pestaña Clientes, así que tiene que dar lo mismo que `normalizarTelefono()` de
 * `apps-script/Pedidos.gs`: "+54 9 11 1234-5678", "011 15 1234 5678" y "1112345678" → 5491112345678.
 */
export function normalizePhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('549')) return digits
  if (digits.startsWith('54')) return '549' + digits.slice(2)
  if (digits.startsWith('0')) digits = digits.slice(1)
  // "11 15 1234 5678" → se quita el 15 que va después del código de área.
  const match = digits.match(/^(\d{2,4})15(\d{6,8})$/)
  if (match && (match[1] + match[2]).length === 10) digits = match[1] + match[2]
  return '549' + digits
}

/**
 * Para mostrarle al cliente su teléfono en el formulario: sin el 549 del formato interno
 * (5491155551234 → 1155551234). Al guardar se vuelve a normalizar.
 */
export function displayPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  return /^549\d{10}$/.test(digits) ? digits.slice(3) : value
}
