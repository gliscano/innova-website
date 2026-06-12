/**
 * Configuración por defecto para SizePickerHomeSection.
 * Fuente de verdad para sizes y quiz; mantiene UI desacoplada.
 */

import type { SizeOption, QuizConfig } from '../components/SizePickerHomeSection/types'

/** Tamaños populares (fondos 2.90m y 1.50m más vendidos) */
export const DEFAULT_SIZES: SizeOption[] = [
  {
    id: 'S2920',
    label: '2.9m × 2m',
    widthM: 2.9,
    heightM: 2.0,
    fromPrice: 61000,
    bestFor: ['Estudio chico', 'Newborn', 'Infantil', 'Retratos', 'Home studio'],
    depthLevel: 'Baja',
    lightingHint: 'Flash de estudio o luz continua',
    badges: ['Más vendido', 'Ideal estudio chico'],
  },
  {
    id: 'S2930',
    label: '2.9m × 3m',
    widthM: 2.9,
    heightM: 3.0,
    fromPrice: 87000,
    bestFor: ['Sesiones familiares', 'Smash cake', 'Cumpleaños', 'Parejas', 'Decoración'],
    depthLevel: 'Media',
    lightingHint: 'Flash o luz natural lateral',
    badges: ['Más versátil', 'Recomendado'],
  },
  {
    id: 'S2940',
    label: '2.9m × 4m',
    widthM: 2.9,
    heightM: 4.0,
    fromPrice: 108000,
    bestFor: ['Decoración de eventos', 'Cumpleaños temáticos', 'Salón de fiestas', 'Set pared + piso', 'Grupos'],
    depthLevel: 'Alta',
    lightingHint: 'Flash con difusor o luz natural',
    badges: ['Decoradores', 'Set Profesional'],
  },
  {
    id: 'S2950',
    label: '2.9m × 5m',
    widthM: 2.9,
    heightM: 5.0,
    fromPrice: 128000,
    bestFor: ['Salón de fiestas', 'Decoración amplia', 'Grupos grandes', 'Pared completa'],
    depthLevel: 'Alta',
    lightingHint: 'Flash con difusor o iluminación múltiple',
    badges: ['Gran formato', 'Para eventos'],
  },
  {
    id: 'S1520',
    label: '1.5m × 2m',
    widthM: 1.5,
    heightM: 2.0,
    fromPrice: 39000,
    bestFor: ['Retratos', 'Newborn', 'Fotografía de producto', 'Home studio'],
    depthLevel: 'Baja',
    lightingHint: 'Flash de estudio o luz continua',
    badges: ['Compacto', 'Económico'],
  },
];


/** Configuración del quiz guiado */
export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  questions: [
    {
      id: 'use',
      label: '¿Qué vas a fotografiar/decorar?',
      options: [
        { id: 'cumple', label: 'Cumple infantil' },
        { id: 'pareja', label: 'Pareja' },
        { id: 'producto', label: 'Producto' },
        { id: 'evento', label: 'Evento' },
        { id: 'newborn', label: 'Newborn' },
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
    // Estudio chico + newborn → priorizar 2,9×2
    {
      conditions: { use: 'newborn' },
      priority: 100,
      sizeIds: ['S1520'],
      reason: 'Altura suficiente para zona segura y encuadres newborn en espacios reducidos.',
    },
    {
      conditions: { space: 'estudio_chico', use: 'newborn' },
      priority: 100,
      sizeIds: ['S1520'],
      reason: 'Altura suficiente para zona segura y encuadres newborn en espacios reducidos.',
    },
    // Estudio chico + cumple
    {
      conditions: { space: 'estudio_chico', use: 'cumple' },
      priority: 90,
      sizeIds: ['S2930', 'S2920'],
      reason: 'Perfecto para cumples y detalles en estudios pequeños.',
    },
    // Salón/evento → 2.9×3.5 o 2.9×3
    {
      conditions: { space: 'salon_evento' },
      priority: 95,
      sizeIds: ['S2940', 'S2930'],
      reason: 'Ideal para grupos grandes y decoración de eventos.',
    },
    // Estudio grande + evento
    {
      conditions: { space: 'estudio_grande', use: 'evento' },
      priority: 85,
      sizeIds: ['S2940', 'S2930'],
      reason: 'Máxima versatilidad para eventos en espacios amplios.',
    },
    // Exterior/mixto
    {
      conditions: { space: 'exterior_mixto' },
      priority: 80,
      sizeIds: ['S2940', 'S2930'],
      reason: 'Buen balance para uso interior y exterior.',
    },
    // Producto → compacto
    {
      conditions: { use: 'producto' },
      priority: 85,
      sizeIds: ['S1520'],
      reason: 'Tamaño compacto ideal para fotografía de producto.',
    },
    // Pareja en estudio chico
    {
      conditions: { space: 'estudio_chico', use: 'pareja' },
      priority: 88,
      sizeIds: ['S2930', 'S2920'],
      reason: 'Encaja perfecto para parejas en espacios reducidos.',
    },
    // Fallback: estudio chico
    {
      conditions: { space: 'estudio_chico' },
      priority: 50,
      sizeIds: ['S2920'],
      reason: 'El más vendido para estudios pequeños.',
    },
    // Fallback: estudio grande
    {
      conditions: { space: 'estudio_grande' },
      priority: 45,
      sizeIds: ['S2930', 'S2940'],
      reason: 'Versatilidad para cualquier tipo de sesión.',
    },
  ],
}
