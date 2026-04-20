// ── SERVER ONLY — No cookies, safe for all Server Components ──
import { createSupabasePublicClient } from './supabase-server'
import { DatabaseError } from './errors'
import { logger } from './logger'
import { PAGINATION } from '@/constants'
import { SELECT_PROPERTY } from './properties-queries'
import type { Property, PropertyFilters, PaginatedResponse } from '@/types'

export async function getProperties(
  filters?: PropertyFilters,
  page = 1
): Promise<PaginatedResponse<Property>> {
  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE
  const supabase = createSupabasePublicClient()

  let query = supabase
    .from('properties')
    .select(SELECT_PROPERTY, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters?.type && filters.type !== 'all') query = query.eq('type', filters.type)
  if (filters?.minPrice)  query = query.gte('price', filters.minPrice)
  if (filters?.maxPrice)  query = query.lte('price', filters.maxPrice)
  if (filters?.city)      query = query.ilike('city', `%${filters.city}%`)
  if (filters?.bedrooms)  query = query.gte('bedrooms', filters.bedrooms)
  if (filters?.minArea)   query = query.gte('area', filters.minArea)
  if (filters?.maxArea)   query = query.lte('area', filters.maxArea)

  const from = (page - 1) * pageSize
  const { data, count, error } = await query.range(from, from + pageSize - 1)

  if (error) {
    logger.error('getProperties failed', { error: error.message, filters })
    throw new DatabaseError('Error al obtener propiedades', error.message)
  }

  return { data: (data as Property[]) ?? [], count: count ?? 0, page, pageSize }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT_PROPERTY)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) {
    // PGRST116 = no rows found — not an error worth logging
    if (error.code !== 'PGRST116') {
      logger.warn('getPropertyBySlug failed', { slug, error: error.message })
    }
    return null
  }
  return data as Property
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT_PROPERTY)
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    logger.warn('getFeaturedProperties failed', { error: error.message })
    return []
  }
  return (data as Property[]) ?? []
}

export async function getAllPropertySlugs(): Promise<string[]> {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('properties')
    .select('slug')
    .eq('status', 'active')

  if (error) {
    logger.warn('getAllPropertySlugs failed', { error: error.message })
    return []
  }
  return data?.map((p) => p.slug) ?? []
}

export async function getDistinctCities(): Promise<string[]> {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('properties')
    .select('city')
    .eq('status', 'active')

  if (error) {
    logger.warn('getDistinctCities failed', { error: error.message })
    return []
  }
  const unique = Array.from(new Set(data?.map((p) => p.city).filter(Boolean) ?? []))
  return unique.sort()
}
