export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminForm from '@/components/admin/AdminForm'
import type { Property } from '@/types'

export const metadata: Metadata = { title: 'Editar Propiedad' }

interface PageProps {
  params: { id: string }
}

export default async function EditarPropiedadPage({ params }: PageProps) {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const { data: property } = await supabase
    .from('properties')
    .select('*, images(id, image_url, alt_text, order)')
    .eq('id', params.id)
    .single()

  if (!property) notFound()

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
        <p className="overline mb-1">Editar</p>
        <h1 className="font-display text-4xl text-stone-900 leading-tight truncate max-w-xl">
          {property.title}
        </h1>
      </div>

      <div
        className="bg-white border border-stone-200 p-6 md:p-10"
        style={{ borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
      >
        <AdminForm mode="edit" property={property as Property} />
      </div>
    </div>
  )
}
