'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { FavoriteDesign } from '../types/favorites'
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  type FavoriteNotice,
  type FavoritesSnapshot,
} from '../lib/favoritesStore'

/**
 * Hooks selectores sobre el store de favoritos.
 *
 * Devuelven primitivas siempre que se pueda: hay ~200 corazones montados en una
 * página de catálogo, y con un boolean React hace bail-out en los 199 que no
 * cambiaron y re-renderiza uno solo.
 *
 * La closure inline que se le pasa a useSyncExternalStore se recrea en cada
 * render y está bien: lo que tiene que ser estable es el VALOR DEVUELTO, no la
 * función.
 */

function useStore<T>(selector: (s: FavoritesSnapshot) => T): T {
  return useSyncExternalStore(
    subscribe,
    useCallback(() => selector(getSnapshot()), [selector]),
    useCallback(() => selector(getServerSnapshot()), [selector])
  )
}

const selectHydrated = (s: FavoritesSnapshot) => s.hydrated
const selectCount = (s: FavoritesSnapshot) => s.items.length
const selectItems = (s: FavoritesSnapshot) => s.items
const selectPersistError = (s: FavoritesSnapshot) => s.persistError
const selectNotice = (s: FavoritesSnapshot) => s.notice

export function useFavoritesHydrated(): boolean {
  return useStore(selectHydrated)
}

export function useFavoritesCount(): number {
  return useStore(selectCount)
}

/** Array cacheado en el snapshot; su identidad solo cambia en mutación. */
export function useFavoriteItems(): readonly FavoriteDesign[] {
  return useStore(selectItems)
}

export function useFavoritesPersistError(): boolean {
  return useStore(selectPersistError)
}

/** Objeto cacheado en el snapshot; su identidad solo cambia al emitirse o
 *  limpiarse el aviso. */
export function useFavoritesNotice(): FavoriteNotice | null {
  return useStore(selectNotice)
}

export function useIsFavorite(id: string): boolean {
  const selector = useCallback((s: FavoritesSnapshot) => s.ids.has(id), [id])
  return useStore(selector)
}
