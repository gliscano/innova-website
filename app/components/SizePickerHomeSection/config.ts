/**
 * Configuración por defecto para SizePickerHomeSection.
 * Fuente de verdad para sizes y quiz; mantiene UI desacoplada.
 */

import type { SizeOption, QuizConfig, RouteBuilders } from './types'

/** Tamaños populares (fondos 2.90m y 1.50m más usados) */
export const DEFAULT_SIZES: SizeOption[] = [
  {
    id: 'S2920',
    label: '2,9m × 2m',
    widthM: 2.9,
    heightM: 2,
    fromPrice: 51307,
    bestFor: ['Estudio chico', 'Newborn'],
    depthLevel: 'Baja',
    lightingHint: 'Flash friendly',
    badges: ['Ideal estudio chico'],
  },
  {
    id: 'S2930',
    label: '2,9m × 3m',
    widthM: 2.9,
    heightM: 3,
    fromPrice: 66783,
    bestFor: ['Cumples', 'Decoración'],
    depthLevel: 'Media',
    lightingHint: 'Flash friendly',
    badges: ['Más elegido'],
  },
  {
    id: 'S2950',
    label: '2,9m × 5m',
    widthM: 2.9,
    heightM: 5,
    fromPrice: 110958,
    bestFor: ['Salón/evento', 'Grupos grandes'],
    depthLevel: 'Alta',
    lightingHint: 'Ideal luz natural',
    badges: ['Eventos'],
  },
  {
    id: 'S1520',
    label: '1,5m × 2m',
    widthM: 1.5,
    heightM: 2,
    fromPrice: 32718,
    bestFor: ['Retratos', 'Producto'],
    depthLevel: 'Baja',
    lightingHint: 'Flash friendly',
    badges: ['Compacto'],
  },
]

/** Configuración del quiz guiado */
export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  questions: [
    {
      id: 'use',
      label: '¿Qué vas a fotografiar/decorar?',
      options: [
        { id: 'newborn', label: 'Newborn' },
        { id: 'cumple', label: 'Cumple infantil' },
        { id: 'pareja', label: 'Pareja' },
        { id: 'producto', label: 'Producto' },
        { id: 'evento', label: 'Evento' },
      ],
    },
    {
      id: 'space',
      label: '¿Dónde lo vas a usar?',
      options: [
        { id: 'estudio_chico', label: 'Estudio chico' },
        { id: 'estudio_grande', label: 'Estudio grande' },
        { id: 'salon_evento', label: 'Salón/evento' },
        { id: 'exterior_mixto', label: 'Exterior/mixto' },
      ],
    },
    {
      id: 'preference',
      label: '¿Qué buscás?',
      options: [
        { id: 'mas_profundidad', label: 'Más profundidad' },
        { id: 'minimalista', label: 'Minimalista' },
        { id: 'super_detallado', label: 'Súper detallado' },
        { id: 'facil_iluminar', label: 'Fácil de iluminar' },
      ],
    },
  ],
  rules: [
    // Estudio chico + newborn → priorizar 2,9×2 o 2,9×2,10
    {
      conditions: { space: 'estudio_chico', use: 'newborn' },
      priority: 100,
      sizeIds: ['S2920', 'S2930'],
      reason: 'Altura suficiente para zona segura y encuadres newborn en espacios reducidos.',
    },
    // Estudio chico + cumple
    {
      conditions: { space: 'estudio_chico', use: 'cumple' },
      priority: 90,
      sizeIds: ['S2930', 'S2920'],
      reason: 'Perfecto para cumples y detalles en estudios pequeños.',
    },
    // Salón/evento → 5×2,5
    {
      conditions: { space: 'salon_evento' },
      priority: 95,
      sizeIds: ['S2950', 'S2940'],
      reason: 'Ideal para grupos grandes y decoración de eventos.',
    },
    // Estudio grande + evento
    {
      conditions: { space: 'estudio_grande', use: 'evento' },
      priority: 85,
      sizeIds: ['S2950', 'S2940'],
      reason: 'Máxima versatilidad para eventos en espacios amplios.',
    },
    // Exterior/mixto
    {
      conditions: { space: 'exterior_mixto' },
      priority: 80,
      sizeIds: ['S2950', 'S2930'],
      reason: 'Buen balance para uso indoor y outdoor.',
    },
    // Producto → compacto
    {
      conditions: { use: 'producto' },
      priority: 85,
      sizeIds: ['S1520', 'S2920'],
      reason: 'Tamaño compacto ideal para fotografía de producto.',
    },
    // Pareja en estudio chico
    {
      conditions: { space: 'estudio_chico', use: 'pareja' },
      priority: 88,
      sizeIds: ['S2920', 'S2930'],
      reason: 'Encaja perfecto para parejas en espacios reducidos.',
    },
    // Fallback: estudio chico
    {
      conditions: { space: 'estudio_chico' },
      priority: 50,
      sizeIds: ['S2930', 'S2920'],
      reason: 'Los más elegidos para estudios pequeños.',
    },
    // Fallback: estudio grande
    {
      conditions: { space: 'estudio_grande' },
      priority: 45,
      sizeIds: ['S2930', 'S2950'],
      reason: 'Versatilidad para cualquier tipo de sesión.',
    },
  ],
}

/** Builders de rutas por defecto (rutas reales del proyecto) */
export const DEFAULT_ROUTES: RouteBuilders = {
  designCatalog: (size) => `/design-catalog?size=${encodeURIComponent(size)}`,
  studio: (size) => `/design-catalog?size=${encodeURIComponent(size)}&view=studio`,
  prices: () => '/prices',
}
