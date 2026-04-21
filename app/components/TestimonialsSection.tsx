import { getPlaceReviews } from '@/app/utils/googlePlaces'
import ReviewCard from './ReviewCard'

export default async function TestimonialsSection() {
  const reviews = await getPlaceReviews()

  if (!reviews || reviews.length === 0) return null

  return (
    <section className="py-14 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
            Reseñas en Google
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://maps.app.goo.gl/umYECNsdo57obniE6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Ver todas las reseñas en Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
