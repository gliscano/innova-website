export interface CatalogItem {
  id: number
  title: string
  category: string
  image: string
  description: string
  tags: string[]
  featured: boolean
  sizes: string[]
}

export const catalogData: CatalogItem[] = [
  {
    id: 1,
    title: "Catálogo de Pascuas",
    category: "Pascuas",
    image: "/images/innova/catalog/1.png",
    description: "Diseños especiales para celebrar la Pascua con estilo",
    tags: ["pascuas", "celebración", "primavera"],
    featured: true,
    sizes: ["1x1m", "2x2m", "3x3m"],
  },
  {
    id: 2,
    title: "Catálogo de Infantiles",
    category: "Infantiles",
    image: "/images/innova/catalog/1.png",
    description: "Diseños divertidos y coloridos para fotografía infantil",
    tags: ["niños", "infantil", "colorido"],
    featured: false,
    sizes: ["1x1m", "2x2m"],
  },
  {
    id: 3,
    title: "Catálogo de Fondos para Mascotas",
    category: "Mascotas",
    image: "/images/innova/catalog/1.png",
    description: "Fondos especializados para fotografía de mascotas",
    tags: ["mascotas", "animales", "pets"],
    featured: true,
    sizes: ["2x2m", "3x3m"],
  },
  {
    id: 4,
    title: "Catálogo de Boho",
    category: "Boho",
    image: "/images/innova/catalog/1.png",
    description: "Estilo bohemio elegante, sofisticado y atemporal para sesiones únicas",
    tags: ["boho", "elegante", "bohemio"],
    featured: false,
    sizes: ["1.5x1.5m", "2x2m"],
  },
  {
    id: 5,
    title: "Catálogo Escolar",
    category: "Escolar",
    image: "/images/innova/catalog/1.png",
    description: "Diseños perfectos para fotografía escolar",
    tags: ["escolar", "educación", "estudiantes"],
    featured: false,
    sizes: ["1x1m", "1.5x1.5m", "2x2m"],
  },
  {
    id: 6,
    title: "Catálogo de Fachadas",
    category: "Fachadas",
    image: "/images/innova/catalog/1.png",
    description: "Fondos arquitectónicos y urbanos",
    tags: ["arquitectura", "urbano", "fachadas"],
    featured: false,
    sizes: ["2x3m", "3x3m"],
  },
  {
    id: 7,
    title: "Gender Reveal y Baby Shower",
    category: "Baby Shower",
    image: "/images/innova/catalog/1.png",
    description: "Diseños especiales para revelación de género y baby shower",
    tags: ["baby shower", "gender reveal", "bebé"],
    featured: true,
    sizes: ["1x1m", "2x2m"],
  },
  {
    id: 8,
    title: "Catálogo de Escaleras",
    category: "Escaleras",
    image: "/images/innova/catalog/1.png",
    description: "Fondos con escaleras para composiciones dinámicas",
    tags: ["escaleras", "arquitectura", "dinámico"],
    featured: false,
    sizes: ["2x2m", "2x3m"],
  },
  {
    id: 9,
    title: "Fondo Personalizado",
    category: "Personalizado",
    image: "/images/innova/catalog/1.png",
    description: "Diseños completamente personalizados según tus necesidades",
    tags: ["personalizado", "único", "custom"],
    featured: true,
    sizes: ["Cualquiera"],
  },
]

// Sistema de sinónimos y palabras relacionadas
export const synonymsCatalog: Record<string, string[]> = {
  niños: ["infantil", "niño", "niña", "bebé", "chicos", "pequeños"],
  mascotas: ["animales", "pets", "perros", "gatos", "mascota"],
  boho: ["bohemio", "hippie", "vintage", "rústico"],
  escolar: ["educación", "estudiantes", "colegio", "escuela"],
  pascuas: ["pascua", "conejo", "huevos", "primavera"],
  celebración: ["fiesta", "evento", "cumpleaños", "party"],
  elegante: ["sofisticado", "clásico", "formal"],
  arquitectura: ["urbano", "ciudad", "edificios"],
  personalizado: ["único", "custom", "especial", "exclusivo"],
}