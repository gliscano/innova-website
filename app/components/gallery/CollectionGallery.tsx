'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { CloudinarySubfolder } from '@/app/types/catalog'
import { SubcategoryPills } from './SubcategoryPills'
import { SubcategorySection } from './SubcategorySection'

interface CollectionGalleryProps {
  subfolders: CloudinarySubfolder[]
}

export function CollectionGallery({ subfolders }: CollectionGalleryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Se captura una sola vez, en el montaje — un click posterior en otra pill actualiza
  // `sub` en la URL pero no debe reordenar las pills otra vez.
  const [initialSub] = useState(() => searchParams.get('sub'))

  // Si la URL trae ?sub=<nombre>, esa subcategoría pasa a ser la primera de la lista,
  // tanto para las pills como para la sección que se renderiza de entrada — así no hace
  // falta scrollear hasta ella después del montaje.
  const orderedSubfolders = useMemo(() => {
    const idx = subfolders.findIndex(s => s.name === initialSub)
    if (idx <= 0) return subfolders
    const target = subfolders[idx]
    return [target, ...subfolders.slice(0, idx), ...subfolders.slice(idx + 1)]
  }, [subfolders, initialSub])

  const [loadedPaths, setLoadedPaths] = useState<string[]>(() =>
    orderedSubfolders.length > 0 ? [orderedSubfolders[0].path] : []
  )
  const [activePath, setActivePath] = useState<string>(orderedSubfolders[0]?.path ?? '')
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
    const idx = orderedSubfolders.findIndex(s => s.path === completedPath)
    const next = orderedSubfolders[idx + 1]
    if (next) {
      setLoadedPaths(prev =>
        prev.includes(next.path) ? prev : [...prev, next.path]
      )
    }
  }, [orderedSubfolders])

  const handlePillClick = useCallback((path: string) => {
    setActivePath(path)

    const subfolder = orderedSubfolders.find(s => s.path === path)
    if (subfolder) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sub', subfolder.name)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    if (loadedPaths.includes(path)) {
      sectionRefs.current.get(path)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    // Insertar en posición natural (por índice en orderedSubfolders[])
    const naturalIdx = orderedSubfolders.findIndex(s => s.path === path)
    setLoadedPaths(prev => {
      if (prev.includes(path)) return prev
      const insertAt = prev.findIndex(p => orderedSubfolders.findIndex(s => s.path === p) > naturalIdx)
      const next = [...prev]
      if (insertAt === -1) next.push(path)
      else next.splice(insertAt, 0, path)
      return next
    })
    setPendingScrollPath(path)
  }, [loadedPaths, orderedSubfolders, pathname, router, searchParams])

  if (orderedSubfolders.length === 0) return null

  return (
    <>
      {/* Pills sticky: se pega debajo del StickyProductBar (h-12 = 48px) */}
      <div className="sticky top-12 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E7DFD2] py-2 -mx-4 px-4 mb-2">
        <SubcategoryPills
          subfolders={orderedSubfolders}
          activeSubfolder={activePath}
          onSelect={handlePillClick}
        />
      </div>

      {/* Feed continuo de secciones */}
      {loadedPaths.map(path => {
        const subfolder = orderedSubfolders.find(s => s.path === path)
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
