// ── App-wide constants — single source of truth ──────────────

export const SITE_NAME     = 'Casa Seis Inmobiliaria'
export const SITE_PHONE    = '+52 668 116 3380'
export const SITE_PHONE_WA = '526681163380'
export const SITE_EMAIL    = 'casaseisinmobiliaria@hotmail.com'
export const SITE_ADDRESS  = 'Los Mochis, Sinaloa, México'

export const SITE_FACEBOOK  = 'https://www.facebook.com/CasaSeisLM/'
export const SITE_INSTAGRAM = 'https://www.instagram.com/casaseislm/'

export const SITE_HOURS = 'Lun – Sáb · 8:30–13:30 / 15:30–18:30'

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
} as const

export const PROPERTY_TYPES = {
  sale: 'Venta',
  rent: 'Renta',
} as const

export const PROPERTY_STATUSES = {
  active:   'Activo',
  sold:     'Vendido',
  rented:   'Rentado',
  inactive: 'Inactivo',
} as const

export const IMAGE_STORAGE_BUCKET = 'property-images'

export const MAX_IMAGE_SIZE_MB    = 5
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ALLOWED_IMAGE_TYPES  = ['image/jpeg', 'image/png', 'image/webp'] as const

export const PRICE_RANGES = [
  { value: '',              label: 'Cualquier precio' },
  { value: '0-1000000',    label: 'Hasta $1M' },
  { value: '1000000-3000000', label: '$1M – $3M' },
  { value: '3000000-6000000', label: '$3M – $6M' },
  { value: '6000000-',     label: 'Más de $6M' },
] as const

export const BEDROOM_OPTIONS = [
  { value: '',  label: 'Cualquier' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
] as const
