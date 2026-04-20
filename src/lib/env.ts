/**
 * Env validator — fail fast, fail loud.
 *
 * PROBLEMA QUE RESUELVE:
 *   Antes, cada archivo hacía `process.env.NEXT_PUBLIC_SUPABASE_URL!` (con el `!`
 *   de TypeScript). Si la variable faltaba en Vercel, el proceso seguía con
 *   `undefined` y el error salía mucho después, críptico, en runtime —
 *   típicamente un "fetch failed" o "Invalid URL" dentro del middleware,
 *   y como el middleware corre antes que las páginas, TODO el sitio
 *   devolvía 500 sin pista clara.
 *
 * CÓMO FUNCIONA AHORA:
 *   `assertEnv()` corre una sola vez al iniciar el servidor (lo llama layout.tsx).
 *   Si falta cualquier env requerida, lanza un error claro que aparece ARRIBA
 *   en los logs de Vercel:
 *
 *     ❌ Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 *   `env` es el objeto tipado que puedes importar desde cualquier parte:
 *     import { env } from '@/lib/env'
 *     const url = env.NEXT_PUBLIC_SUPABASE_URL  // typed, never undefined
 */

// ── Envs obligatorias (sin ellas la app no funciona) ────────────
const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

// ── Envs opcionales (la app funciona con degradación si faltan) ──
const OPTIONAL = [
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', // sin esto, el mapa muestra placeholder
  'NEXT_PUBLIC_SITE_URL',            // sin esto, usa fallback 'https://casaseis.mx'
  'UPSTASH_REDIS_REST_URL',          // sin esto, rate limit cae a Map en memoria
  'UPSTASH_REDIS_REST_TOKEN',
  'RESEND_API_KEY',                  // sin esto, form de contacto solo logea
  'REVALIDATION_SECRET',             // sin esto, /api/revalidate está abierto (riesgo menor)
] as const

type RequiredKey = (typeof REQUIRED)[number]
type OptionalKey = (typeof OPTIONAL)[number]
type AllKeys = RequiredKey | OptionalKey

/**
 * Llamar una vez al startup (desde layout.tsx). Lanza si falta algo requerido.
 * Corre SOLO en server (layout.tsx lo protege con `typeof window === 'undefined'`).
 */
export function assertEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key])

  if (missing.length > 0) {
    const message =
      `❌ Missing required env vars: ${missing.join(', ')}\n` +
      `   Set them in Vercel → Project → Settings → Environment Variables.\n` +
      `   See .env.local.example for the full list.`

    // En desarrollo: lanzar para que se note enseguida.
    // En producción (Vercel): lanzar también — mejor un 500 claro que un sitio roto silenciosamente.
    throw new Error(message)
  }
}

/**
 * Acceso tipado a variables de entorno.
 * Uso:
 *   import { env } from '@/lib/env'
 *   const url = env.NEXT_PUBLIC_SUPABASE_URL
 *
 * Todas las requeridas están garantizadas (non-null) porque `assertEnv()`
 * ya se ejecutó al boot.
 */
export const env = {
  NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL      as string,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY     as string,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_SITE_URL:            process.env.NEXT_PUBLIC_SITE_URL,
  UPSTASH_REDIS_REST_URL:          process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN:        process.env.UPSTASH_REDIS_REST_TOKEN,
  RESEND_API_KEY:                  process.env.RESEND_API_KEY,
  REVALIDATION_SECRET:             process.env.REVALIDATION_SECRET,
} satisfies Record<AllKeys, string | undefined>
