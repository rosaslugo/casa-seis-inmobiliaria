'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?:  string
  danger?: boolean
  onConfirm: () => void
  onCancel:  () => void
}

export function ConfirmDialog({
  open, title, description,
  confirmLabel = 'Confirmar',
  cancelLabel  = 'Cancelar',
  danger = false,
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) confirmRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,20,40,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white w-full max-w-md p-8 animate-scale-in"
        style={{
          borderRadius: '10px',
          boxShadow: '0 24px 64px -16px rgba(13,20,40,0.35)',
          border: '1px solid rgba(231,229,228,0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="flex items-start gap-4 mb-7">
          <div
            className={`w-10 h-10 flex items-center justify-center shrink-0 ${
              danger ? 'bg-red-50' : 'bg-amber-50'
            }`}
            style={{ borderRadius: '8px' }}
          >
            <AlertTriangle
              size={18}
              className={danger ? 'text-red-500' : 'text-amber-500'}
            />
          </div>
          <div>
            <h2 id="dialog-title" className="font-display text-xl text-stone-900 mb-1.5">
              {title}
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-xs py-2.5 px-5">
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={danger ? 'btn-danger text-xs py-2.5 px-5' : 'btn-primary text-xs py-2.5 px-5'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
