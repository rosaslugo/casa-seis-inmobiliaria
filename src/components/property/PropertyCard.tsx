import Link from 'next/link'
import Image from 'next/image'
import { Bath, Bed, Move, MapPin, ArrowUpRight, Images } from 'lucide-react'
import { cn, formatPrice, getPropertyThumbnail, truncate } from '@/lib/utils'
import type { Property } from '@/types'

/**
 * PropertyCard
 *
 * TOKENS USADOS (todos semánticos — cero primitivos):
 *
 *   surface-extra-dark  → overlay de imagen (bg-surface-extra-dark/60)
 *   content-icon        → íconos de metadata (MapPin, Bed, Bath, Move)
 *   content-primary     → título, precio
 *   content-secondary   → descripción, stats
 *   content-tertiary    → ciudad, "/mes"
 *   content-inverse     → texto sobre imagen oscura
 *   border-subtle       → divisor inferior de stats
 *   action-muted        → color de título en hover (navy, interactivo ✓)
 *   badge-sale/badge-rent/badge-featured → definidos en globals.css
 *
 * PROHIBIDO en este componente:
 *   ❌ text-navy-*  → usar text-action-* o text-content-*
 *   ❌ text-gold-*  → usar text-accent-*
 *   ❌ bg-navy-*    → usar bg-action-* o bg-surface-*
 *   ❌ hover:*-gold-* → hover siempre en dominio action-*
 */

interface PropertyCardProps {
  property: Property
  className?: string
  priority?: boolean
}

export default function PropertyCard({ property, className, priority = false }: PropertyCardProps) {
  const thumbnail  = getPropertyThumbnail(property.images)
  const isRent     = property.type === 'rent'
  const photoCount = property.images?.length ?? 0

  return (
    <Link
      href={`/propiedades/${property.slug}`}
      className={cn('property-card group flex flex-col h-full bg-surface', className)}
      aria-label={`Ver ${property.title} — ${formatPrice(property.price, property.type)}`}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-surface-section property-card__image">
        <Image
          src={thumbnail}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          priority={priority}
        />

        {/* Gradient overlay
            Usa bg-surface-extra-dark con opacidad — sin primitivos */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-extra-dark/60 via-surface-extra-dark/5 to-transparent
                        opacity-40 group-hover:opacity-75 transition-opacity duration-500" />

        {/* Badges + arrow */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* badge-sale y badge-rent están definidos en globals.css con tokens semánticos */}
            <span className={cn('badge', isRent ? 'badge-rent' : 'badge-sale')}>
              {isRent ? 'Renta' : 'Venta'}
            </span>
            {property.featured && (
              <span className="badge badge-featured">Destacada</span>
            )}
          </div>
          {/* Arrow sobre imagen — texto blanco (content-inverse), fondo translúcido */}
          <div className="property-card__arrow w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center
                          opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
                          transition-all duration-300">
            <ArrowUpRight size={14} className="text-content-inverse" aria-hidden="true" />
          </div>
        </div>

        {/* Photo count pill */}
        {photoCount > 1 && (
          <div className="property-card__count absolute bottom-3 right-3 flex items-center gap-1.5
                          bg-surface-extra-dark/65 backdrop-blur-sm px-2 py-1">
            <Images size={10} className="text-content-inverse/70" aria-hidden="true" />
            <span className="text-[10px] text-content-inverse/90 font-semibold tabular-nums">
              {photoCount}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5">

        {/* Location — icono en content-icon (stone-400, no navy ni gold) */}
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin size={10} className="text-content-icon shrink-0" aria-hidden="true" />
          <span className="text-[10px] font-bold tracking-[0.14em] text-content-tertiary uppercase">
            {property.city}{property.state ? `, ${property.state}` : ''}
          </span>
        </div>

        {/* Title
            group-hover usa action-muted (navy-600) — hover = dominio de acción ✓ */}
        <h3 className="font-display text-xl text-content-primary leading-tight mb-2
                       group-hover:text-action-muted transition-colors duration-200 line-clamp-2">
          {property.title}
        </h3>

        {/* Price */}
        <p className="font-display text-2xl text-content-primary font-light mb-3">
          {formatPrice(property.price, property.type)}
          {isRent && (
            <span className="text-xs text-content-tertiary font-sans font-normal ml-1.5">/mes</span>
          )}
        </p>

        {/* Description */}
        <p className="text-sm text-content-secondary leading-relaxed mb-4 line-clamp-2 flex-1">
          {truncate(property.description, 90)}
        </p>

        {/* Stats row — iconos en content-icon (stone, no navy) */}
        <div className="flex items-center gap-4 pt-3 mt-auto border-t border-subtle">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5" title="Recámaras">
              <Bed size={12} className="text-content-icon" aria-hidden="true" />
              <span className="text-xs text-content-secondary tabular-nums font-medium">
                {property.bedrooms} rec.
              </span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5" title="Baños">
              <Bath size={12} className="text-content-icon" aria-hidden="true" />
              <span className="text-xs text-content-secondary tabular-nums font-medium">
                {property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}
              </span>
            </div>
          )}
          {property.area > 0 && (
            <div className="flex items-center gap-1.5 ml-auto" title="Superficie">
              <Move size={12} className="text-content-icon" aria-hidden="true" />
              <span className="text-xs text-content-secondary tabular-nums font-medium">{property.area} m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
