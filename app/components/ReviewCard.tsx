import { GoogleReview } from '@/app/utils/googlePlaces'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function relativeTime(unixSeconds: number): string {
  const diff = Math.floor((Date.now() / 1000) - unixSeconds)
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
  if (diff < 60) return 'hace un momento'
  if (diff < 3600) return rtf.format(-Math.floor(diff / 60), 'minute')
  if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), 'hour')
  if (diff < 2592000) return rtf.format(-Math.floor(diff / 86400), 'day')
  if (diff < 31536000) return rtf.format(-Math.floor(diff / 2592000), 'month')
  return rtf.format(-Math.floor(diff / 31536000), 'year')
}

export default function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.profile_photo_url}
          alt={review.author_name}
          className="w-10 h-10 rounded-full object-cover bg-gray-100"
          width={40}
          height={40}
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{review.author_name}</p>
          <p className="text-xs text-gray-400">{relativeTime(review.time)}</p>
        </div>
        <div className="ml-auto shrink-0">
          <StarRating rating={review.rating} />
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{review.text}</p>
    </article>
  )
}
