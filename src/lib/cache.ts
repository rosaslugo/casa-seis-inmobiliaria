// ── Next.js fetch cache helpers ───────────────────────────────
// Centralises revalidation tags so they're never typo'd.
//
// CAMBIO: property(slug) estaba DENTRO de CACHE_TAGS como método,
// pero `Object.values(CACHE_TAGS).includes(tag)` de /api/revalidate
// nunca podía matchear un string porque `property` era una función.
// Ahora separamos los tags estáticos (array comparable) de la
// función generadora de tags por-slug.

export const CACHE_TAGS = {
  properties:    'properties',
  featuredProps: 'featured-properties',
  cities:        'cities',
} as const

/** Tag dinámico para invalidar una propiedad específica */
export const propertyTag = (slug: string): string => `property-${slug}`

/** Todos los tags estáticos — usar para validar input de /api/revalidate */
export const ALL_STATIC_TAGS = Object.values(CACHE_TAGS) as readonly string[]

export const REVALIDATE = {
  properties: 60,       // 1 minute
  featured:   300,      // 5 minutes
  static:     86_400,   // 24 hours
} as const
