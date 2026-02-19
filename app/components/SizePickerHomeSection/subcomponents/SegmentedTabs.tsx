'use client'

import { useRef, useEffect } from 'react'

export interface TabItem {
  id: string
  label: string
}

interface SegmentedTabsProps {
  tabs: TabItem[]
  activeId: string
  onChange: (id: string) => void
  ariaLabel?: string
}

export function SegmentedTabs({
  tabs,
  activeId,
  onChange,
  ariaLabel = 'Seleccionar vista',
}: SegmentedTabsProps) {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeId)
    if (activeIndex < 0 || !containerRef.current || !indicatorRef.current) return

    const tabEl = containerRef.current.querySelector(
      `[data-tab-id="${activeId}"]`
    ) as HTMLElement
    if (!tabEl) return

    const { offsetLeft, offsetWidth } = tabEl
    indicatorRef.current.style.width = `${offsetWidth}px`
    indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`
  }, [activeId, tabs])

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className="relative inline-flex p-1 bg-gray-200/80 rounded-2xl gap-0.5"
    >
      {/* Indicador animado */}
      <div
        ref={indicatorRef}
        aria-hidden
        className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm transition-all duration-200 ease-out pointer-events-none"
        style={{ left: 4 }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeId === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          data-tab-id={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative z-10 min-h-[44px] px-5 sm:px-6 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          style={{
            color: activeId === tab.id ? '#111827' : '#6B7280',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
