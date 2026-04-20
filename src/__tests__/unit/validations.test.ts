import { propertySchema, slugSchema, contactSchema, imageFileSchema } from '@/lib/validations'

describe('slugSchema', () => {
  it('accepts valid slugs', () => {
    expect(slugSchema.safeParse('casa-moderna-centro').success).toBe(true)
    expect(slugSchema.safeParse('prop-123').success).toBe(true)
  })
  it('rejects uppercase', () => {
    expect(slugSchema.safeParse('Casa-Moderna').success).toBe(false)
  })
  it('rejects spaces', () => {
    expect(slugSchema.safeParse('casa moderna').success).toBe(false)
  })
  it('rejects leading/trailing hyphens', () => {
    expect(slugSchema.safeParse('-casa').success).toBe(false)
    expect(slugSchema.safeParse('casa-').success).toBe(false)
  })
  it('rejects short slugs', () => {
    expect(slugSchema.safeParse('ab').success).toBe(false)
  })
})

describe('propertySchema', () => {
  const validProperty = {
    title: 'Casa Moderna en el Centro',
    slug: 'casa-moderna-centro',
    description: 'Hermosa propiedad con acabados de primera calidad en zona céntrica.',
    price: 2500000,
    location: 'Los Mochis, Sinaloa',
    address: 'Av. Obregón 123',
    city: 'Los Mochis',
    state: 'Sinaloa',
    latitude: 25.791,
    longitude: -108.987,
    type: 'sale' as const,
    status: 'active' as const,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    parking: 2,
    featured: false,
  }

  it('accepts a valid property', () => {
    expect(propertySchema.safeParse(validProperty).success).toBe(true)
  })
  it('rejects negative price', () => {
    expect(propertySchema.safeParse({ ...validProperty, price: -1 }).success).toBe(false)
  })
  it('rejects invalid coordinates', () => {
    expect(propertySchema.safeParse({ ...validProperty, latitude: 200 }).success).toBe(false)
    expect(propertySchema.safeParse({ ...validProperty, longitude: -200 }).success).toBe(false)
  })
  it('rejects invalid type', () => {
    expect(propertySchema.safeParse({ ...validProperty, type: 'unknown' }).success).toBe(false)
  })
  it('rejects short description', () => {
    expect(propertySchema.safeParse({ ...validProperty, description: 'Corta' }).success).toBe(false)
  })
})

describe('contactSchema', () => {
  it('accepts valid contact data', () => {
    expect(contactSchema.safeParse({
      name: 'Juan García',
      email: 'juan@ejemplo.com',
      message: 'Estoy interesado en una propiedad.',
    }).success).toBe(true)
  })
  it('rejects invalid email', () => {
    expect(contactSchema.safeParse({
      name: 'Juan',
      email: 'no-es-email',
      message: 'Mensaje de prueba',
    }).success).toBe(false)
  })
})
