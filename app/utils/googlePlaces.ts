export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url: string
}

/**
 * La API key está restringida por referer, así que Google solo autoriza la llamada desde el
 * dominio desplegado: en una máquina de desarrollo siempre devuelve
 * `REQUEST_DENIED: API keys with referer restrictions cannot be used with this API`.
 * No es un bug — es la restricción funcionando — pero ensuciaba la consola de `dev` y de cada
 * `build` local con un error que parecía real.
 *
 * Vercel define `VERCEL=1` en build y en runtime de todos sus entornos, así que sirve de señal de
 * "esto no es una máquina local". Deliberadamente no se usa `NODE_ENV`: un `next build` local
 * también corre con `NODE_ENV=production` y volvería a disparar la llamada.
 */
function isDeployedEnvironment(): boolean {
  return Boolean(process.env.VERCEL)
}

/**
 * Fetches up to 5 Google Places reviews for the configured Place ID.
 * Server-side only — reads env vars directly.
 * Returns null gracefully outside of Vercel, if env vars are missing, or if the request fails.
 */
export async function getPlaceReviews(): Promise<GoogleReview[] | null> {
  if (!isDeployedEnvironment()) return null

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) return null

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    url.searchParams.set('place_id', placeId)
    url.searchParams.set('fields', 'reviews,rating,user_ratings_total')
    url.searchParams.set('language', 'es')
    url.searchParams.set('key', apiKey)

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) {
      console.error('[GooglePlaces] HTTP error:', res.status, res.statusText)
      return null
    }

    const data = await res.json() as {
      status: string
      error_message?: string
      result?: { reviews?: GoogleReview[] }
    }

    if (data.status !== 'OK' || !data.result?.reviews) {
      console.warn('[GooglePlaces] API error:', data.status, data.error_message ?? '')
      return null
    }

    const filtered = data.result.reviews.filter((r) => r.text?.trim() && r.rating >= 4)
    return filtered.sort(() => Math.random() - 0.5)
  } catch {
    return null
  }
}
