export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminForm from '@/components/admin/AdminForm'

export const metadata: Metadata = { title: 'Nueva Propiedad' }

export default async function NuevaPropiedadPage() {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors mb-6 group"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1 duration-200" />
          Volver al dashboard
        </Link>
        <p className="overline mb-1">Agregar</p>
        <h1 className="font-display text-4xl text-stone-900 leading-tight">Nueva propiedad</h1>
      </div>

      <div
        className="bg-white border border-stone-200 p-6 md:p-10"
        style={{ borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
      >
        <AdminForm mode="create" />
      </div>
    </div>
  )
}
