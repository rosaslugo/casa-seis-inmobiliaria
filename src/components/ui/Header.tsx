'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from './Logo'

const navLinks = [
  { label: 'Propiedades', href: '/propiedades' },
  { label: 'Venta',       href: '/propiedades?tipo=sale' },
  { label: 'Renta',       href: '/propiedades?tipo=rent' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    if (pathname !== '/') {
      setScrolled(true)
      return
    }
    setScrolled(false)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (pathname.startsWith('/admin')) return null

  const isActive = (href: string) => pathname === href.split('?')[0]
  const isTransparent = pathname === '/' && !scrolled && !mobileOpen

  return (
    <header
      role="banner"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/97 backdrop-blur-sm'
      )}
      style={!isTransparent ? { boxShadow: 'var(--shadow-nav)' } : undefined}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-[72px]">

          <Link href="/" aria-label="Casa Seis Inmobiliaria — Inicio" className="shrink-0">
            <Logo
              variant={isTransparent ? 'light' : 'dark'}
              height={44}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav
            role="navigation"
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'relative text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 py-1 group',
                  isTransparent
                    ? isActive(link.href)
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                    : isActive(link.href)
                      ? 'text-action-primary'
                      : 'text-stone-500 hover:text-stone-900'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-0.5 left-0 h-[1.5px] transition-all duration-300',
                    isTransparent ? 'bg-white/60' : 'bg-action-focus',
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                  aria-hidden="true"
                />
              </Link>
            ))}

            <Link
              href="/contacto"
              aria-current={pathname === '/contacto' ? 'page' : undefined}
              className={cn(
                'ml-1 text-[11px] font-bold tracking-[0.14em] uppercase px-5 py-2.5 transition-all duration-200',
                isTransparent
                  ? 'bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25 hover:border-white/50'
                  : 'bg-[#1a2d5a] text-white border border-[#1a2d5a] hover:bg-[#213872] hover:border-[#213872]',
              )}
              style={{ borderRadius: '3px', boxShadow: isTransparent ? 'none' : '0 1px 3px rgb(26 45 90 / 0.2)' }}
            >
              Contacto
            </Link>
          </nav>

          {/* Mobile button */}
          <button
            className={cn(
              'md:hidden p-2 transition-colors rounded',
              isTransparent ? 'text-white' : 'text-stone-700 hover:bg-stone-100'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-white',
          mobileOpen ? 'max-h-80 shadow-lg' : 'max-h-0'
        )}
      >
        <nav
          className="page-container py-4 flex flex-col gap-0.5"
          aria-label="Menú móvil"
        >
          {[...navLinks, { label: 'Contacto', href: '/contacto' }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'py-3 px-3 text-sm font-medium rounded transition-colors',
                isActive(link.href)
                  ? 'text-action-primary bg-action-ghost'
                  : 'text-content-secondary hover:text-action-primary hover:bg-surface-section'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
