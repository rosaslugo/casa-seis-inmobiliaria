# Casa Seis — Changelog de fixes

## 🔥 Fixes aplicados en esta iteración (17 abr 2026)

Todos los cambios de esta ronda son **retrocompatibles**: si tenías el sitio
desplegado antes, al hacer `git pull` + `npm install` + redeploy todo sigue
funcionando. La home cambia visualmente (rediseño del hero), pero el resto
de páginas se mantienen idénticas.

---

### Bloque 1 — Deploy en Vercel

#### FIX 1 — Carpeta basura `{src/` ❌→✅
Había directorios vacíos en la raíz con llaves literales en el nombre
(`{src/`, `{app/`, `{admin/`). Se generaron porque en algún punto se
ejecutó un `mkdir -p "{src/{app/{admin,login},..."` en un shell que no
expandió las llaves (PowerShell o bash con comillas mal puestas). No
rompían el build pero ensuciaban el repo y podían confundir a TypeScript.
**Eliminados.**

#### FIX 2 — Next.js `14.2.13` → `14.2.35`
El Next original tenía CVEs conocidos. Actualizado a la última versión
parcheada de la línea 14.x (al 2025-12-11, según advisory oficial).
Nota: la línea 14 está técnicamente unsupported. Cuando tengas tiempo,
evalúa migrar a Next 16.x (cambio mayor, requiere re-testear todo el admin).

#### FIX 3 — Fuentes correctamente cargadas con `next/font/google`
**Archivos:** `src/app/layout.tsx`, `src/app/globals.css`, `tailwind.config.js`

- **Antes:** `tailwind.config.js` referenciaba `var(--font-geist-sans)` y
  `var(--font-cormorant)`, variables que **nunca se definían**. El
  `globals.css` cargaba las fuentes vía `@import url(https://fonts.googleapis.com/...)`
  pero con otros nombres (`--font-sans`, `--font-display`). Resultado:
  el sitio usaba siempre Georgia/system-ui de fallback — Cormorant Garamond
  nunca se aplicaba. El `@import` además bloqueaba el render hasta que
  Google respondía.

- **Ahora:** Las fuentes se cargan con `next/font/google` en `layout.tsx`.
  Next las descarga al build-time, las hostea en tu propio dominio y
  expone `--font-display` y `--font-sans` como variables CSS globales.
  Tailwind las consume correctamente. Ventajas:
    · Zero layout shift (FOIT/FOUT eliminados)
    · Sin bloqueo de render
    · Sin dependencia de `fonts.googleapis.com` en producción
    · Tipografía elegante de inmobiliaria (Cormorant) finalmente visible

#### FIX 4 — Validador central de envs: `src/lib/env.ts`
Archivo NUEVO. Resuelve la causa más probable de tu fallo en Vercel:

- **Antes:** Cada archivo hacía `process.env.NEXT_PUBLIC_X!` con la
  non-null assertion de TypeScript. Si faltaba una env en Vercel, el
  código seguía con `undefined` y el error salía mucho después en runtime,
  críptico, dentro del middleware. Como el middleware corre ANTES que las
  páginas, el sitio entero devolvía 500 sin pista clara.

- **Ahora:** `assertEnv()` corre una vez al boot (desde `layout.tsx`).
  Si falta alguna env crítica, lanza inmediatamente con mensaje claro:
  > ❌ Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

  Vas a ver ese mensaje ARRIBA en los logs de Vercel en vez de un 500 mudo.

#### FIX 5 — Middleware defensivo
**Archivo:** `src/middleware.ts`

- **Guard de envs:** si faltan `NEXT_PUBLIC_SUPABASE_URL` o
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, el middleware ya no crashea — solo
  loguea y deja pasar la request. Solo la auth de `/admin/*` queda
  afectada, no el sitio público.

- **`getSession()` → `getUser()`:** la docs de `@supabase/ssr` recomienda
  explícitamente `getUser()` en server-side. `getSession()` solo lee la
  cookie sin validar el JWT; `getUser()` hace round-trip a Supabase y
  valida el token. Más seguro contra sesiones falsificadas.

#### FIX 6 — ISR correcto (quitar `cache: 'no-store'`)
**Archivos:** `src/lib/supabase-server.ts`, `src/app/api/health/route.ts`

El `cache: 'no-store'` en el cliente público de Supabase estaba anulando
todo el ISR de Next.js. El build lo confirmaba con el mensaje:
  > Error: Dynamic server usage: no-store fetch ... /sitemap.xml

Resultado antes: la home tenía `revalidate = 300` pero se renderizaba
dinámicamente en CADA request (marca `ƒ Dynamic` en el build output).

**Ahora:**
- `createSupabasePublicClient()` usa `{ next: { tags, revalidate: 60 } }`
  en el fetch interno. Respeta el ISR y permite invalidación por tag.
- Hay un cliente nuevo `createSupabaseNoCacheClient()` para los casos
  que SÍ quieres datos live (ej: `/api/health`).

Verificado en el build output: la home pasó de `ƒ Dynamic` a `○ Static`.
**Vas a gastar menos compute en Vercel.**

#### FIX 7 — Endpoint `/api/revalidate` funcional
**Archivos:** `src/lib/cache.ts`, `src/app/api/revalidate/route.ts`

- **Antes:** `CACHE_TAGS.property` era una función dentro del objeto, y
  `Object.values(CACHE_TAGS).includes(tag)` nunca matcheaba slugs porque
  comparaba strings con una función. Además los fetches no tenían tags,
  así que `revalidateTag()` no invalidaba nada real.

