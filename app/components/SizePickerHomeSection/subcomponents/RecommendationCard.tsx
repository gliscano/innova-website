'use client'

import type { RecommendationResult, SizeOption } from '../types'

interface RecommendationCardProps {
  result: RecommendationResult
  onCompareClick: () => void
}

/**
 * Card tipo "Recommended preset" con primary, alternativas y CTAs.
 */
export function RecommendationCard({
  result,
  onCompareClick,
}: RecommendationCardProps) {
  return (
    <article className=" rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-2 mb-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          Mejor para tu espacio
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Recomendado: {result.primary.label}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{result.reason}</p>

      {result.alternatives.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Alternativas:
          </p>
          <div className="flex flex-wrap gap-2">
            {result.alternatives.map((alt: SizeOption) => (
              <span
                key={alt.id}
                className="inline-flex px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700"
              >
                {alt.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2"> 
        <button
          type="button"
          onClick={onCompareClick}
          className="min-h-[44px] flex items-center justify-center rounded-xl font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Comparar tamaños
        </button>
      </div>
    </article>
  )
}
