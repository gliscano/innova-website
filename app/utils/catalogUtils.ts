import type { CatalogItem } from "../data/catalogData"
import { catalogData } from "../data/catalogData"

// Busca un producto por índice en catalogData
export function getCatalogItemByIndex(index: number) {
  if (index < 0 || index >= catalogData.length) return null
  return catalogData[index] as CatalogItem
}

export function getAllTags() {
    return Array.from(new Set(catalogData.flatMap((product) => product.tags.map((tag) => tag.toLowerCase()))))
}
