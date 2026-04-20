import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente público SIN cookies, para Server Components que leen datos públicos
 * (listado de propiedades, featured, ciudades, etc.).
 *
 * CAMBIO IMPORTANTE — ISR respeta el cache de fetch:
 *
 *   ANTES: forzábamos `cache: 'no-store'` en el fetch interno de Supabase.
 *          Esto hacía que las páginas se marcaran como DINÁMICAS en Next.js
 *          (incluso con `export const revalidate = 300`), porque el runtime
 *          detecta el no-store como opt-out de todo caching. Resultado:
 *          cada visita = 1 fetch a Supabase → más lento y más caro en Vercel.
 *
 *   AHORA: dejamos que Next.js cachee el fetch según el `revalidate` de la
 *          página (5 min en home, 60s en detalle). Para invalidar cuando
 *          creas/editas una propiedad en el admin, llamar POST /api/revalidate
 *          con el tag correspondiente.
 *
 * Si en algún caso puntual necesitas datos fresh (sin cache), usa la
 * función `createSupabaseNoCacheClient` de más abajo.
 */
export function createSupabasePublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        // Etiquetamos los fetches para que /api/revalidate pueda invalidar
        // y respetamos el revalidate de cada página.
        fetch: (url, options = {}) =>
          fetch(url, {
            ...options,
            next: { tags: ['properties'], revalidate: 60 },
          }),
      },
    }
  )
}

/**
 * Cliente público SIN cache — úsalo solo si necesitas datos fresh
 * (ej: endpoints /api/health, dashboards admin con stats live).
 */
export function createSupabaseNoCacheClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, options = {}) =>
          fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  )
}

// ── Session-aware client — usa cookies, SOLO para auth en páginas admin ──
export function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookies().set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookies().set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )
}
