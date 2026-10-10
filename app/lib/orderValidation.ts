import {
  DELIVERY_MODES,
  PROVINCIAS,
  SHIPPING_COMPANIES,
  type CustomerData,
} from './orderSchema'

export type CustomerField = keyof CustomerData
export type FieldErrors = Partial<Record<CustomerField, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Código postal de 4 dígitos o CPA (letra + 4 dígitos + 3 letras, ej. C1425ABC). */
const CP_REGEX = /^(\d{4}|[A-Z]\d{4}[A-Z]{3})$/

function field(formData: FormData, name: CustomerField, maxLength: number): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : ''
}

function oneOf(value: string, options: readonly string[]): boolean {
  return options.includes(value)
}

/**
 * Normaliza y valida lo que manda el formulario de `/pedido/[clave]`. Corre en el servidor: los
 * atributos `required`/`pattern` del formulario son sólo una ayuda para el cliente.
 */
export function parseCustomerData(
  formData: FormData,
  requiereEnvio: boolean,
): { data: CustomerData; errors: FieldErrors } {
  const data: CustomerData = {
    nombre: field(formData, 'nombre', 100),
    dni: field(formData, 'dni', 20).replace(/\D/g, ''),
    mail: field(formData, 'mail', 254).toLowerCase(),
    telefono: field(formData, 'telefono', 30),
    empresaEnvio: '',
    calle: '',
    dpto: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    modalidad: '',
  }
  const errors: FieldErrors = {}

  if (data.nombre.length < 3) errors.nombre = 'Ingresá tu nombre y apellido.'
  if (!/^\d{7,8}$/.test(data.dni)) errors.dni = 'El DNI debe tener 7 u 8 números.'
  if (!EMAIL_REGEX.test(data.mail)) errors.mail = 'Revisá el mail.'
  const phoneDigits = data.telefono.replace(/\D/g, '')
  if (phoneDigits.length < 8 || phoneDigits.length > 15) errors.telefono = 'Ingresá un teléfono con código de área.'

  if (requiereEnvio) {
    data.empresaEnvio = field(formData, 'empresaEnvio', 40)
    data.calle = field(formData, 'calle', 120)
    data.dpto = field(formData, 'dpto', 30)
    data.ciudad = field(formData, 'ciudad', 80)
    data.provincia = field(formData, 'provincia', 60)
    data.codigoPostal = field(formData, 'codigoPostal', 10).toUpperCase().replace(/\s/g, '')
    data.modalidad = field(formData, 'modalidad', 20)

    if (!oneOf(data.empresaEnvio, SHIPPING_COMPANIES)) errors.empresaEnvio = 'Elegí una empresa de envío.'
    if (data.calle.length < 3) errors.calle = 'Ingresá calle y número.'
    if (data.ciudad.length < 2) errors.ciudad = 'Ingresá la ciudad.'
    if (!oneOf(data.provincia, PROVINCIAS)) errors.provincia = 'Elegí la provincia.'
    if (!CP_REGEX.test(data.codigoPostal)) errors.codigoPostal = 'Código postal de 4 números (ej. 1425).'
    if (!oneOf(data.modalidad, DELIVERY_MODES)) errors.modalidad = 'Elegí sucursal o domicilio.'
  }

  return { data, errors }
}
