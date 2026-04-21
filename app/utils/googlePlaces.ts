export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url: string
}

/**
 * Fetches up to 5 Google Places reviews for the configured Place ID.
 * Server-side only — reads env vars directly.
 * Returns null gracefully if env vars are missing or the request fails.
 */
export async function getPlaceReviews(): Promise<GoogleReview[] | null> {
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
    if (!res.ok) return null

    const data = await res.json() as {
      status: string
      result?: { reviews?: GoogleReview[] }
    }

    if (data.status !== 'OK' || !data.result?.reviews) return null

    // Only show reviews with text and at least 4 stars
    return data.result.reviews.filter((r) => r.text?.trim() && r.rating >= 4)
  } catch {
    return null
  }
}
