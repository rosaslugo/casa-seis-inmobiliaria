import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'Panel Admin', template: '%s | Admin — Casa Seis' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-surface-section)' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <main className="p-5 pt-16 md:pt-10 md:p-10 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  )
}
