export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Home, TrendingUp, DollarSign, Eye } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminPropertiesTable from '@/components/admin/AdminPropertiesTable'
import { STAT_VARIANT } from '@/lib/tokens'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

async function getAdminStats(userId: string) {
  const supabase = createSupabaseServerClient()
  const [total, sales, rents, active] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('type', 'sale'),
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('type', 'rent'),
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ])
  return {
    total:  total.count  ?? 0,
    sales:  sales.count  ?? 0,
    rents:  rents.count  ?? 0,
    active: active.count ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const stats = await getAdminStats(session.user.id)
  const { data: properties } = await supabase
    .from('properties')
    .select('*, images(id, image_url, order)')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="overline mb-1">
            Bienvenido
          </p>
          <h1 className="font-display text-4xl text-stone-900 leading-tight">Dashboard</h1>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="btn-primary text-xs py-3 px-5 self-start"
        >
          <Plus size={14} />
          Nueva propiedad
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { icon: Home,       label: 'Total propiedades', value: stats.total,  variant: 'properties' },
          { icon: Eye,        label: 'Activas',           value: stats.active, variant: 'active'     },
          { icon: TrendingUp, label: 'En venta',          value: stats.sales,  variant: 'sale'       },
          { icon: DollarSign, label: 'En renta',          value: stats.rents,  variant: 'rent'       },
        ] as const).map(({ icon: Icon, label, value, variant }) => {
          const v = STAT_VARIANT[variant]
          return (
            <div
              key={label}
              className="bg-surface border border-border p-6 transition-all duration-200 hover:border-border-interactive hover:shadow-card"
              style={{ borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center mb-4 ${v.iconWrap}`}
                style={{ borderRadius: '8px' }}
              >
                <Icon size={18} className={v.icon} />
              </div>
              <p className="font-display text-4xl text-content-primary mb-1 leading-none">{value}</p>
              <p className="text-[11px] font-medium text-content-tertiary tracking-wide mt-1">{label}</p>
            </div>
          )
        })}
      </div>

      {/* ── Properties table ── */}
      <div
        className="bg-surface border border-border"
        style={{ borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div>
            <h2 className="text-sm font-semibold text-stone-800 tracking-tight">Propiedades recientes</h2>
            <p className="text-xs text-stone-400 mt-0.5">Últimas {Math.min(properties?.length ?? 0, 20)} actualizadas</p>
          </div>
          <Link
            href="/admin/propiedades/nueva"
            className="text-[11px] font-bold tracking-[0.1em] uppercase text-action-muted hover:text-action-primary transition-colors flex items-center gap-1.5"
          >
            <Plus size={12} />
            Agregar
          </Link>
        </div>
        <AdminPropertiesTable properties={properties ?? []} />
      </div>
    </div>
  )
}
