'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationBarProps {
  currentPage:  number
  totalPages:   number
  searchParams: Record<string, string | undefined>
}

export default function PaginationBar({ currentPage, totalPages, searchParams }: PaginationBarProps) {
  const pathname = usePathname()

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'pagina' && value) params.set(key, value)
    })
    if (page > 1) params.set('pagina', String(page))
    const query = params.toString()
    return `${pathname}${query ? `?${query}` : ''}`
  }

  const pages   = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  )

  const baseBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 150ms ease',
    border: '1px solid',
  }

  return (
    <nav aria-label="Paginación de resultados" className="flex items-center justify-center gap-1.5">
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          aria-label="Página anterior"
          className="btn-icon w-9 h-9"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </Link>
      ) : (
        <span
          className="btn-icon w-9 h-9 opacity-25 cursor-not-allowed"
          aria-disabled="true"
          aria-label="No hay página anterior"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </span>
      )}

      {visible.map((page, i) => {
        const prev         = visible[i - 1]
        const showEllipsis = prev && page - prev > 1

        return (
          <span key={page} className="flex items-center gap-1.5">
            {showEllipsis && (
              <span
                className="w-9 h-9 flex items-center justify-center text-xs text-stone-400"
                aria-hidden="true"
              >
                …
              </span>
            )}
            {page === currentPage ? (
              <span
                aria-current="page"
                aria-label={`Página ${page}, actual`}
                className="w-9 h-9 flex items-center justify-center text-xs font-bold text-white bg-action-primary border border-action-primary"
                style={{ borderRadius: '4px' }}
              >
                {page}
              </span>
            ) : (
              <Link
                href={buildUrl(page)}
                aria-label={`Ir a página ${page}`}
                className="w-9 h-9 flex items-center justify-center text-xs font-semibold text-content-secondary bg-surface border border-border hover:border-action-ghostBorder hover:text-action-muted transition-all duration-150"
                style={{ borderRadius: '4px' }}
              >
                {page}
              </Link>
            )}
          </span>
        )
      })}

      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          aria-label="Página siguiente"
          className="btn-icon w-9 h-9"
        >
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      ) : (
        <span
          className="btn-icon w-9 h-9 opacity-25 cursor-not-allowed"
          aria-disabled="true"
          aria-label="No hay página siguiente"
        >
          <ChevronRight size={14} aria-hidden="true" />
        </span>
      )}
    </nav>
  )
}
