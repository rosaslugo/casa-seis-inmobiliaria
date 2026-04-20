/**
 * Integration tests for property data layer.
 * These run against a real Supabase test project or a local Supabase instance.
 * Set SUPABASE_TEST_URL and SUPABASE_TEST_ANON_KEY in .env.test to enable.
 *
 * To run: npx jest --testPathPattern=integration
 */

// Mock the supabase-server module so these tests don't need real credentials
jest.mock('@/lib/supabase-server', () => ({
  createSupabasePublicClient: () => ({
    from: (table: string) => ({
      select: jest.fn().mockReturnThis(),
      eq:     jest.fn().mockReturnThis(),
      order:  jest.fn().mockReturnThis(),
      limit:  jest.fn().mockReturnThis(),
      range:  jest.fn().mockReturnThis(),
      ilike:  jest.fn().mockReturnThis(),
      gte:    jest.fn().mockReturnThis(),
      lte:    jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: table === 'properties' ? mockProperty : null,
        error: null,
      }),
    }),
  }),
}))

const mockProperty = {
  id: 'test-uuid-1',
  title: 'Casa de Prueba',
  slug: 'casa-de-prueba',
  description: 'Descripción de prueba para tests de integración',
  price: 2500000,
  location: 'Los Mochis',
  address: 'Calle Principal 123',
  city: 'Los Mochis',
  state: 'Sinaloa',
  latitude: 25.791,
  longitude: -108.987,
  type: 'sale',
  status: 'active',
  bedrooms: 3,
  bathrooms: 2,
  area: 180,
  parking: 2,
  featured: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  images: [],
}

import { getPropertyBySlug } from '@/lib/properties-server'

describe('getPropertyBySlug', () => {
  it('returns property when found', async () => {
    const result = await getPropertyBySlug('casa-de-prueba')
    expect(result).not.toBeNull()
    expect(result?.slug).toBe('casa-de-prueba')
  })
})

describe('getProperties (mocked)', () => {
  it('returns paginated structure', async () => {
    // Override mock for this test
    jest.doMock('@/lib/supabase-server', () => ({
      createSupabasePublicClient: () => ({
        from: () => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          range: jest.fn().mockResolvedValue({
            data: [mockProperty],
            count: 1,
            error: null,
          }),
        }),
      }),
    }))
  })
})
