'use client'

import { useCallback } from 'react'
import { RotateCcw } from 'lucide-react'
import type { QuizConfig, QuizAnswer, SizeOption } from '../types'
import { getRecommendations } from '../recommendation'
import { RecommendationCard } from './RecommendationCard'

interface QuickQuizProps {
  quizConfig: QuizConfig
  sizes: SizeOption[]
  answers: QuizAnswer[]
  onAnswer: (questionId: string, optionId: string) => void
  onReset: () => void
  onCompareClick: () => void
}

/**
 * Quiz de 2-3 preguntas con chips.
 * Muestra recomendación inmediata al seleccionar.
 */
export function QuickQuiz({
  quizConfig,
  sizes,
  answers,
  onAnswer,
  onReset,
  onCompareClick,
}: QuickQuizProps) {
  const recommendation = getRecommendations(answers, quizConfig, sizes)

  const handleOptionClick = useCallback(
    (questionId: string, optionId: string) => {
      onAnswer(questionId, optionId)
    },
    [onAnswer]
  )

  const hasAnyAnswer = answers.length > 0

  return (
    <div className="space-y-6">
      {quizConfig.questions.map((q) => {
        const selectedId = answers.find((a) => a.questionId === q.id)?.optionId
        return (
          <fieldset key={q.id} className="space-y-3">
            <legend className="text-sm font-medium text-gray-900">
              {q.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionClick(q.id, opt.id)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    selectedId === opt.id
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-pressed={selectedId === opt.id}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        )
      })}

      {hasAnyAnswer && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Reiniciar selección"
        >
          <RotateCcw className="w-4 h-4" aria-hidden />
          Reiniciar
        </button>
      )}

      {!hasAnyAnswer && (
        <p className="text-sm text-gray-500 italic">
          Elegí una opción para empezar
        </p>
      )}

      {recommendation && (
        <RecommendationCard
          result={recommendation}
          onCompareClick={onCompareClick}
        />
      )}
    </div>
  )
}
