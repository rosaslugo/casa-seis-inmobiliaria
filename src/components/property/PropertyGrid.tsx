import PropertyCard from './PropertyCard'
import { Home } from 'lucide-react'
import type { Property } from '@/types'

interface PropertyGridProps {
  properties: Property[]
  emptyMessage?: string
}

export default function PropertyGrid({ properties, emptyMessage }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="empty-state" role="status" aria-label="Sin resultados">
        <div
          className="w-16 h-16 bg-action-ghost border border-action-ghostBorder flex items-center justify-center mb-6"
          style={{ borderRadius: '12px' }}
        >
          <Home size={24} className="text-content-icon" />
        </div>
        <p className="text-stone-900 font-semibold mb-2">Sin resultados</p>
        <p className="body-sm max-w-xs">
          {emptyMessage ?? 'No encontramos propiedades con esos filtros. Intenta ajustando los criterios de búsqueda.'}
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      role="list"
      aria-label={`${properties.length} propiedades`}
    >
      {properties.map((property, index) => (
        <div
          key={property.id}
          role="listitem"
          className="animate-fade-up flex"
          style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
        >
          <PropertyCard
            property={property}
            priority={index < 3}
            className="w-full"
          />
        </div>
      ))}
    </div>
  )
}
