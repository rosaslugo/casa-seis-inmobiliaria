'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCcw, Home } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="error-page-bg min-h-screen flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <div
          className="w-14 h-14 bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-7"
          style={{ borderRadius: '12px' }}
        >
          <span className="text-2xl" aria-hidden="true">⚠️</span>
        </div>
        <div
          className="w-8 h-[2px] mx-auto mb-6"
          style={{ background: 'var(--color-action-primary)' }}
          aria-hidden="true"
        />
        <h1 className="font-display text-3xl text-stone-800 mb-3">Algo salió mal</h1>
        <p className="text-sm text-stone-500 leading-relaxed mb-9">
          Ocurrió un error inesperado. Por favor intenta de nuevo.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary text-xs py-3 px-6">
            <RefreshCcw size={13} />
            Intentar de nuevo
          </button>
          <Link href="/" className="btn-secondary text-xs py-3 px-6">
            <Home size={13} />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
