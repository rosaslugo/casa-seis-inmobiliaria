'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition, useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRICE_RANGES, BEDROOM_OPTIONS } from '@/constants'

const PROPERTY_TYPES = [
  { value: 'all',  label: 'Todos' },
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Renta' },
]

const AREA_RANGES = [
  { value: '',          label: 'Cualquier m²' },
  { value: '0-80',      label: 'Hasta 80 m²' },
  { value: '80-150',    label: '80 – 150 m²' },
  { value: '150-300',   label: '150 – 300 m²' },
  { value: '300-',      label: 'Más de 300 m²' },
] as const

interface PropertyFiltersProps {
  cities: string[]
}

export default function PropertyFilters({ cities }: PropertyFiltersProps) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [mobileOpen, setMobileOpen]  = useState(false)

  const currentType     = searchParams.get('tipo')      ?? 'all'
  const currentPrice    = searchParams.get('precio')    ?? ''
  const currentCity     = searchParams.get('ciudad')    ?? ''
  const currentBedrooms = searchParams.get('recamaras') ?? ''
  const currentArea     = searchParams.get('area')      ?? ''

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      value ? params.set(key, value) : params.delete(key)
      params.delete('pagina')
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams]
  )

  const hasFilters  = currentType !== 'all' || currentPrice || currentCity || currentBedrooms || currentArea
  const activeCount = [
    currentType !== 'all' && currentType,
    currentPrice,
    currentCity,
    currentBedrooms,
    currentArea,
  ].filter(Boolean).length

  const clearAll = () => {
    startTransition(() => router.push(pathname, { scroll: false }))
    setMobileOpen(false)
  }

  const selectCls = "input-arch w-full pr-6 text-xs"

  const FilterContent = () => (
    <div className={cn('flex flex-wrap items-end gap-5 transition-opacity duration-200', isPending && 'opacity-50 pointer-events-none')}>

      {/* Type toggle */}
      <div>
        <p className="label-arch mb-2.5">Tipo</p>
        <div className="flex" role="group" aria-label="Tipo de propiedad">
          {PROPERTY_TYPES.map((opt, i) => {
            const isActive = currentType === opt.value || (opt.value === 'all' && currentType === 'all')
            return (
              <button
                key={opt.value}
                onClick={() => updateFilter('tipo', opt.value === 'all' ? '' : opt.value)}
                aria-pressed={isActive}
                className="px-4 py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase border-r last:border-r-0 border transition-all duration-150"
                style={{
                  borderRadius: i === 0 ? '3px 0 0 3px' : i === PROPERTY_TYPES.length - 1 ? '0 3px 3px 0' : '0',
                  background: isActive ? 'var(--color-action-primary)' : 'var(--color-surface)',
                  color:      isActive ? 'white' : 'var(--color-content-secondary)',
                  borderColor: isActive ? 'var(--color-action-primary)' : 'var(--color-border-strong)',
                  boxShadow: isActive ? '0 1px 3px rgba(26,45,90,0.2)' : 'none',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price */}
      <div className="min-w-[160px]">
        <label htmlFor="filter-precio" className="label-arch block mb-2.5">Precio</label>
        <select
          id="filter-precio"
          value={currentPrice}
          onChange={(e) => updateFilter('precio', e.target.value)}
          className={selectCls}
        >
          {PRICE_RANGES.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      {cities.length > 0 && (
        <div className="min-w-[150px]">
          <label htmlFor="filter-ciudad" className="label-arch block mb-2.5">Ciudad</label>
          <select
            id="filter-ciudad"
            value={currentCity}
            onChange={(e) => updateFilter('ciudad', e.target.value)}
            className={selectCls}
          >
            <option value="">Todas</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      )}

      {/* Bedrooms */}
      <div className="min-w-[130px]">
        <label htmlFor="filter-recamaras" className="label-arch block mb-2.5">Recámaras</label>
        <select
          id="filter-recamaras"
          value={currentBedrooms}
          onChange={(e) => updateFilter('recamaras', e.target.value)}
          className={selectCls}
        >
          {BEDROOM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Area */}
      <div className="min-w-[150px]">
        <label htmlFor="filter-area" className="label-arch block mb-2.5">Superficie</label>
        <select
          id="filter-area"
          value={currentArea}
          onChange={(e) => updateFilter('area', e.target.value)}
          className={selectCls}
        >
          {AREA_RANGES.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-red-500 transition-colors pb-3 self-end"
        >
          <X size={13} />
          Limpiar
        </button>
      )}
    </div>
  )

  return (
    <div className="py-6">
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="flex items-center gap-2.5 mb-5">
          <SlidersHorizontal size={13} className="text-content-icon" aria-hidden="true" />
          <span className="overline">Filtrar propiedades</span>
          {isPending && (
            <span className="ml-auto text-xs text-stone-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-action-focus rounded-full animate-pulse" />
              Buscando…
            </span>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile — collapsible */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-between w-full py-3.5 border-b border-stone-200"
          aria-expanded={mobileOpen}
          aria-controls="mobile-filters"
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold text-stone-700">
            <SlidersHorizontal size={14} className="text-content-icon" />
            Filtros
            {activeCount > 0 && (
              <span
                className="w-5 h-5 bg-action-primary text-white text-[10px] font-bold flex items-center justify-center"
                style={{ borderRadius: '50%' }}
              >
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown
            size={16}
            className={cn('text-stone-400 transition-transform duration-200', mobileOpen && 'rotate-180')}
          />
        </button>

        <div
          id="mobile-filters"
          className={cn(
            'overflow-hidden transition-all duration-300',
            mobileOpen ? 'max-h-[600px] pt-5' : 'max-h-0'
          )}
        >
          <FilterContent />
        </div>
      </div>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-5" role="list" aria-label="Filtros activos">
          {currentType !== 'all' && currentType && (
            <FilterPill
              label={currentType === 'sale' ? 'Venta' : 'Renta'}
              onRemove={() => updateFilter('tipo', '')}
            />
          )}
          {currentPrice && (
            <FilterPill
              label={PRICE_RANGES.find((p) => p.value === currentPrice)?.label ?? currentPrice}
              onRemove={() => updateFilter('precio', '')}
            />
          )}
          {currentCity && (
            <FilterPill label={currentCity} onRemove={() => updateFilter('ciudad', '')} />
          )}
          {currentBedrooms && (
            <FilterPill
              label={`${currentBedrooms}+ recámaras`}
              onRemove={() => updateFilter('recamaras', '')}
            />
          )}
          {currentArea && (
            <FilterPill
              label={AREA_RANGES.find((a) => a.value === currentArea)?.label ?? currentArea}
              onRemove={() => updateFilter('area', '')}
            />
          )}
        </div>
      )}
    </div>
  )
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1.5 bg-action-ghost border border-action-ghostBorder text-xs font-semibold text-action-ghostText"
      style={{ borderRadius: '4px' }}
      role="listitem"
    >
      {label}
      <button
        onClick={onRemove}
        className="w-4 h-4 flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-colors ml-0.5"
        style={{ borderRadius: '3px' }}
        aria-label={`Quitar filtro: ${label}`}
      >
        <X size={10} />
      </button>
    </span>
  )
}
