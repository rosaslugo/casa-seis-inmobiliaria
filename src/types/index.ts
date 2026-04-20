// ============================================================
// Database Types (mirrors Supabase schema)
// ============================================================

export type PropertyType = 'sale' | 'rent'

export type PropertyStatus = 'active' | 'sold' | 'rented' | 'inactive'

export interface Property {
  id: string
  title: string
  slug: string
  description: string
  price: number
  location: string
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
  type: PropertyType
  status: PropertyStatus
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  featured: boolean
  created_at: string
  updated_at: string
  images?: PropertyImage[]
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  alt_text: string | null
  order: number
  created_at: string
}

// ============================================================
// Form Types
// ============================================================

export interface PropertyFormData {
  title: string
  slug: string
  description: string
  price: number
  location: string
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
  type: PropertyType
  status: PropertyStatus
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  featured: boolean
}

// ============================================================
// Filter Types
// ============================================================

export interface PropertyFilters {
  type?: PropertyType | 'all'
  minPrice?: number
  maxPrice?: number
  city?: string
  bedrooms?: number
  minArea?: number
  maxArea?: number
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}

// ============================================================
// Navigation Types
// ============================================================

export interface NavItem {
  label: string
  href: string
}
