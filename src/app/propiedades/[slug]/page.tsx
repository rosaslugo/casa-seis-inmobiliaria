// ISR: revalidate every 60s. For instant updates after admin edits, call /api/revalidate.
export const revalidate = 60

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Bath, Bed, Move, Car, MapPin, Phone, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { getPropertyBySlug, getAllPropertySlugs } from '@/lib/properties-server'
import { formatPrice, formatDate, getTypeLabel, getSiteUrl } from '@/lib/utils'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import MapComponent from '@/components/maps/MapComponent'
import ImageGallery from '@/components/property/ImageGallery'
import ShareButton from '@/components/property/ShareButton'
import { SITE_PHONE_WA, SITE_EMAIL } from '@/constants'

interface PageProps { params: { slug: string } }

export async function generateStaticParams() {
  try { return (await getAllPropertySlugs()).map((slug) => ({ slug })) }
  catch { return [] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const property = await getPropertyBySlug(params.slug)
    if (!property) return { title: 'Propiedad no encontrada' }
    const siteUrl    = getSiteUrl()
    const firstImage = property.images?.sort((a, b) => a.order - b.order)[0]
    return {
      title: property.title,
      description: property.description.slice(0, 160),
      openGraph: {
        title: `${property.title} | Casa Seis Inmobiliaria`,
        description: property.description.slice(0, 160),
        url: `${siteUrl}/propiedades/${property.slug}`,
        type: 'website',
        images: firstImage ? [{ url: firstImage.image_url, width: 1200, height: 630, alt: property.title }] : [],
      },
      twitter: { card: 'summary_large_image', title: property.title, description: property.description.slice(0, 160), images: firstImage ? [firstImage.image_url] : [] },
      alternates: { canonical: `${siteUrl}/propiedades/${property.slug}` },
    }
  } catch { return { title: 'Propiedad' } }
}

