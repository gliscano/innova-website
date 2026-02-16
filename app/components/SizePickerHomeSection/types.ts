/**
 * Tipos para SizePickerHomeSection.
 * Desacoplados de la UI para facilitar tests y evolución.
 */

/** Opción de tamaño con metadatos para cards y recomendaciones */
export interface SizeOption {
  id: string
  label: string
  widthM: number
  heightM: number
  fromPrice?: number
  bestFor: string[]
  depthLevel: 'Baja' | 'Media' | 'Alta'
  lightingHint: string
  badges: string[]
}

/** Pregunta del quiz con opciones parametrizables */
export interface QuizQuestion {
  id: string
  label: string
  options: QuizOption[]
}

export interface QuizOption {
  id: string
  label: string
}

/** Respuesta del usuario para cada pregunta */
export interface QuizAnswer {
  questionId: string
  optionId: string
}

/** Configuración de reglas de recomendación */
export interface QuizConfig {
  questions: QuizQuestion[]
  /** Reglas: (Q2=espacio, Q1=uso, Q3=preferencia) */
  rules: RecommendationRule[]
}

export interface RecommendationRule {
  /** Condiciones AND (ej: { space: 'estudio_chico', use: 'newborn' }) */
  conditions: Partial<Record<string, string>>
  /** Prioridad: mayor = más prioridad */
  priority: number
  /** IDs de tamaños recomendados en orden */
  sizeIds: string[]
  reason: string
}

/** Resultado de la recomendación */
export interface RecommendationResult {
  primary: SizeOption
  alternatives: SizeOption[]
  reason: string
}

/** Builders de URLs para desacoplar navegación */
export interface RouteBuilders {
  designCatalog: (size: string) => string
  studio: (size: string) => string
  prices: () => string
}

/** Props del componente principal */
export interface SizePickerHomeSectionProps {
  sizes?: SizeOption[]
  quizConfig?: QuizConfig
  routes?: RouteBuilders
  /** Skeleton loading si sizes/config viene async */
  isLoading?: boolean
}
