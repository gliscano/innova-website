/**
 * Descripción de una imagen de Cloudinary lista para mostrar.
 *
 * El campo `Description` tiene tres formatos, según cuándo se cargó la imagen:
 *  1. Texto libre, opcionalmente seguido de "Colores: a, b".
 *  2. Campos con prosa: "Contexto: …", "Objetos: …", "Colores dominantes: …".
 *  3. Campos para el buscador: "Nombre", "Tags", "Contexto", "Uso", "Objetos", "Estilo", "Publico",
 *     con listas de palabras clave separadas por comas.
 * De todo eso solo se muestra una frase (`text`) y los colores; el resto existe para la búsqueda.
 */
export interface ImageDescription {
  text: string | null
  colors: string[] | null
}

const normalizeKey = (key: string) =>
  key.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim()

/** Claves de los formatos 2 y 3. Una línea con otra clave se trata como texto libre. */
const KNOWN_KEYS = new Set([
  "nombre",
  "descripcion",
  "tags",
  "contexto",
  "uso",
  "objetos",
  "estilo",
  "publico",
  "colores",
  "colores dominantes",
])

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "salon,estudio" es una lista de palabras clave; "Fondo texturizado con marcas de agua." es prosa. */
const isKeywordList = (value: string) => /,\S/.test(value) || !/\s/.test(value.trim())

export function parseImageDescription(raw: string | null | undefined): ImageDescription | null {
  if (!raw?.trim()) return null

  // Formato 1 viejo: "Colores:" puede venir pegado al texto en la misma línea.
  const lines = raw.replace(/\s*(colores(?:\s+dominantes)?\s*:)/gi, "\n$1").split(/\r?\n/)

  const fields: Record<string, string> = {}
  const prose: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const m = trimmed.match(/^([^:]{2,30}):\s*(.*)$/)
    const key = m ? normalizeKey(m[1]) : null
    if (m && key && KNOWN_KEYS.has(key)) {
      fields[key] = m[2].trim()
    } else {
      prose.push(trimmed)
    }
  }

  const colorsRaw = fields["colores"] ?? fields["colores dominantes"]
  const colors = colorsRaw
    ?.split(/,\s*/)
    .map((c) => capitalize(c.replace(/\.$/, "").trim()))
    .filter(Boolean)

  const contexto = fields["contexto"]
  const text =
    prose.join(" ") ||
    fields["descripcion"] ||
    (contexto && !isKeywordList(contexto) ? contexto : "") ||
    (fields["nombre"] ? capitalize(fields["nombre"]) : "")

  if (!text && !colors?.length) return null
  return { text: text || null, colors: colors?.length ? colors : null }
}
