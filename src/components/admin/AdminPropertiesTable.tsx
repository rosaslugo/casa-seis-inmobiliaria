'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, ExternalLink, Eye, EyeOff, Home, Plus } from 'lucide-react'
import { cn, formatPrice, getTypeLabel, getPropertyThumbnail } from '@/lib/utils'
import { adminDeleteProperty } from '@/lib/properties-client'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'
import type { Property } from '@/types'

interface AdminPropertiesTableProps {
  properties: Property[]
}

export default function AdminPropertiesTable({ properties }: AdminPropertiesTableProps) {
  const [items, setItems]               = useState(properties)
  const [deleting, setDeleting]         = useState<string | null>(null)
  const [confirmId, setConfirmId]       = useState<string | null>(null)
  const [confirmTitle, setConfirmTitle] = useState('')
  const { toasts, addToast, removeToast } = useToast()

  const requestDelete = useCallback((id: string, title: string) => {
    setConfirmId(id)
    setConfirmTitle(title)
  }, [])

  const handleDeleteConfirmed = useCallback(async () => {
    if (!confirmId) return
    setConfirmId(null)
    setDeleting(confirmId)
    const { error } = await adminDeleteProperty(confirmId)
    if (error) {
      addToast(`Error al eliminar: ${error}`, 'error')
    } else {
      setItems((prev) => prev.filter((p) => p.id !== confirmId))
      addToast('Propiedad eliminada correctamente', 'success')
    }
    setDeleting(null)
  }, [confirmId, addToast])

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div
          className="w-14 h-14 bg-action-ghost border border-action-ghostBorder flex items-center justify-center mx-auto mb-5"
          style={{ borderRadius: '10px' }}
        >
          <Home size={22} className="text-content-icon" />
        </div>
        <p className="text-sm font-semibold text-stone-700 mb-1.5">No hay propiedades aún</p>
        <p className="text-xs text-stone-400 mb-6">Empieza agregando tu primera propiedad al catálogo.</p>
        <Link href="/admin/propiedades/nueva" className="btn-primary text-xs py-2.5 px-5 inline-flex">
          <Plus size={13} />
          Crear primera propiedad
        </Link>
      </div>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog
        open={confirmId !== null}
        title="Eliminar propiedad"
        description={`¿Estás seguro de que deseas eliminar "${confirmTitle}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmId(null)}
      />

      {/* ── Mobile: card list ── */}
      <div className="md:hidden divide-y divide-stone-100">
        {items.map((property) => {
          const thumbnail  = getPropertyThumbnail(property.images)
          const isDeleting = deleting === property.id
          return (
            <div
              key={property.id}
              className={cn(
                'flex items-center gap-3 px-4 py-4 transition-opacity',
                isDeleting && 'opacity-40 pointer-events-none'
              )}
            >
              <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-stone-100" style={{ borderRadius: '6px' }}>
                <Image src={thumbnail} alt={property.title} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{property.title}</p>
                <p className="text-xs text-stone-400 truncate mb-1.5">{property.city}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 tracking-wide',
                      property.type === 'sale'
                        ? 'bg-accent-surface text-accent-subtle border border-accent-border'
                        : 'bg-surface-section text-content-secondary'
                    )}
                    style={{ borderRadius: '3px' }}
                  >
                    {getTypeLabel(property.type)}
                  </span>
                  <span className={cn(
                    'inline-flex items-center gap-1 text-[10px] font-semibold',
                    property.status === 'active' ? 'text-emerald-600' : 'text-stone-400'
                  )}>
                    {property.status === 'active' ? <Eye size={10} /> : <EyeOff size={10} />}
                    {property.status === 'active' ? 'Activo' : property.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <Link href={`/propiedades/${property.slug}`} target="_blank"
                  className="p-2 text-stone-400 hover:text-stone-600 transition-colors rounded" title="Ver en sitio">
                  <ExternalLink size={15} />
                </Link>
                <Link href={`/admin/propiedades/${property.id}`}
                  className="p-2 text-content-icon hover:text-action-muted transition-colors rounded" title="Editar">
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => requestDelete(property.id, property.title)}
                  disabled={isDeleting}
                  className="p-2 text-stone-400 hover:text-red-500 transition-colors rounded disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Desktop: table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100">
              {['Propiedad', 'Tipo', 'Precio', 'Ciudad', 'Estado', ''].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-[10px] font-bold tracking-[0.14em] uppercase text-stone-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((property) => {
              const thumbnail  = getPropertyThumbnail(property.images)
              const isDeleting = deleting === property.id

              return (
                <tr
                  key={property.id}
                  className={cn(
                    'group border-b border-stone-50 transition-colors',
                    isDeleting ? 'opacity-40' : 'hover:bg-stone-50/70'
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="relative w-14 h-10 shrink-0 overflow-hidden bg-stone-100"
                        style={{ borderRadius: '4px' }}
                      >
                        <Image src={thumbnail} alt={property.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate max-w-[200px]">
                          {property.title}
                        </p>
                        <p className="text-xs text-stone-400 truncate max-w-[200px]">{property.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2.5 py-1 tracking-wide',
                        property.type === 'sale'
                          ? 'bg-accent-surface text-accent-subtle border border-accent-border'
                          : 'bg-surface-section text-content-secondary'
                      )}
                      style={{ borderRadius: '3px' }}
                    >
                      {getTypeLabel(property.type)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-stone-700">
                      {formatPrice(property.price, property.type)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-stone-500">{property.city}</td>

                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1',
                        property.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-stone-100 text-stone-500'
                      )}
                      style={{ borderRadius: '3px' }}
                    >
                      {property.status === 'active' ? <Eye size={10} /> : <EyeOff size={10} />}
                      {property.status === 'active' ? 'Activo' : property.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/propiedades/${property.slug}`}
                        target="_blank"
                        className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors rounded"
                        title="Ver en sitio"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/admin/propiedades/${property.id}`}
                        className="p-1.5 text-content-icon hover:text-action-muted transition-colors rounded"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => requestDelete(property.id, property.title)}
                        disabled={isDeleting}
                        className="p-1.5 text-stone-400 hover:text-red-500 transition-colors rounded disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
