import type { CatalogItem } from "../data/catalogData"
import { catalogData } from "../data/catalogData"

// Busca el primer producto por categoría en catalogData
export function getCatalogItemByCategory(category: string) {
  return catalogData.find((item) => item.category === category) as CatalogItem | undefined
}

export function getAllTags() {
    return Array.from(new Set(catalogData.flatMap((product) => product.tags.map((tag) => tag.toLowerCase()))))
}
