export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminPropertiesTable from '@/components/admin/AdminPropertiesTable'
import type { Property } from '@/types'

export const metadata: Metadata = { title: 'Propiedades' }

export default async function AdminPropiedadesPage() {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const { data: properties } = await supabase
    .from('properties')
    .select('*, images(id, image_url, alt_text, order)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="overline mb-1">Gestión</p>
          <h1 className="font-display text-4xl text-stone-900 leading-tight">Propiedades</h1>
        </div>
        <Link href="/admin/propiedades/nueva" className="btn-primary text-xs py-3 px-5 self-start">
          <Plus size={14} />
          Nueva propiedad
        </Link>
      </div>

      <div
        className="bg-white border border-stone-200"
        style={{ borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
      >
        <AdminPropertiesTable properties={(properties ?? []) as Property[]} />
      </div>
    </div>
  )
}
