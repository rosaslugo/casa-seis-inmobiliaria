import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { SITE_EMAIL, SITE_PHONE } from '@/constants'

export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso del sitio web de Casa Seis Inmobiliaria.',
}

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-[72px] md:pt-24">

        <div className="page-container page-header mt-6">
          <p className="overline mb-2.5">Legal</p>
          <h1 className="section-heading">
            Términos y <em className="text-action-muted not-italic">Condiciones</em>
          </h1>
          <p className="text-sm text-stone-500 mt-3">Última actualización: abril 2026</p>
        </div>

        <div className="page-container py-16 max-w-3xl">
          <div className="prose prose-stone max-w-none space-y-10">

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">1. Aceptación de los términos</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Al acceder y utilizar el sitio web <strong>casaseisinmobiliaria.com</strong>,
                usted acepta quedar vinculado por estos Términos y Condiciones de Uso. Si no está
                de acuerdo con alguno de estos términos, le pedimos no utilizar nuestro sitio.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">2. Descripción del servicio</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Casa Seis Inmobiliaria es una agencia inmobiliaria ubicada en Los Mochis, Sinaloa,
                México. A través de este sitio web ofrecemos:
              </p>
              <ul className="text-sm text-stone-600 space-y-1.5 list-disc list-inside">
                <li>Catálogo de propiedades en venta y renta</li>
                <li>Información sobre inmuebles disponibles</li>
                <li>Formulario de contacto para consultas</li>
                <li>Servicio de valuación y asesoría inmobiliaria</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">3. Información de propiedades</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                La información publicada sobre propiedades (precios, dimensiones, características,
                disponibilidad) es de carácter informativo y puede cambiar sin previo aviso.
                Casa Seis Inmobiliaria hace su mejor esfuerzo por mantener la información actualizada,
                pero no garantiza su exactitud en todo momento. Le recomendamos contactarnos directamente
                para confirmar la disponibilidad y condiciones actuales de cualquier propiedad.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">4. Propiedad intelectual</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Todo el contenido de este sitio web — incluyendo textos, imágenes, logotipos, diseño
                y código — es propiedad de Casa Seis Inmobiliaria o de sus respectivos titulares y
                está protegido por las leyes de propiedad intelectual vigentes en México.
                Queda prohibida su reproducción total o parcial sin autorización escrita.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">5. Uso aceptable</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Al usar este sitio usted se compromete a:
              </p>
              <ul className="text-sm text-stone-600 space-y-1.5 list-disc list-inside">
                <li>No utilizar el sitio con fines ilegales o no autorizados</li>
                <li>No intentar acceder a áreas restringidas del sitio</li>
                <li>Proporcionar información veraz en el formulario de contacto</li>
                <li>No realizar scraping automatizado del contenido del sitio</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">6. Limitación de responsabilidad</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Casa Seis Inmobiliaria no será responsable por daños directos, indirectos o
                consecuentes derivados del uso o imposibilidad de uso de este sitio web, ni por
                decisiones tomadas con base en la información aquí publicada sin previa verificación
                con nuestro equipo de asesores.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">7. Enlaces a terceros</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Este sitio puede contener enlaces a sitios web de terceros (como WhatsApp, Google Maps,
                redes sociales). Casa Seis Inmobiliaria no es responsable del contenido ni de las
                prácticas de privacidad de dichos sitios externos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">8. Modificaciones</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier
                momento. Los cambios entrarán en vigor al momento de su publicación en este sitio.
                El uso continuado del sitio después de los cambios implica la aceptación de los
                nuevos términos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">9. Legislación aplicable</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Estos términos se rigen por las leyes vigentes en los Estados Unidos Mexicanos.
                Cualquier controversia derivada de su interpretación o aplicación se someterá a
                la jurisdicción de los tribunales competentes en Los Mochis, Sinaloa, México,
                renunciando a cualquier otro fuero que pudiera corresponder.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">10. Contacto</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Para cualquier duda sobre estos términos, contáctenos:
              </p>
              <ul className="text-sm text-stone-600 space-y-1.5 list-none">
                <li>📧 <a href={`mailto:${SITE_EMAIL}`} className="text-action-muted hover:underline">{SITE_EMAIL}</a></li>
                <li>📞 <a href={`tel:+526681163380`} className="text-action-muted hover:underline">{SITE_PHONE}</a></li>
                <li>📍 Los Mochis, Sinaloa, México</li>
              </ul>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
