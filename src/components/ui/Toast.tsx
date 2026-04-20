'use client'

import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Toast } from '@/hooks/useToast'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const configs = {
  success: {
    icon:    CheckCircle,
    style:   { background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' },
    iconCls: 'text-emerald-600',
  },
  error: {
    icon:    XCircle,
    style:   { background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
    iconCls: 'text-red-500',
  },
  info: {
    icon:    Info,
    style:   {
      background:  'var(--color-action-ghost)',
      borderColor: 'var(--color-action-ghostBorder)',
      color:       'var(--color-action-primary)',
    },
    iconCls: 'text-action-muted',
  },
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const { icon: Icon, style, iconCls } = configs[toast.type]
        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 px-4 py-3.5 border text-sm animate-fade-up"
            style={{ ...style, borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
          >
            <Icon size={15} className={cn('shrink-0 mt-0.5', iconCls)} />
            <span className="flex-1 leading-snug font-medium">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="opacity-50 hover:opacity-100 transition-opacity p-0.5"
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
