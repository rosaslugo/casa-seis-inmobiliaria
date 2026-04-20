export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getProperties, getDistinctCities } from '@/lib/properties-server'
import PropertyGrid from '@/components/property/PropertyGrid'
import PropertyFilters from '@/components/property/PropertyFilters'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import PaginationBar from '@/components/ui/PaginationBar'
import type { PropertyFilters as Filters } from '@/types'

export const metadata: Metadata = {
  title: 'Propiedades — Venta y Renta',
  description: 'Explora nuestra selección de casas, departamentos y terrenos en venta y renta en México.',
}

interface PageProps {
  searchParams: {
    tipo?:      string
    precio?:    string
    ciudad?:    string
    recamaras?: string
    area?:      string
    pagina?:    string
  }
}

function buildFilters(searchParams: PageProps['searchParams']): Filters {
  const filters: Filters = {}
  if (searchParams.tipo === 'sale' || searchParams.tipo === 'rent') filters.type = searchParams.tipo
  if (searchParams.ciudad)    filters.city     = searchParams.ciudad
  if (searchParams.recamaras) filters.bedrooms = parseInt(searchParams.recamaras)
  if (searchParams.precio) {
    const [min, max] = searchParams.precio.split('-')
    if (min) filters.minPrice = parseInt(min)
    if (max) filters.maxPrice = parseInt(max)
  }
  if (searchParams.area) {
    const [min, max] = searchParams.area.split('-')
    if (min) filters.minArea = parseInt(min)
    if (max) filters.maxArea = parseInt(max)
  }
  return filters
}

export default async function PropiedadesPage({ searchParams }: PageProps) {
  const page    = parseInt(searchParams.pagina ?? '1')
  const filters = buildFilters(searchParams)

  const [{ data: properties, count }, cities] = await Promise.all([
    getProperties(filters, page),
    getDistinctCities(),
  ])

  const totalPages = Math.ceil(count / 12)
  const typeLabel  = searchParams.tipo === 'sale' ? 'en Venta'
                   : searchParams.tipo === 'rent' ? 'en Renta' : ''
  const hasFilters = searchParams.tipo || searchParams.precio || searchParams.ciudad || searchParams.recamaras || searchParams.area

  return (
    <>
      <Header />
      <main id="main-content" className="pt-[72px] min-h-screen bg-white">

        {/* ── Page header ── */}
        <div className="page-container page-header mt-6">
          <p className="overline mb-2.5">Catálogo</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h1 className="section-heading">
              Propiedades{typeLabel ? ` ${typeLabel}` : ''}
            </h1>
            <p
              className="text-sm font-semibold tabular-nums px-3 py-1.5 bg-stone-100 text-stone-500"
              style={{ borderRadius: '4px' }}
              aria-live="polite"
            >
              {count === 0
                ? 'Sin resultados'
                : `${count} ${count === 1 ? 'propiedad' : 'propiedades'}`}
            </p>
          </div>
        </div>

        <div className="page-container">
          {/* Filters */}
          <Suspense>
            <PropertyFilters cities={cities} />
          </Suspense>

          <div className="arch-divider mb-10" />

          {/* Grid */}
          <section aria-label="Resultados de propiedades">
            <PropertyGrid
              properties={properties}
              emptyMessage={
                hasFilters
                  ? 'No encontramos propiedades con esos filtros. Intenta cambiando los criterios.'
                  : 'Próximamente nuevas propiedades disponibles.'
              }
            />
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-14 pb-10" aria-label="Páginas de resultados">
              <PaginationBar
                currentPage={page}
                totalPages={totalPages}
                searchParams={searchParams}
              />
            </nav>
          )}

          <div className="pb-20" />
        </div>
      </main>
      <Footer />
    </>
  )
}
