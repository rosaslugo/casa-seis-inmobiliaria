import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS, ALL_STATIC_TAGS, propertyTag } from '@/lib/cache'
import { logger } from '@/lib/logger'

/**
 * Webhook endpoint: llamar desde el admin después de guardar/borrar,
 * o desde un trigger de Supabase. Protegido por REVALIDATION_SECRET.
 *
 * Uso desde el admin (ejemplo):
 *   await fetch('/api/revalidate', {
 *     method: 'POST',
 *     headers: { Authorization: `Bearer ${SECRET}` },
 *     body: JSON.stringify({ tag: 'properties' })
 *     // o: body: JSON.stringify({ slug: 'casa-dorada' })  para invalidar una sola
 *   })
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  // Si REVALIDATION_SECRET no está configurado, rechazamos todo por seguridad.
  const secret = process.env.REVALIDATION_SECRET
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json() as { tag?: string; slug?: string }

    // Caso 1: invalidar una propiedad específica por slug
    if (body.slug) {
      const tag = propertyTag(body.slug)
      revalidateTag(tag)
      logger.info('Cache revalidated (single property)', { slug: body.slug, tag })
      return NextResponse.json({ revalidated: true, tag })
    }

    // Caso 2: invalidar un tag estático específico
    if (body.tag && ALL_STATIC_TAGS.includes(body.tag)) {
      revalidateTag(body.tag)
      logger.info('Cache revalidated', { tag: body.tag })
      return NextResponse.json({ revalidated: true, tag: body.tag })
    }

    // Caso 3: por defecto, invalidar todos los tags de propiedades
    revalidateTag(CACHE_TAGS.properties)
    revalidateTag(CACHE_TAGS.featuredProps)
    revalidateTag(CACHE_TAGS.cities)
    logger.info('All property caches revalidated')

    return NextResponse.json({ revalidated: true, tag: 'all' })
  } catch (error) {
    logger.error('Revalidation error', { error: String(error) })
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
