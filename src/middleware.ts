import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware de auth para rutas /admin/*.
 *
 * CAMBIOS vs versión anterior:
 *   1. Guard defensivo: si faltan envs, no crashea TODO el sitio —
 *      solo deja pasar la request (las páginas admin mostrarán error
 *      controlado en vez de 500 silencioso).
 *
 *   2. `getUser()` en lugar de `getSession()`:
 *      - getSession() solo lee la cookie (no valida el JWT)
 *      - getUser() hace una petición a Supabase que VALIDA el token
 *      - La docs de @supabase/ssr recomienda explícitamente getUser()
 *        en server-side para evitar sesiones falsificadas.
 */
export async function middleware(req: NextRequest) {
  const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Defensive guard — si faltan envs, no rompas el sitio.
  // Log claro en Vercel logs, y dejar pasar la request sin tocar auth.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '[middleware] Missing Supabase env vars. ' +
      'Auth on /admin is DISABLED until you set NEXT_PUBLIC_SUPABASE_URL ' +
      'and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.'
    )
    return NextResponse.next()
  }

  let res = NextResponse.next({ request: { headers: req.headers } })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) { return req.cookies.get(name)?.value },
      set(name: string, value: string, options: CookieOptions) {
        req.cookies.set({ name, value, ...options })
        res = NextResponse.next({ request: { headers: req.headers } })
        res.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        req.cookies.set({ name, value: '', ...options })
        res = NextResponse.next({ request: { headers: req.headers } })
        res.cookies.set({ name, value: '', ...options })
      },
    },
  })

  // getUser() valida el JWT contra Supabase (más seguro que getSession())
  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !user) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
