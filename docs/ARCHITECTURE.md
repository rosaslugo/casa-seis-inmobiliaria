# Casa Seis Inmobiliaria — Architecture Guide

## Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 App Router | SSR, routing, API routes |
| Language | TypeScript (strict) | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Database | Supabase (PostgreSQL) | Data + Auth + Storage |
| Maps | Google Maps JS API | Property location |
| Validation | Zod | Schema validation (shared) |
| Forms | React Hook Form | Form state management |
| Testing | Jest + Testing Library | Unit + Integration |

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # Public-facing pages
│   │   ├── page.tsx        # Homepage
│   │   ├── propiedades/    # Property listing + detail
│   │   └── contacto/       # Contact form
│   ├── admin/              # Protected admin panel
│   │   ├── login/          # Auth page
│   │   ├── page.tsx        # Dashboard
│   │   └── propiedades/    # CRUD
│   └── api/                # API Route Handlers
│       ├── contact/        # Contact form endpoint
│       ├── health/         # Health check
│       └── revalidate/     # ISR cache revalidation
│
├── components/
│   ├── ui/                 # Generic, reusable UI primitives
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Toast.tsx       # Notification system
│   │   ├── ConfirmDialog.tsx
│   │   └── PaginationBar.tsx
│   ├── property/           # Property-specific components
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── PropertyFilters.tsx
│   │   ├── ImageGallery.tsx
│   │   └── ShareButton.tsx
│   ├── admin/              # Admin-only components
│   │   ├── AdminForm.tsx
│   │   ├── AdminPropertiesTable.tsx
│   │   └── AdminSidebar.tsx
│   └── maps/
│       └── MapComponent.tsx
│
├── lib/                    # Data layer + utilities
│   ├── supabase-client.ts  # Browser client (no next/headers)
│   ├── supabase-server.ts  # Server client + public client
│   ├── properties-server.ts # Public queries (Server Components)
│   ├── properties-client.ts # Admin CRUD (Client Components)
│   ├── validations.ts      # Shared Zod schemas
│   ├── errors.ts           # Typed error classes
│   ├── logger.ts           # Structured logging
│   ├── cache.ts            # Cache tag constants
│   └── utils.ts            # Pure utility functions
│
├── hooks/                  # Custom React hooks
│   ├── useDebounce.ts
│   └── useToast.ts
│
├── constants/              # App-wide constants
│   └── index.ts
│
├── types/                  # TypeScript interfaces
│   └── index.ts
│
└── __tests__/
    ├── unit/               # Pure function tests
    └── integration/        # Data layer tests (with mocks)
```

---

## Key Design Decisions

### 1. Supabase Client Split
The biggest architectural constraint is Next.js 14's prohibition on importing
`next/headers` in client-component boundaries.

| File | Client Type | Uses cookies? | Safe in |
|------|------------|--------------|---------|
| `supabase-client.ts` | `createBrowserClient` | ❌ No | Anywhere |
| `supabase-server.ts: createSupabasePublicClient` | `createClient` | ❌ No | Server only |
| `supabase-server.ts: createSupabaseServerClient` | `createServerClient` | ✅ Yes | Server + admin |
| `middleware.ts` | `createServerClient` | ✅ Yes | Middleware only |

### 2. Validation is Shared
`lib/validations.ts` contains all Zod schemas. Both `AdminForm` (client)
and API routes (server) import from the same file — no duplication.

### 3. Error Hierarchy
```
Error
└── AppError (code, statusCode, context)
    ├── NotFoundError (404)
    ├── ValidationError (400)
    ├── UnauthorizedError (401)
    └── DatabaseError (500)
```
`serializeError()` ensures internal details never leak to API responses.

### 4. Constants vs Magic Strings
All magic strings (bucket names, page sizes, phone numbers) live in
`constants/index.ts`. Import from there — never hardcode inline.

---

## Data Flow

### Public Property Page
```
User request
  → middleware.ts (auth check — skip for public routes)
  → app/propiedades/[slug]/page.tsx (Server Component)
  → lib/properties-server.ts → createSupabasePublicClient()
  → Supabase PostgreSQL (RLS: only active properties)
  → Page render → HTML to user
```

### Admin CRUD
```
Admin action (e.g., delete property)
  → AdminPropertiesTable.tsx ('use client')
  → lib/properties-client.ts → createSupabaseClient()
  → Supabase (RLS: authenticated role only)
  → Toast notification → UI update
```

---

## Row Level Security (RLS)

| Table | Public reads | Authenticated writes |
|-------|-------------|---------------------|
| `properties` | `status = 'active'` only | Full access |
| `images` | Via active property join | Full access |
| `storage/property-images` | Public GET | Authenticated PUT/DELETE |

---

## Performance Considerations

- **Images**: Next.js `<Image>` with AVIF/WebP, sized per breakpoint
- **Pagination**: 12 items/page, DB-level with `.range()`
- **Fonts**: `display=swap`, preconnect to Google Fonts
- **force-dynamic**: Applied to all data-fetching pages to avoid cookie context errors

---

## Testing Strategy

| Type | Coverage Target | Command |
|------|----------------|---------|
| Unit (utils, validations, errors) | 80%+ | `npm test` |
| Integration (data layer w/ mocks) | 60%+ | `npm test` |
| E2E (Playwright — future) | Critical paths | — |

```bash
npm test                  # Run all tests
npm run test:coverage     # With coverage report
npm run test:watch        # Watch mode during development
npm run type-check        # TypeScript validation
```
