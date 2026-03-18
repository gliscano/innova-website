'use client'

interface LoadMoreButtonProps {
  onClick: () => void
  isLoading: boolean
}

export function LoadMoreButton({ onClick, isLoading }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center pt-2 pb-4">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="group relative px-7 py-2.5 rounded-full bg-white border border-stone-300 text-stone-600 text-sm font-medium shadow-sm transition-all duration-200 hover:border-[#c19d83] hover:text-[#c19d83] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        aria-label={isLoading ? 'Cargando más creaciones' : 'Ver más creaciones'}
      >
        {isLoading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin text-[#c19d83]"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Cargando…
          </>
        ) : (
          <>
            Ver más creaciones
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}
