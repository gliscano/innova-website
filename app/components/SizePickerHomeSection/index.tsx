'use client'

import { useState, useCallback, lazy, Suspense } from 'react'
import { SectionHeader, SegmentedTabs, SizeCarousel, SizeVisualReference, QuickQuiz } from './subcomponents'
import { DEFAULT_SIZES, DEFAULT_QUIZ_CONFIG, DEFAULT_ROUTES } from '../../data/sizePickerData'
import type { SizePickerHomeSectionProps, QuizAnswer } from './types'

const CompareModal = lazy(() =>
  import('./subcomponents/CompareModal').then((m) => ({ default: m.CompareModal }))
)

const TABS = [
  { id: 'popular', label: 'Tamaños populares' },
  { id: 'quiz', label: 'Ayudame a elegir' },
]

/**
 * SizePickerHomeSection - Sección de home para elegir tamaño.
 * Estilo Leonardo AI: preset-driven, progresivo, visual.
 * Mobile-first, sin tablas, con micro-interacciones.
 */
export function SizePickerHomeSection({
  sizes = DEFAULT_SIZES,
  quizConfig = DEFAULT_QUIZ_CONFIG,
  routes = DEFAULT_ROUTES,
  isLoading = false,
  onShowPrices,
  sectionId = 'size-picker',
}: SizePickerHomeSectionProps) {
  const [activeTab, setActiveTab] = useState('popular')
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([])
  const [compareModalOpen, setCompareModalOpen] = useState(false)

  const handleQuizAnswer = useCallback((questionId: string, optionId: string) => {
    setQuizAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId)
      return [...filtered, { questionId, optionId }]
    })
  }, [])

  const handleQuizReset = useCallback(() => {
    setQuizAnswers([])
  }, [])

  const handleCompareClick = useCallback(() => {
    setCompareModalOpen(true)
  }, [])

  const handleCompareClose = useCallback(() => {
    setCompareModalOpen(false)
  }, [])

  if (isLoading) {
    return (
      <section
        className="py-12 md:py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#F7F7F8' }}
        aria-busy="true"
        aria-label="Cargando selector de tamaños"
      >
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
            <div className="h-12 bg-gray-200 rounded-2xl w-64 mx-auto" />
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 rounded-2xl"
                  style={{ minHeight: 280 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id={sectionId}
      className="py-12 md:py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#F7F7F8' }}
      aria-labelledby="size-picker-title"
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Elegí tu tamaño"
          subtitle="Te recomendamos el tamaño ideal según tu sesión y espacio. Sin vueltas."
        />

        <div className="flex justify-center mb-8">
          <SegmentedTabs
            tabs={TABS}
            activeId={activeTab}
            onChange={setActiveTab}
            ariaLabel="Seleccionar entre tamaños populares o asistente guiado"
          />
        </div>

        <div
          role="tabpanel"
          id="panel-popular"
          aria-labelledby="tab-popular"
          hidden={activeTab !== 'popular'}
          className="transition-opacity duration-200"
        >
          {activeTab === 'popular' && (
            <SizeCarousel
              sizes={sizes}
              routes={routes}
              onShowPrices={onShowPrices}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-quiz"
          aria-labelledby="tab-quiz"
          hidden={activeTab !== 'quiz'}
          className="transition-opacity duration-200"
        >
          {activeTab === 'quiz' && (
            <QuickQuiz
              quizConfig={quizConfig}
              sizes={sizes}
              answers={quizAnswers}
              onAnswer={handleQuizAnswer}
              onReset={handleQuizReset}
              designCatalogUrl={(size) => routes.designCatalog(size)}
              onCompareClick={handleCompareClick}
            />
          )}
        </div>

        <SizeVisualReference />
      </div>

      {compareModalOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <CompareModal sizes={sizes} onClose={handleCompareClose} />
        </Suspense>
      )}
    </section>
  )
}
