import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, MessageCircle } from 'lucide-react'
import {
  SITE_PHONE,
  SITE_PHONE_WA,
  SITE_EMAIL,
  SITE_ADDRESS,
  SITE_FACEBOOK,
  SITE_INSTAGRAM,
  SITE_HOURS,
} from '@/constants'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer role="contentinfo" className="mt-auto" style={{ background: 'var(--color-surface-sidebar)' }}>
      {/* Accent top border */}
      <div
        className="h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,94,166,0.6) 50%, transparent)' }}
        aria-hidden="true"
      />

      <div className="page-container py-14 md:py-18">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Casa Seis Inmobiliaria" className="inline-block mb-5">
              <Logo variant="light" height={46} />
            </Link>
            <p className="text-xs leading-relaxed mb-5 max-w-[200px]" style={{ color: 'rgba(140,165,210,0.6)' }}>
              Especialistas en bienes raíces en México. Más de 10 años conectando familias con su hogar ideal.
            </p>
            <div className="flex gap-2">
              {[
                { href: SITE_INSTAGRAM, icon: Instagram, label: 'Instagram' },
                { href: SITE_FACEBOOK,  icon: Facebook,  label: 'Facebook'  },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon w-8 h-8 flex items-center justify-center transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={13} aria-hidden="true" />
                </a>
              ))}
              {/* WhatsApp icon */}
              <a
                href={`https://wa.me/${SITE_PHONE_WA}?text=Hola, me interesa una propiedad`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon w-8 h-8 flex items-center justify-center transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle size={13} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Propiedades */}
          <nav aria-label="Propiedades">
            <h3 className="footer-col-heading text-[10px] font-bold tracking-[0.18em] uppercase mb-5">
              Propiedades
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Todas',    href: '/propiedades' },
                { label: 'En venta', href: '/propiedades?tipo=sale' },
                { label: 'En renta', href: '/propiedades?tipo=rent' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link text-xs transition-colors duration-150">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Empresa */}
          <nav aria-label="Empresa">
            <h3 className="footer-col-heading text-[10px] font-bold tracking-[0.18em] uppercase mb-5">
              Empresa
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Contacto',   href: '/contacto' },
                { label: 'Privacidad', href: '/privacidad' },
                { label: 'Términos',   href: '/terminos' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link text-xs transition-colors duration-150">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <address className="not-italic">
            <h3 className="footer-col-heading text-[10px] font-bold tracking-[0.18em] uppercase mb-5">
              Contacto
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={`https://wa.me/${SITE_PHONE_WA}?text=Hola, me interesa una propiedad`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-link flex items-start gap-2.5 group"
                >
                  <Phone size={12} className="footer-contact-icon shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs">{SITE_PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="footer-contact-link flex items-start gap-2.5 group"
                >
                  <Mail size={12} className="footer-contact-icon shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs">{SITE_EMAIL}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={12} className="footer-contact-icon shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs footer-contact-link">{SITE_ADDRESS}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={12} className="footer-contact-icon shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs footer-contact-link">{SITE_HOURS}</span>
              </li>
            </ul>
          </address>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(59,94,166,0.15)' }}
        >
          <p className="footer-muted text-[11px]">
            © {year} Casa Seis Inmobiliaria. Todos los derechos reservados.
          </p>
          <p className="footer-muted text-[11px]">
            Los Mochis, Sinaloa, México
          </p>
        </div>
      </div>
    </footer>
  )
}
