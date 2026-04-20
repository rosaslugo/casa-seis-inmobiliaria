// Revalidate every 5 minutes
export const revalidate = 300

import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight, MapPin, Phone } from 'lucide-react'
import { getFeaturedProperties } from '@/lib/properties-server'
import PropertyGrid from '@/components/property/PropertyGrid'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { SITE_PHONE_WA } from '@/constants'

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      <Header />

      <main id="main-content">

        {/* ══════════════════════════════════════════════════
            HERO — dark, compact, no fake stats
            ══════════════════════════════════════════════════ */}
        <section
          className="relative min-h-[65vh] flex items-center overflow-hidden hero-section-bg"
          aria-label="Bienvenida"
        >
          {/* Very subtle dot texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(91,123,191,0.07) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Content */}
          <div className="page-container relative z-10 pt-32 pb-20 md:pt-40 md:pb-24 text-white">
            <div className="max-w-xl">

              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase mb-6 flex items-center gap-2.5"
                 style={{ color: 'rgba(140,165,210,0.55)' }}>
                <MapPin size={11} aria-hidden="true" />
                Los Mochis, Sinaloa · México
              </p>

              <h1 className="font-display font-light leading-[0.93] tracking-tight text-white mb-7"
                  style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}>
                Tu próxima casa{' '}
                <em className="not-italic italic" style={{ color: 'rgba(140,165,210,0.85)' }}>
                  te espera.
                </em>
              </h1>

              <p className="text-sm md:text-base leading-relaxed max-w-sm mb-10"
                 style={{ color: 'rgba(188,202,232,0.6)' }}>
                Casas y departamentos en venta y renta en Sinaloa.
                Asesoría personalizada sin costo.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/propiedades"
                  className="inline-flex items-center gap-2.5 bg-white text-action-selected px-7 py-3.5 text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-surface-section transition-colors duration-200"
                  style={{ borderRadius: '3px', boxShadow: '0 4px 16px rgb(0 0 0 / 0.25)' }}
                >
                  Ver propiedades
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-200"
                  style={{
                    borderRadius: '3px',
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FEATURED PROPERTIES
            ══════════════════════════════════════════════════ */}
        <section className="bg-white py-20 md:py-28" aria-labelledby="featured-heading">
          <div className="page-container">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 pb-6 border-b border-stone-200">
              <div>
                <p className="overline mb-2.5">Selección curada</p>
                <h2 id="featured-heading" className="section-heading">
                  Propiedades <em className="text-action-muted not-italic">destacadas</em>
                </h2>
              </div>
              <Link href="/propiedades" className="btn-ghost text-xs self-start sm:self-auto whitespace-nowrap shrink-0">
                Ver catálogo completo
                <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>

            <Suspense fallback={<PropertyGridSkeleton />}>
              <PropertyGrid
                properties={featuredProperties}
                emptyMessage="Próximamente nuevas propiedades disponibles."
              />
            </Suspense>

            {featuredProperties.length > 0 && (
              <div className="text-center mt-14 pt-8 border-t border-stone-200">
                <Link href="/propiedades" className="btn-secondary text-xs py-3.5 px-8">
                  Ver todas las propiedades
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            CTA FINAL
            ══════════════════════════════════════════════════ */}
        <section
          className="cta-section-bg py-20 md:py-24"
          aria-labelledby="cta-heading"
        >
          <div className="page-container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-16">
              <div className="max-w-xl">
                <p className="overline mb-3">¿Tienes una propiedad?</p>
                <h2 id="cta-heading" className="font-display text-3xl md:text-5xl text-stone-900 font-light leading-tight mb-4">
                  Vende o renta con <em className="text-action-muted not-italic">nosotros</em>
                </h2>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Marketing profesional, fotografía de alta calidad y asesoría legal incluida.
                  Sin costos hasta que vendamos tu propiedad.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={`https://wa.me/${SITE_PHONE_WA}?text=Hola, quiero vender/rentar mi propiedad`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-emerald-600 text-white px-7 py-4 text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-emerald-700 transition-colors duration-200"
                  style={{ borderRadius: '3px', boxShadow: '0 2px 8px rgb(5 150 105 / 0.3)' }}
                >
                  <Phone size={13} aria-hidden="true" />
                  WhatsApp
                </a>
                <Link
                  href="/contacto"
                  className="btn-primary py-4 justify-center text-center"
                  style={{ borderRadius: '3px', boxShadow: '0 2px 8px rgb(26 45 90 / 0.2)' }}
                >
                  <MapPin size={13} aria-hidden="true" />
                  Agendar valuación
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}

function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-md overflow-hidden">
          <div className="aspect-[4/3] skeleton mb-3" />
          <div className="h-2.5 skeleton rounded w-1/3 mb-2" />
          <div className="h-5 skeleton rounded w-3/4 mb-2" />
          <div className="h-3 skeleton rounded w-full mb-1" />
          <div className="h-px bg-stone-200 my-3" />
          <div className="flex gap-4">
            <div className="h-3 skeleton rounded w-14" />
            <div className="h-3 skeleton rounded w-14" />
            <div className="h-3 skeleton rounded w-14 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}
