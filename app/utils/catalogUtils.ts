import type { CatalogItem } from "../data/catalogData"
import { catalogData } from "../data/catalogData"

export function getCatalogItemByCategory(category: string) {
  return catalogData.find((item) => item.category === category) as CatalogItem | undefined
}

export function formatFolderName(name: string): string {
  return name
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim()
}

