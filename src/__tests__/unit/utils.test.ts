import {
  formatPrice,
  formatPriceShort,
  generateSlug,
  truncate,
  getPropertyThumbnail,
  formatDate,
  getTypeLabel,
  getStatusLabel,
} from '@/lib/utils'

describe('formatPrice', () => {
  it('formats sale price without suffix', () => {
    expect(formatPrice(2500000, 'sale')).toBe('$2,500,000')
  })
  it('formats rent price with /mes suffix', () => {
    expect(formatPrice(15000, 'rent')).toContain('/mes')
  })
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0')
  })
})

describe('formatPriceShort', () => {
  it('formats millions correctly', () => {
    expect(formatPriceShort(2500000)).toBe('$2.5M')
  })
  it('formats thousands correctly', () => {
    expect(formatPriceShort(15000)).toBe('$15K')
  })
  it('formats small numbers', () => {
    expect(formatPriceShort(500)).toBe('$500')
  })
})

describe('generateSlug', () => {
  it('converts spaces to hyphens', () => {
    expect(generateSlug('Casa Moderna')).toBe('casa-moderna')
  })
  it('removes accents', () => {
    expect(generateSlug('Habitación Principal')).toBe('habitacion-principal')
  })
  it('removes special characters', () => {
    expect(generateSlug('Casa #1 con (jardín)')).toBe('casa-1-con-jardin')
  })
  it('collapses multiple hyphens', () => {
    expect(generateSlug('Casa   Triple   Espacio')).toBe('casa-triple-espacio')
  })
})

describe('truncate', () => {
  it('does not truncate short strings', () => {
    expect(truncate('Hola', 10)).toBe('Hola')
  })
  it('truncates long strings with ellipsis', () => {
    const result = truncate('Esta es una descripción muy larga', 10)
    expect(result).toHaveLength(11) // 10 chars + ellipsis
    expect(result.endsWith('…')).toBe(true)
  })
})

describe('getPropertyThumbnail', () => {
  it('returns fallback when no images', () => {
    expect(getPropertyThumbnail([])).toBe('/placeholder-property.svg')
    expect(getPropertyThumbnail(undefined)).toBe('/placeholder-property.svg')
  })
  it('returns first image by order', () => {
    const images = [
      { image_url: 'second.jpg', order: 2 },
      { image_url: 'first.jpg',  order: 1 },
    ]
    expect(getPropertyThumbnail(images)).toBe('first.jpg')
  })
})

describe('getTypeLabel', () => {
  it('maps sale correctly', () => expect(getTypeLabel('sale')).toBe('Venta'))
  it('maps rent correctly', () => expect(getTypeLabel('rent')).toBe('Renta'))
})

describe('getStatusLabel', () => {
  it('maps known statuses', () => {
    expect(getStatusLabel('active')).toBe('Activo')
    expect(getStatusLabel('sold')).toBe('Vendido')
    expect(getStatusLabel('rented')).toBe('Rentado')
    expect(getStatusLabel('inactive')).toBe('Inactivo')
  })
  it('returns unknown status as-is', () => {
    expect(getStatusLabel('unknown')).toBe('unknown')
  })
})
