'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Home, Plus, LogOut, ExternalLink, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createSupabaseClient } from '@/lib/supabase-client'
import Logo from '@/components/ui/Logo'

const NAV_SECTIONS = [
  {
    label: 'General',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',   href: '/admin' },
      { icon: Home,            label: 'Propiedades', href: '/admin/propiedades' },
    ],
  },
  {
    label: 'Acciones',
    items: [
      { icon: Plus, label: 'Nueva propiedad', href: '/admin/propiedades/nueva' },
    ],
  },
]

function SidebarNav({
  pathname,
  userEmail,
  onClose,
  onLogout,
}: {
  pathname: string
  userEmail: string | null
  onClose: () => void
  onLogout: () => void
}) {
  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : '?'

  return (
    <aside className="admin-sidebar w-full h-full flex flex-col">

      {/* Logo */}
      <div className="admin-sidebar__header px-5 py-5 flex items-start justify-between">
        <Link href="/admin" aria-label="Casa Seis — Dashboard">
          <Logo variant="light" height={46} priority />
          <p className="admin-sidebar__subtitle text-[10px] tracking-[0.16em] uppercase mt-2.5 font-medium">
            Panel de administración
          </p>
        </Link>
        <button
          onClick={onClose}
          className="admin-sidebar__close md:hidden p-1 transition-colors mt-1 shrink-0"
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5" aria-label="Navegación admin">
        {NAV_SECTIONS.map((section, si) => (
          <div key={section.label} className={cn(si > 0 && 'mt-1')}>
            {si > 0 && (
              <div className="admin-sidebar__divider h-px mx-2 my-3" role="separator" />
            )}
            <p className="admin-sidebar__section-label px-3 pt-1 pb-2 text-[9px] font-bold tracking-[0.2em] uppercase select-none">
              {section.label}
            </p>
            {section.items.map(({ icon: Icon, label, href }) => {
              const isActive =
                href === '/admin'
                  ? pathname === '/admin'
                  : pathname === href || (href !== '/admin/propiedades' && pathname.startsWith(href))

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'admin-sidebar__nav-item relative flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold tracking-wide transition-all duration-150',
                    isActive ? 'admin-sidebar__nav-item--active' : 'admin-sidebar__nav-item--idle'
                  )}
                >
                  {isActive && (
                    <span className="admin-sidebar__active-bar absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5" aria-hidden="true" />
                  )}
                  <Icon size={14} aria-hidden="true" className={cn('shrink-0', isActive ? 'opacity-100' : 'opacity-60')} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar__footer px-3 pb-4 pt-3 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-sidebar__footer-link flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold tracking-wide transition-all duration-150"
        >
          <ExternalLink size={13} aria-hidden="true" className="shrink-0 opacity-60" />
          <span>Ver sitio</span>
        </a>

        <button
          onClick={onLogout}
          className="admin-sidebar__logout w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold tracking-wide transition-all duration-150 text-left"
        >
          <LogOut size={13} aria-hidden="true" className="shrink-0 opacity-60" />
          <span>Cerrar sesión</span>
        </button>

        {/* User */}
        <div className="admin-sidebar__user flex items-center gap-3 px-3 py-3 mt-2">
          <div className="admin-sidebar__avatar w-7 h-7 flex items-center justify-center shrink-0" aria-hidden="true">
            <span className="text-[11px] font-bold leading-none">{avatarLetter}</span>
          </div>
          <div className="min-w-0">
            <p className="admin-sidebar__user-label text-[10px] tracking-wide leading-none mb-1">Sesión activa</p>
            <p className="admin-sidebar__user-email text-[11px] truncate leading-none font-medium" title={userEmail ?? ''}>
              {userEmail ?? '—'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function AdminSidebar() {
  const pathname    = usePathname()
  const router      = useRouter()
  const [userEmail, setUserEmail]   = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const supabase = createSupabaseClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        className="admin-sidebar__hamburger md:hidden fixed top-4 left-4 z-40 w-9 h-9 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Abrir menú"
        aria-expanded={mobileOpen}
      >
        <Menu size={17} />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-56 min-h-screen shrink-0">
        <SidebarNav
          pathname={pathname}
          userEmail={userEmail}
          onClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 backdrop-blur-sm admin-sidebar__overlay"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="md:hidden fixed inset-y-0 left-0 z-50 w-64 shadow-2xl">
            <SidebarNav
              pathname={pathname}
              userEmail={userEmail}
              onClose={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </>
      )}
    </>
  )
}
