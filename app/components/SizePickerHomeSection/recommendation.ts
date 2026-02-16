/**
 * Funciones puras para recomendación de tamaños.
 * Exportadas para unit tests; sin dependencias de React.
 */

import type { SizeOption, QuizAnswer, QuizConfig, RecommendationResult } from './types'

/**
 * Convierte SizeOption a formato URL (ej: 2.9×3 → 2_9x3)
 */
export function sizeToUrlParam(size: SizeOption): string {
  const w = String(size.widthM).replace('.', '_')
  const h = String(size.heightM).replace('.', '_')
  return `${w}x${h}`
}

/**
 * Convierte size id a formato URL (ej: S2930 → 2_9x3)
 */
export function sizeIdToUrlParam(id: string, sizes: SizeOption[]): string {
  const size = sizes.find((s) => s.id === id)
  if (!size) return id
  return sizeToUrlParam(size)
}

/**
 * Obtiene recomendación basada en respuestas del quiz.
 * Aplica reglas por prioridad (mayor primero) y devuelve máximo 3 recomendaciones.
 */
export function getRecommendations(
  answers: QuizAnswer[],
  quizConfig: QuizConfig,
  sizes: SizeOption[]
): RecommendationResult | null {
  const answersMap = Object.fromEntries(
    answers.map((a) => [a.questionId, a.optionId])
  )

  if (Object.keys(answersMap).length === 0) return null

  // Ordenar reglas por prioridad descendente
  const sortedRules = [...quizConfig.rules].sort(
    (a, b) => b.priority - a.priority
  )

  for (const rule of sortedRules) {
    const matches = Object.entries(rule.conditions).every(
      ([key, value]) => answersMap[key] === value
    )
    if (!matches) continue

    const recommendedSizes = rule.sizeIds
      .map((id) => sizes.find((s) => s.id === id))
      .filter((s): s is SizeOption => s != null)
      .slice(0, 3)

    if (recommendedSizes.length === 0) continue

    const [primary, ...alternatives] = recommendedSizes
    return {
      primary,
      alternatives,
      reason: rule.reason,
    }
  }

  // Fallback: primer tamaño popular si hay al menos una respuesta
  const first = sizes[0]
  if (first) {
    return {
      primary: first,
      alternatives: sizes.slice(1, 3),
      reason: 'Un tamaño versátil para empezar.',
    }
  }

  return null
}
