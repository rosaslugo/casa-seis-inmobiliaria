import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="error-page-bg min-h-screen flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md animate-fade-up">
        {/* Big 404 */}
        <p
          className="font-display font-light select-none tabular-nums leading-none mb-2"
          style={{ fontSize: 'clamp(6rem, 18vw, 10rem)', color: 'var(--color-action-ghostBorder)' }}
          aria-hidden="true"
        >
          404
        </p>

        {/* Accent line */}
        <div
          className="w-10 h-[2px] mx-auto mb-7"
          style={{ background: 'linear-gradient(90deg, var(--color-action-primary), var(--color-action-ghostBorder))' }}
          aria-hidden="true"
        />

        <h1 className="font-display text-2xl text-stone-800 mb-3">Página no encontrada</h1>
        <p className="text-sm text-stone-500 leading-relaxed mb-10 max-w-sm mx-auto">
          La página que buscas no existe o fue movida.
          Prueba buscando en el catálogo de propiedades.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary text-xs py-3.5 px-7">
            <ArrowLeft size={14} aria-hidden="true" />
            Ir al inicio
          </Link>
          <Link href="/propiedades" className="btn-secondary text-xs py-3.5 px-7">
            <Search size={14} aria-hidden="true" />
            Ver propiedades
          </Link>
        </div>
      </div>
    </div>
  )
}