- **Ahora:**
    · `propertyTag(slug)` es una función exportada aparte
    · `ALL_STATIC_TAGS` es el array comparable
    · `/api/revalidate` soporta `{ slug }` (invalida una sola propiedad)
      y `{ tag }` (invalida un tag estático)
    · Los fetches del cliente público ya llevan tags, así la invalidación
      funciona de verdad
    · Si `REVALIDATION_SECRET` no está configurado, el endpoint rechaza
      todo por seguridad (antes funcionaba aunque faltara el secret)

---

### Bloque 2 — Bugs menores

#### FIX 8 — `MapComponent`: prop `styles` inexistente
La prop `styles={...}` de `<Map>` no existe en `@vis.gl/react-google-maps`.
Los mapas con `mapId` se estilan en Google Cloud Console, no como prop.
Removida + comentario explicando cómo personalizar.

#### FIX 9 — Limpieza varia
- `src/app/propiedades/[slug]/page.tsx`: quitado el `import type React from 'react'`
  innecesario que estaba al final del archivo
- `public/logo-casa-seis.jpg` (89 KB): eliminado, el sitio solo usa el `.png`
- `supabase/schema.sql`: advertencia más visible sobre el seed de datos en prod

---

### Bloque 3 — Rediseño de la home

#### FIX 10 — Home rediseñada
**Archivo:** `src/app/page.tsx`

Cambios visuales:
- **Hero con imagen de fondo** (actualmente una foto de Unsplash genérica —
  reemplázala por una foto profesional cuando la tengas). Overlay navy
  oscuro + texto blanco grande. Ocupa 88vh para ser inmersivo.
- **Search bar inline** con 3 campos (tipo, ciudad, presupuesto) + botón
  que envía `GET /propiedades?tipo=X&ciudad=Y&precio=Z`. Reutiliza el
  parser de filtros que ya tenías. Sin JavaScript — es un `<form>` HTML.
- **Stats strip** con 3 cifras de confianza ("+120 propiedades", etc).
  Edita los números en `page.tsx` para ajustarlos a la realidad.
- **Bloque "Por qué Casa Seis"** NUEVO con 3 iconos (legalidad, experiencia
  local, respuesta rápida).
- **CTA final** con fondo navy oscuro en vez del beige anterior — más
  contraste y autoridad visual.

#### FIX 11 — Header con variante transparente
**Archivo:** `src/components/ui/Header.tsx`

En la home y con scroll arriba, el header ahora es transparente con logo
blanco. Al scrollear >40px se solidifica a blanco con logo oscuro. En
todas las demás páginas se mantiene sólido desde el inicio. Transición
con fade suave. Mobile menu funciona igual que antes.

---

## 🚨 Cosas que NO arreglé y deberías hacer tú

### 1. Configura las envs en Vercel (causa más probable de tu fallo)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY    (opcional, para los mapas)
UPSTASH_REDIS_REST_URL              (opcional, rate limit)
UPSTASH_REDIS_REST_TOKEN            (opcional)
RESEND_API_KEY                      (opcional, para emails reales)
REVALIDATION_SECRET                 (requerido si usas /api/revalidate)
```

Settings → Environment Variables. Aplica a "Production" y "Preview".

### 2. Cambia la imagen del hero

Está en `src/app/page.tsx` (busca `images.unsplash.com`). Mejor si la
subes a `/public/hero.jpg` y pones `src="/hero.jpg"` — así no dependes
de Unsplash.

### 3. Ajusta los números del stats strip

Busca en `page.tsx` el array `{ num: '+120', label: '...' }` y cambia
los valores por los reales de tu empresa.

### 4. Crea el `/og-image.jpg`

Para previews en WhatsApp/Facebook. Tamaño: 1200×630 px, peso <300 KB.
Colócalo en `/public/og-image.jpg`.

### 5. Evalúa migrar a Next.js 16.x

La línea 14 ya no recibe parches activos. No es urgente pero sí importante
a mediano plazo. Requiere re-testear el admin completo.

### 6. Considera activar Upstash Redis

El fallback a memoria funciona en desarrollo pero en Vercel cada función
serverless tiene su propia memoria, así que el rate limit no es real en
producción sin Redis. Registro gratis en https://upstash.com.

---

## Historial previo (iteración anterior)

### FIX — SELECT_PROPERTY: fuente única de verdad ✅
`src/lib/properties-server.ts`, `src/lib/properties-client.ts` ambos
importan desde `properties-queries.ts`.

### FIX — adminDeleteProperty: limpieza de Storage ✅
Al borrar una propiedad, primero se obtienen y borran sus imágenes del
bucket Storage, luego se elimina el registro.

### FIX — Rate limiting con Upstash Redis ✅
Estrategia dual: Redis en prod (si las envs están), Map en dev.

### FIX — Filtro de superficie (minArea / maxArea) ✅
Query + UI + pills funcionan completos.

---

## Pasos para aplicar estos fixes

```bash
# 1. Instalar las nuevas deps (next 14.2.35)
npm install

# 2. Probar en local
cp .env.local.example .env.local
# Llenar las credenciales reales en .env.local
npm run dev

# 3. Verificar que compila
npm run build

# 4. Commit y push
git add -A
git commit -m "fix: múltiples arreglos de deploy + rediseño del hero"
git push

# 5. En Vercel: Settings → Environment Variables → agregar todas las
#    envs (ver arriba). Luego Deployments → Redeploy.
```
