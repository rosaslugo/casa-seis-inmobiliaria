// ── CLIENT SAFE — safe in both Server and Client Components ──
import { createSupabaseClient } from './supabase-client'
import { logger } from './logger'
import { SELECT_PROPERTY } from './properties-queries'
import type { Property } from '@/types'
import type { PropertyFormData } from './validations'

export async function adminGetAllProperties(): Promise<Property[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT_PROPERTY)
    .order('created_at', { ascending: false })
  if (error) {
    logger.error('adminGetAllProperties failed', { error: error.message })
    throw new Error(error.message)
  }
  return (data as Property[]) ?? []
}

export async function adminCreateProperty(
  formData: PropertyFormData
): Promise<{ id: string | null; error: string | null }> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...formData, updated_at: new Date().toISOString() }])
    .select('id')
    .single()
  if (error) {
    logger.error('adminCreateProperty failed', { error: error.message })
    return { id: null, error: error.message }
  }
  logger.info('Property created', { id: data.id, title: formData.title })
  return { id: data.id, error: null }
}

export async function adminUpdateProperty(
  id: string,
  formData: Partial<PropertyFormData>
): Promise<{ error: string | null }> {
  const supabase = createSupabaseClient()
  const { error } = await supabase
    .from('properties')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) logger.error('adminUpdateProperty failed', { id, error: error.message })
  return { error: error?.message ?? null }
}

export async function adminDeleteProperty(id: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseClient()

  // 1. Fetch all images for this property before deleting
  const { data: images } = await supabase
    .from('images')
    .select('image_url')
    .eq('property_id', id)

  // 2. Delete files from Storage (best-effort — don't block on failure)
  if (images && images.length > 0) {
    const { extractStoragePath, deletePropertyImageFromStorage } = await import('./supabase-client')
    for (const img of images) {
      const path = extractStoragePath(img.image_url)
      if (path) {
        const { error: storageErr } = await deletePropertyImageFromStorage(path)
        if (storageErr) logger.warn('Storage cleanup warning on property delete', { id, path, storageErr })
      }
    }
  }

  // 3. Delete property record (images cascade via FK)
  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) logger.error('adminDeleteProperty failed', { id, error: error.message })
  else logger.info('Property deleted with images cleaned', { id, imageCount: images?.length ?? 0 })
  return { error: error?.message ?? null }
}

export async function adminAddPropertyImage(
  propertyId: string,
  imageUrl: string,
  order: number,
  altText?: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseClient()
  const { error } = await supabase.from('images').insert([{
    property_id: propertyId,
    image_url: imageUrl,
    order,
    alt_text: altText ?? null,
  }])
  if (error) logger.error('adminAddPropertyImage failed', { propertyId, error: error.message })
  return { error: error?.message ?? null }
}

export async function adminDeletePropertyImage(imageId: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseClient()
  const { error } = await supabase.from('images').delete().eq('id', imageId)
  if (error) logger.error('adminDeletePropertyImage failed', { imageId, error: error.message })
  return { error: error?.message ?? null }
}
