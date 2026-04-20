# Casa Seis Inmobiliaria — Plataforma Web

Plataforma inmobiliaria completa construida con **Next.js 14**, **TypeScript**, **Tailwind CSS** y **Supabase**.

---

## Estructura del Proyecto

```
casa-seis/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── sitemap.ts                  # Sitemap automático
│   │   ├── robots.ts                   # Robots.txt
│   │   ├── not-found.tsx               # Página 404
│   │   ├── propiedades/
│   │   │   ├── page.tsx                # Listado de propiedades
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Detalle de propiedad
│   │   └── admin/
│   │       ├── layout.tsx              # Layout admin con sidebar
│   │       ├── page.tsx                # Dashboard admin
│   │       ├── login/page.tsx          # Login admin
│   │       └── propiedades/
│   │           ├── nueva/page.tsx      # Crear propiedad
│   │           └── [id]/page.tsx       # Editar propiedad
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Header.tsx              # Navbar principal
│   │   │   ├── Footer.tsx              # Footer
│   │   │   └── PaginationBar.tsx       # Paginación
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx        # Tarjeta de propiedad
│   │   │   ├── PropertyGrid.tsx        # Grid de propiedades
│   │   │   ├── PropertyFilters.tsx     # Filtros
│   │   │   └── ImageGallery.tsx        # Galería de imágenes
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx        # Sidebar admin
│   │   │   ├── AdminForm.tsx           # Formulario CRUD
│   │   │   └── AdminPropertiesTable.tsx # Tabla de propiedades
│   │   └── maps/
│   │       └── MapComponent.tsx        # Google Maps
│   ├── lib/
│   │   ├── supabase.ts                 # Clientes Supabase
│   │   ├── properties.ts               # Queries de datos
│   │   └── utils.ts                    # Utilidades
│   ├── types/
│   │   └── index.ts                    # TypeScript types
│   └── middleware.ts                   # Auth middleware
├── supabase/
│   └── schema.sql                      # Schema de la base de datos
├── public/
│   └── logo-casa-seis.jpg              # Logo (copiar aquí)
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Configuración Paso a Paso

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias
npm install

# O con pnpm (recomendado)
pnpm install
```

### 2. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el archivo `supabase/schema.sql`
3. Esto creará:
   - Tabla `properties` con todos los campos
   - Tabla `images` relacionada
   - Políticas RLS (Row Level Security)
   - Storage bucket `property-images`
   - Datos de ejemplo

### 3. Crear usuario administrador

En Supabase, ir a **Authentication > Users > Add user**:
- Email: `admin@casaseis.mx`
- Password: `[contraseña segura]`

### 4. Variables de entorno

```bash
cp .env.local.example .env.local
```

Editar `.env.local`:

```env
# Supabase — encontrar en: Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google Maps — https://console.cloud.google.com
# Activar: Maps JavaScript API, Places API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

# URL del sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Copiar el logo

```bash
cp /ruta/al/logo-casa-seis.jpg public/logo-casa-seis.jpg
```

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Rutas del Sistema

| Ruta | Descripción |
|------|-------------|
| `/` | Homepage con propiedades destacadas |
| `/propiedades` | Listado con filtros |
| `/propiedades/[slug]` | Detalle de propiedad |
| `/admin/login` | Login administrador |
| `/admin` | Dashboard admin |
| `/admin/propiedades/nueva` | Crear propiedad |
| `/admin/propiedades/[id]` | Editar propiedad |
| `/sitemap.xml` | Sitemap automático |
| `/robots.txt` | Robots.txt |

---

## Google Maps

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto o seleccionar existente
3. Activar **Maps JavaScript API**
4. Crear credencial API Key
5. Restringir por dominio en producción
6. Agregar al `.env.local`

---

## Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Agregar variables de entorno en Vercel Dashboard:
# Settings > Environment Variables
```

También actualizar `NEXT_PUBLIC_SITE_URL` con el dominio de producción.

---

## Tecnologías

- **Next.js 14** — App Router, Server Components
- **TypeScript** — Tipado estricto
- **Tailwind CSS** — Utilidades CSS
- **Supabase** — PostgreSQL, Auth, Storage
- **Google Maps** — `@vis.gl/react-google-maps`
- **React Hook Form + Zod** — Validación de formularios
- **Lucide React** — Iconos

---

## Paleta de Colores

| Variable | Valor | Uso |
|----------|-------|-----|
| `navy-800` | `#1e2c56` | Color primario (botones, badges) |
| `navy-600` | `#2d4480` | Acentos, links |
| `stone-900` | `#1c1917` | Texto principal |
| `stone-500` | `#78716c` | Texto secundario |
| `white` | `#ffffff` | Fondo |

---

## Tipografía

- **Display**: Cormorant Garamond (headings, precios)
- **Sans**: DM Sans (cuerpo, UI)
