import { createBrowserClient } from '@supabase/ssr'
import { logger } from './logger'
import { IMAGE_STORAGE_BUCKET, MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_TYPES } from '@/constants'

export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Sube una imagen a Supabase Storage con nombre único (UUID).
 *
 * CAMBIOS vs versión original:
 *  - Nombre: `propertyId/crypto.randomUUID().ext` → URL siempre nueva → sin stale cache
 *  - cacheControl: '3600' → '31536000' (1 año) — seguro porque el nombre es inmutable
 *  - Retorna también `path` (el path dentro del bucket) para poder borrar el archivo
 */
export async function uploadPropertyImage(
  file: File,
  propertyId: string
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      url: null,
      path: null,
      error: `El archivo supera el límite de ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`,
    }
  }
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return { url: null, path: null, error: 'Tipo de archivo no permitido. Use JPG, PNG o WebP.' }
  }

  const supabase = createSupabaseClient()
  const fileExt  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'

  // UUID garantiza unicidad absoluta → cada subida tiene una URL distinta
  // → el cache de Next.js y el navegador nunca sirven la imagen vieja
  const storagePath = `${propertyId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from(IMAGE_STORAGE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '31536000', // 1 año — seguro porque storagePath es inmutable
      upsert: false,
    })

  if (uploadError) {
    logger.error('Image upload failed', { propertyId, storagePath, error: uploadError.message })
    return { url: null, path: null, error: uploadError.message }
  }

  const { data } = supabase.storage.from(IMAGE_STORAGE_BUCKET).getPublicUrl(storagePath)
  logger.info('Image uploaded', { propertyId, storagePath })
  return { url: data.publicUrl, path: storagePath, error: null }
}

/**
 * Elimina un archivo de Supabase Storage por su path relativo dentro del bucket.
 * Siempre llama esto ANTES de borrar el registro en la tabla `images`.
 */
export async function deletePropertyImageFromStorage(
  storagePath: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseClient()
  const { error } = await supabase.storage.from(IMAGE_STORAGE_BUCKET).remove([storagePath])
  if (error) {
    logger.error('Image delete from storage failed', { storagePath, error: error.message })
  }
  return { error: error?.message ?? null }
}

/**
 * Extrae el path relativo (dentro del bucket) desde una URL pública de Supabase.
 *
 * Ejemplo:
 *   input:  "https://xyz.supabase.co/storage/v1/object/public/property-images/abc/uuid.jpg"
 *   output: "abc/uuid.jpg"
 *
 * Retorna null si la URL no pertenece al bucket esperado.
 */
export function extractStoragePath(publicUrl: string): string | null {
  try {
    const marker = `/object/public/${IMAGE_STORAGE_BUCKET}/`
    const idx    = publicUrl.indexOf(marker)
    if (idx === -1) return null
    return publicUrl.slice(idx + marker.length)
  } catch {
    return null
  }
}

// Alias mantenido por compatibilidad con imports existentes en supabase.ts
export async function deletePropertyImage(path: string): Promise<{ error: string | null }> {
  return deletePropertyImageFromStorage(path)
}
