'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase-client'
import Logo from '@/components/ui/Logo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div
      className="admin-login-hero min-h-screen flex items-center justify-center p-6"
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,94,166,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo variant="light" height={42} priority />
          </div>
          <p
            className="text-[10px] font-bold tracking-[0.22em] uppercase"
            style={{ color: 'rgba(91,123,191,0.6)' }}
          >
            Panel de administración
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8"
          style={{
            background: 'rgba(255,255,255,0.97)',
            borderRadius: '10px',
            boxShadow: '0 24px 64px -16px rgba(13,20,40,0.5), 0 4px 16px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.8)',
          }}
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-9 h-9 bg-action-ghost flex items-center justify-center shrink-0"
              style={{ borderRadius: '8px' }}
            >
              <Shield size={16} className="text-action-muted" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-stone-900 leading-tight">Iniciar sesión</h1>
              <p className="text-xs text-stone-400 mt-0.5">Acceso exclusivo para administradores</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div>
              <label htmlFor="admin-email" className="label-arch block mb-2.5">
                Correo electrónico
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@casaseis.mx"
                className="input-arch"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="label-arch block mb-2.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-arch pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="px-4 py-3 text-xs text-red-700"
                style={{
                  background: 'rgba(254,242,242,0.8)',
                  border: '1px solid rgba(252,165,165,0.5)',
                  borderRadius: '4px',
                }}
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-xs"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <LogIn size={14} />
                  Ingresar al panel
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6 admin-login-back">
          ←{' '}
          <a href="/" className="admin-login-back__link transition-colors duration-150">
            Volver al sitio
          </a>
        </p>
      </div>
    </div>
  )
}
