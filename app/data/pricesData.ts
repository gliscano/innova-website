// ─── Tipos base (formato legacy, usado por otros componentes) ─────────────────

type propertiesProductsType = {
  id: string;
  width: number;
  height: number;
  price: number;
  priceFluo?: number;
  description?: string;
}

const propertiesBackdrops: Array<propertiesProductsType> = [
  { id: "S1520", width: 1.50, height: 2.0, price: 39000, priceFluo: 46000 },
  { id: "S1525", width: 1.50, height: 2.5, price: 44000, priceFluo: 52000 },
  { id: "S1530", width: 1.50, height: 3.0, price: 54000, priceFluo: 64000 },
  { id: "S1535", width: 1.50, height: 3.5, price: 60000, priceFluo: 69000 },
  { id: "S1540", width: 1.50, height: 4.0, price: 65000, priceFluo: 76000 },
  { id: "S1545", width: 1.50, height: 4.5, price: 70000, priceFluo: 82000 },
  { id: "S1550", width: 1.50, height: 5.0, price: 75000, priceFluo: 88000 },
  { id: "S2920", width: 2.90, height: 2.0, price: 61000, priceFluo: 73000 },
  { id: "S2925", width: 2.90, height: 2.5, price: 72000, priceFluo: 85000 },
  { id: "S2930", width: 2.90, height: 3.0, price: 87000, priceFluo: 103000 },
  { id: "S2935", width: 2.90, height: 3.5, price: 97000, priceFluo: 115000 },
  { id: "S2940", width: 2.90, height: 4.0, price: 108000, priceFluo: 127000 },
  { id: "S2945", width: 2.90, height: 4.5, price: 118000, priceFluo: 139000 },
  { id: "S2950", width: 2.90, height: 5.0, price: 128000, priceFluo: 151000 },
  { id: "S2960", width: 2.90, height: 6.0, price: 152000, priceFluo: 180000 },
  { id: "S2970", width: 2.90, height: 7.0, price: 173000, priceFluo: 205000 },
  { id: "S2980", width: 2.90, height: 8.0, price: 194000, priceFluo: 230000 }
];

const propertiesHybridBackdrops: Array<propertiesProductsType> = [
  { id: "SH1525", width: 1.50, height: 3.0, description: "Pared Tela: 1,5m + Piso Neoprene: 1,50", price: 85000 },
  { id: "SH2030", width: 2.0, height: 3.0, description: "Pared Tela: 1,5m + Piso Neoprene: 1,50", price: 100000 },
  { id: "SH2935", width: 2.90, height: 3.5, description: "Pared Tela: 2,0m + Piso Neoprene: 1,50", price: 146000 },
  { id: "SH2940", width: 2.90, height: 4.0, description: "Pared Tela: 2,5m + Piso Neoprene: 1,50", price: 157000 },
]

const propertiesFloor: Array<propertiesProductsType> = [
  { id: "SF1515", width: 1.5, height: 1.50, price: 51000 },
  { id: "SF1530", width: 3.0, height: 1.50, price: 85000 },
  { id: "SF1535", width: 3.5, height: 1.50, price: 95000 },
  { id: "SF1540", width: 4.0, height: 1.50, price: 105000 },
  { id: "SF1550", width: 5.0, height: 1.50, price: 125000 },
];

export {
  propertiesBackdrops,
  propertiesFloor,
  propertiesHybridBackdrops,
}

// ─── Tipos del picker de precios ─────────────────────────────────────────────

export type Finish = 'hd' | 'neon' | 'unico'

export interface FamilyItem {
  largo: number
  ancho: number
  area: number
  hd?: number
  neon?: number
  unico?: number
  detalle?: string
  dim?: string
}

export interface Family {
  id: string
  nombre: string
  ancho: number | null
  eyebrow: string
  desc: string
  finishes: Finish[]
  largos: FamilyItem[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const ars = (n: number) => '$' + new Intl.NumberFormat('es-AR').format(n)

export function dimLabel(family: Family, item: FamilyItem): string {
  if (item.dim) return item.dim + ' m'
  const a = (item.ancho || family.ancho || 0).toString().replace('.', ',')
  const l = item.largo.toString().replace('.', ',')
  return `${a} × ${l} m`
}

export const FINISH_LABEL: Record<Finish, string> = {
  hd: 'Color Vivo HD',
  neon: 'Neón (Fluo)',
  unico: 'Precio único',
}

// ─── Familias de productos (picker interactivo) ───────────────────────────────

export const FAMILIES: Family[] = [
  {
    id: 'p150',
    nombre: 'Fondo 1.50m',
    ancho: 1.5,
    eyebrow: 'Ancho 1.50m',
    desc: 'Sesiones individuales, parejas, newborn y decoración de tiendas.',
    finishes: ['hd', 'neon'],
    largos: propertiesBackdrops
      .filter(p => p.width === 1.50)
      .map(p => ({
        largo: p.height,
        ancho: 1.5,
        area: parseFloat((p.width * p.height).toFixed(1)),
        hd: p.price,
        neon: p.priceFluo ?? p.price,
      })),
  },
  {
    id: 'p290',
    nombre: 'Fondo 2.90m',
    ancho: 2.9,
    eyebrow: 'Ancho 2.90m',
    desc: 'Grupos, sesiones familiares, smash cake y decoración de eventos.',
    finishes: ['hd', 'neon'],
    largos: propertiesBackdrops
      .filter(p => p.width === 2.90)
      .map(p => ({
        largo: p.height,
        ancho: 2.9,
        area: parseFloat((p.width * p.height).toFixed(1)),
        hd: p.price,
        neon: p.priceFluo ?? p.price,
      })),
  },
  {
    id: 'hibrido',
    nombre: 'Híbrido',
    ancho: null,
    eyebrow: 'Tela + Neoprene',
    desc: 'Pared en tela y piso en neoprene. La combinación perfecta de texturas.',
    finishes: ['unico'],
    largos: propertiesHybridBackdrops.map(p => ({
      dim: `${p.width.toString().replace('.', ',')} × ${p.height.toString().replace('.', ',')}`,
      largo: p.height,
      ancho: p.width,
      area: parseFloat((p.width * p.height).toFixed(1)),
      detalle: p.description,
      unico: p.price,
    })),
  },
  {
    id: 'piso',
    nombre: 'Piso Neoprene',
    ancho: null,
    eyebrow: 'Piso 1.50m prof.',
    desc: 'Superficie suave y flexible. Ideal para combinar con cualquier fondo.',
    finishes: ['unico'],
    largos: propertiesFloor.map(p => ({
      dim: `${p.width.toString().replace('.', ',')} × ${p.height.toString().replace('.', ',')}`,
      largo: p.height,
      ancho: p.width,
      area: parseFloat((p.width * p.height).toFixed(1)),
      unico: p.price,
    })),
  },
]
