import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { SITE_EMAIL, SITE_PHONE } from '@/constants'

export const metadata = {
  title: 'Aviso de Privacidad',
  description: 'Aviso de privacidad de Casa Seis Inmobiliaria. Conoce cómo protegemos y usamos tu información personal.',
}

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-[72px] md:pt-24">

        <div className="page-container page-header mt-6">
          <p className="overline mb-2.5">Legal</p>
          <h1 className="section-heading">
            Aviso de <em className="text-action-muted not-italic">Privacidad</em>
          </h1>
          <p className="text-sm text-stone-500 mt-3">Última actualización: abril 2026</p>
        </div>

        <div className="page-container py-16 max-w-3xl">
          <div className="prose prose-stone max-w-none space-y-10">

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">1. Responsable del tratamiento</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                <strong>Casa Seis Inmobiliaria</strong>, con domicilio en Los Mochis, Sinaloa, México,
                es responsable del tratamiento de los datos personales que usted nos proporcione,
                de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de
                los Particulares (LFPDPPP) y demás normativa aplicable.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                Para cualquier consulta relacionada con su privacidad puede contactarnos en:{' '}
                <a href={`mailto:${SITE_EMAIL}`} className="text-action-muted hover:underline">{SITE_EMAIL}</a>
                {' '}o al {SITE_PHONE}.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">2. Datos personales que recabamos</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                A través de nuestro sitio web y formulario de contacto podemos recabar los siguientes datos:
              </p>
              <ul className="text-sm text-stone-600 space-y-1.5 list-disc list-inside">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono (opcional)</li>
                <li>Mensaje o consulta que nos envíe</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">3. Finalidades del tratamiento</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Sus datos personales serán utilizados para las siguientes finalidades <strong>primarias</strong>:
              </p>
              <ul className="text-sm text-stone-600 space-y-1.5 list-disc list-inside">
                <li>Atender y dar seguimiento a sus consultas e inquietudes</li>
                <li>Brindarle información sobre propiedades en venta y renta</li>
                <li>Agendar citas, visitas y valuaciones de propiedades</li>
                <li>Formalizar operaciones inmobiliarias</li>
              </ul>
              <p className="text-sm text-stone-600 leading-relaxed mt-2">
                Finalidades <strong>secundarias</strong> (puede oponerse en cualquier momento):
              </p>
              <ul className="text-sm text-stone-600 space-y-1.5 list-disc list-inside">
                <li>Envío de información sobre nuevas propiedades disponibles</li>
                <li>Noticias y novedades del mercado inmobiliario local</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">4. Transferencia de datos</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Casa Seis Inmobiliaria <strong>no vende, renta ni cede</strong> sus datos personales
                a terceros sin su consentimiento previo, salvo en los casos previstos por la LFPDPPP
                o cuando sea requerido por autoridad competente.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">5. Derechos ARCO</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar u Oponerse</strong> al
                tratamiento de sus datos personales (derechos ARCO). Para ejercerlos, envíe una
                solicitud a{' '}
                <a href={`mailto:${SITE_EMAIL}`} className="text-action-muted hover:underline">{SITE_EMAIL}</a>
                {' '}indicando su nombre completo, datos de contacto y el derecho que desea ejercer.
                Atenderemos su solicitud en un plazo máximo de 20 días hábiles.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">6. Cookies y tecnologías de rastreo</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar su
                experiencia de navegación, analizar el tráfico y optimizar el rendimiento del sitio.
                Puede configurar su navegador para rechazar cookies, aunque esto podría afectar
                algunas funcionalidades del sitio.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">7. Cambios al aviso de privacidad</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Nos reservamos el derecho de modificar este aviso en cualquier momento. Cualquier
                cambio será publicado en esta página con la fecha de actualización correspondiente.
                Le recomendamos revisarlo periódicamente.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl text-stone-900">8. Contacto</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Si tiene dudas sobre este aviso de privacidad, puede contactarnos:
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
