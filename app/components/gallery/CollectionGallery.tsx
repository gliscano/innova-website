'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { CloudinarySubfolder } from '@/app/types/catalog'
import { SubcategoryPills } from './SubcategoryPills'
import { SubcategorySection } from './SubcategorySection'

interface CollectionGalleryProps {
  subfolders: CloudinarySubfolder[]
}

export function CollectionGallery({ subfolders }: CollectionGalleryProps) {
  const [loadedPaths, setLoadedPaths] = useState<string[]>(() =>
    subfolders.length > 0 ? [subfolders[0].path] : []
  )
  const [activePath, setActivePath] = useState<string>(subfolders[0]?.path ?? '')
  const [pendingScrollPath, setPendingScrollPath] = useState<string | null>(null)

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const rafRef = useRef<number | null>(null)

  // Scroll tracking: actualiza la pill activa según la sección más cercana al tope
  const updateActivePill = useCallback(() => {
    const threshold = window.scrollY + 140 // offset: pills bar + algo de margen
    let closestPath = loadedPaths[0]
    let closestDist = Infinity

    for (const [path, el] of sectionRefs.current) {
      const elTop = el.getBoundingClientRect().top + window.scrollY
      const dist = Math.abs(elTop - threshold)
      if (dist < closestDist) {
        closestDist = dist
        closestPath = path
      }
    }

    if (closestPath) setActivePath(closestPath)
  }, [loadedPaths])

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateActivePill)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updateActivePill])

  // Cuando se agrega una nueva sección vía pill click, hacer scroll una vez que el ref esté listo
  useEffect(() => {
    if (!pendingScrollPath) return
    const el = sectionRefs.current.get(pendingScrollPath)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setPendingScrollPath(null)
    }
  }, [loadedPaths, pendingScrollPath])

  const handleSectionComplete = useCallback((completedPath: string) => {
    const idx = subfolders.findIndex(s => s.path === completedPath)
    const next = subfolders[idx + 1]
    if (next) {
      setLoadedPaths(prev =>
        prev.includes(next.path) ? prev : [...prev, next.path]
      )
    }
  }, [subfolders])

  const handlePillClick = useCallback((path: string) => {
    setActivePath(path)

    if (loadedPaths.includes(path)) {
      sectionRefs.current.get(path)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    // Insertar en posición natural (por índice en subfolders[])
    const naturalIdx = subfolders.findIndex(s => s.path === path)
    setLoadedPaths(prev => {
      if (prev.includes(path)) return prev
      const insertAt = prev.findIndex(p => subfolders.findIndex(s => s.path === p) > naturalIdx)
      const next = [...prev]
      if (insertAt === -1) next.push(path)
      else next.splice(insertAt, 0, path)
      return next
    })
    setPendingScrollPath(path)
  }, [loadedPaths, subfolders])

  if (subfolders.length === 0) return null

  return (
    <>
      {/* Pills sticky: se pega debajo del StickyProductBar (h-12 = 48px) */}
      <div className="sticky top-12 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E7DFD2] py-2 -mx-4 px-4 mb-2">
        <SubcategoryPills
          subfolders={subfolders}
          activeSubfolder={activePath}
          onSelect={handlePillClick}
        />
      </div>

      {/* Feed continuo de secciones */}
      {loadedPaths.map(path => {
        const subfolder = subfolders.find(s => s.path === path)
        if (!subfolder) return null
        return (
          <SubcategorySection
            key={path}
            subfolder={subfolder}
            onSectionRef={(el) => {
              if (el) sectionRefs.current.set(path, el)
              else sectionRefs.current.delete(path)
            }}
            onComplete={() => handleSectionComplete(path)}
          />
        )
      })}
    </>
  )
}