export default async function PropiedadDetallePage({ params }: PageProps) {
  let property
  try {
    property = await getPropertyBySlug(params.slug)
  } catch {
    notFound()
  }
  if (!property) notFound()

  const sortedImages = [...(property.images ?? [])].sort((a, b) => a.order - b.order)
  const waMessage    = encodeURIComponent(`Hola, me interesa la propiedad: ${property.title}`)
  const mailSubject  = encodeURIComponent(`Consulta sobre: ${property.title}`)

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'RealEstateListing',
    name: property.title, description: property.description,
    url: `${getSiteUrl()}/propiedades/${property.slug}`,
    image: sortedImages.map((img) => img.image_url),
    offers: { '@type': 'Offer', price: property.price, priceCurrency: 'MXN' },
    address: { '@type': 'PostalAddress', addressLocality: property.city, addressRegion: property.state, addressCountry: 'MX' },
    geo: { '@type': 'GeoCoordinates', latitude: property.latitude, longitude: property.longitude },
    numberOfRooms: property.bedrooms,
    floorSize: { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' },
  }

  const highlights = [
    property.bedrooms  > 0 && { icon: Bed,  label: 'Recámaras',      value: property.bedrooms },
    property.bathrooms > 0 && { icon: Bath, label: 'Baños',          value: property.bathrooms },
    property.area      > 0 && { icon: Move, label: 'Superficie',     value: `${property.area} m²` },
    property.parking   > 0 && { icon: Car,  label: 'Estacionamiento', value: property.parking },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string | number }[]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main-content">

        {/* Gallery */}
        <section aria-label="Galería de imágenes" className="bg-stone-950">
          <ImageGallery images={sortedImages} title={property.title} />
        </section>

        <div className="page-container py-10 md:py-16">
          {/* Back */}
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-stone-700 transition-colors mb-8 group"
          >
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1 duration-200" aria-hidden="true" />
            Volver a propiedades
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* ── Left: details ── */}
            <article className="lg:col-span-2">
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={property.type === 'rent' ? 'badge-rent' : 'badge-sale'}>
                    {getTypeLabel(property.type)}
                  </span>
                  {property.featured && <span className="badge-featured">Destacada</span>}
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-tight mb-4">
                  {property.title}
                </h1>

                <address className="not-italic flex items-center gap-2 text-stone-500">
                  <MapPin size={13} className="text-content-icon shrink-0" aria-hidden="true" />
                  <span className="text-sm">
                    {property.address}, {property.city}{property.state ? `, ${property.state}` : ''}
                  </span>
                </address>
              </header>

              {/* Price — prominent */}
              <div className="py-6 border-t border-b border-stone-200 mb-8">
                <p className="overline mb-1.5">Precio</p>
                <p className="font-display text-4xl md:text-5xl text-stone-900 font-light">
                  {formatPrice(property.price, property.type)}
                </p>
                {property.type === 'rent' && (
                  <p className="text-xs text-stone-400 mt-1">Por mes, más depósito</p>
                )}
              </div>

              {/* Highlights grid */}
              {highlights.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10" aria-label="Características principales">
                  {highlights.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="stat-box">
                      <Icon size={18} className="text-content-icon mx-auto mb-2" aria-hidden="true" />
                      <p className="font-display text-2xl text-stone-900 font-light">{value}</p>
                      <p className="text-[11px] text-stone-400 tracking-wide mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <section aria-labelledby="desc-heading" className="mb-10">
                <h2 id="desc-heading" className="overline mb-4">Descripción</h2>
                <div className="space-y-3">
                  {property.description.split('\n').map((para, i) => (
                    <p key={i} className="text-stone-600 leading-relaxed text-sm">{para}</p>
                  ))}
                </div>
              </section>

              {/* Map */}
              {property.latitude && property.longitude && (
                <section aria-labelledby="map-heading">
                  <h2 id="map-heading" className="overline mb-4">Ubicación</h2>
                  <div className="border border-stone-200 overflow-hidden" style={{ borderRadius: "8px" }}>
                    <MapComponent
                      latitude={property.latitude}
                      longitude={property.longitude}
                      title={property.title}
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-2 flex items-center gap-1.5">
                    <MapPin size={10} aria-hidden="true" />
                    {property.address}, {property.city}
                  </p>
                </section>
              )}
            </article>

            {/* ── Right: contact sidebar ── */}
            <aside className="lg:col-span-1" aria-label="Contacto y resumen">
              <div className="sticky top-24 space-y-4">

                {/* Contact card */}
                <div className="border border-stone-200 p-6" style={{ borderRadius: "8px", boxShadow: "var(--shadow-card)" }}>
                  <p className="overline mb-1.5">¿Te interesa?</p>
                  <p className="font-display text-2xl text-stone-800 mb-5">Agenda una visita</p>

                  <div className="space-y-2.5">
                    {/* WhatsApp — primary CTA */}
                    <a
                      href={`https://wa.me/${SITE_PHONE_WA}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-xs py-3.5 bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700"
                      aria-label="Contactar por WhatsApp sobre esta propiedad"
                    >
                      <Phone size={13} aria-hidden="true" />
                      Contactar por WhatsApp
                    </a>
                    {/* Email — secondary */}
                    <a
                      href={`mailto:${SITE_EMAIL}?subject=${mailSubject}`}
                      className="btn-secondary w-full text-xs py-3.5"
                      aria-label="Enviar correo sobre esta propiedad"
                    >
                      <Mail size={13} aria-hidden="true" />
                      Enviar correo
                    </a>
                  </div>

                  {/* Trust signals */}
                  <ul className="mt-5 space-y-1.5" aria-label="Garantías">
                    {['Respuesta en menos de 24h', 'Sin costos ocultos', 'Asesoría sin compromiso'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-stone-500">
                        <CheckCircle size={12} className="text-emerald-500 shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary card */}
                <div className="border border-stone-100 p-5 bg-stone-50" style={{ borderRadius: "8px" }}>
                  <p className="overline mb-3">Resumen</p>
                  <dl className="space-y-2.5">
                    {[
                      { term: 'Tipo',            detail: getTypeLabel(property.type) },
                      { term: 'Ciudad',          detail: `${property.city}${property.state ? `, ${property.state}` : ''}` },
                      { term: 'Superficie',      detail: `${property.area} m²` },
                      { term: 'Recámaras',       detail: property.bedrooms },
                      { term: 'Baños',           detail: property.bathrooms },
                      { term: 'Estacionamiento', detail: property.parking },
                      { term: 'Publicado',       detail: formatDate(property.created_at) },
                    ].map(({ term, detail }) => (
                      <div key={term} className="flex justify-between items-baseline">
                        <dt className="text-xs text-stone-400">{term}</dt>
                        <dd className="text-xs text-stone-700 font-medium">{detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <ShareButton title={property.title} />
              </div>
            </aside>
          </div>
        </div>


      </main>
      <Footer />
    </>
  )
}
