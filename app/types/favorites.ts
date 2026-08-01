/**
 * Tipos y constantes de la feature "Me gusta" / Favoritos.
 *
 * Archivo `.ts` y no `.d.ts` porque exporta constantes en runtime
 * (gallery.d.ts es solo declaraciones y no puede tenerlas).
 */

/** Clave de localStorage. La versión va en el sufijo Y en el payload: el sufijo
 *  permite que una v2 lea v1, migre y borre; el campo interno protege ante un
 *  rollback de deploy que escribiría la forma vieja dentro de la clave nueva. */
export const STORAGE_KEY = 'innova.favorites.v1'
export const SCHEMA_VERSION = 1

/** Cookie del id anónimo. No es httpOnly: es un id de correlación, no una
 *  credencial, y el cliente de fase 2 tiene que poder leerlo. */
export const ANON_COOKIE = 'innova_aid'
export const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2 // 2 años

/** Tope duro. No está para cuidar la cuota de storage (sobra de lejos) sino
 *  para acotar el peor caso de la escritura síncrona y del JSON.parse. */
export const MAX_FAVORITES = 200

/** Debounce de la persistencia. El snapshot en memoria se actualiza de forma
 *  síncrona; solo el setItem se difiere para no bloquear el main thread al
 *  marcar varios diseños seguidos. */
export const PERSIST_DEBOUNCE_MS = 400

/**
 * Snapshot mínimo de un diseño favoriteado.
 *
 * Se guarda un snapshot y no solo el id porque /favoritos no sabe de qué
 * carpeta de Cloudinary vino cada imagen: resolver por id exigiría un endpoint
 * nuevo y un round-trip antes de pintar nada.
 *
 * Se excluyen a propósito `tags`, `format`, `createdAt`, `aspect_ratio`
 * (derivable de width/height), `bytes`, `metadata`, `context` y `description`.
 * Esta última viene de context.custom.Description (prosa + colores) y es el
 * campo que domina el peso del registro; GalleryModal ya degrada con gracia
 * cuando falta. En fase 2 el servidor la resuelve fresca.
 */
export interface FavoriteDesign {
  /** public_id de Cloudinary === GalleryImage.id. Clave primaria. */
  id: string
  /** secure_url. Lo consume el mensaje de WhatsApp por diseño del modal. */
  url: string
  /** width/height → ratio del masonry. */
  width: number
  height: number
  /** Título en el tile, el modal y el mensaje de WhatsApp. */
  display_name: string
  /** asset_folder de Cloudinary. "mundo-infantil/princesas" en colecciones. */
  folder?: string
  /** epoch ms. Ordena /favoritos, más reciente primero. */
  addedAt: number
}

export interface FavoritesStoreV1 {
  version: typeof SCHEMA_VERSION
  /** UUID anónimo; espejo durable de la cookie innova_aid. */
  anonId: string
  updatedAt: number
  items: FavoriteDesign[]
}
