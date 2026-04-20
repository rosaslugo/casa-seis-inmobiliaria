'use client'

import { useEffect } from 'react'

// Catches errors in the root layout — last resort boundary
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In production: report to Sentry / Datadog here
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="es">
      <body className="min-h-screen bg-stone-950 flex items-center justify-center text-white p-6">
        <div className="text-center max-w-md">
          <div className="w-8 h-px bg-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-light mb-4">Error del sistema</h1>
          <p className="text-stone-400 text-sm mb-8">
            Algo salió mal. El equipo ha sido notificado.
          </p>
          {error.digest && (
            <p className="text-stone-600 text-xs mb-6 font-mono">
              Ref: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="px-8 py-3 border border-stone-600 text-sm hover:border-stone-400 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  )
}
