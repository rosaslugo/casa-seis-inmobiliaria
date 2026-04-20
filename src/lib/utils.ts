import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PropertyType } from '@/types'

// ── Tailwind class merging ───────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency formatting ──────────────────────────────────────
export function formatPrice(price: number, type?: PropertyType): string {
  const formatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  return type === 'rent' ? `${formatted}/mes` : formatted
}

export function formatPriceShort(price: number): string {
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(1)}M`
  }
  if (price >= 1_000) {
    return `$${(price / 1_000).toFixed(0)}K`
  }
  return `$${price}`
}

// ── Area formatting ──────────────────────────────────────────
export function formatArea(area: number): string {
  return `${area.toLocaleString('es-MX')} m²`
}

// ── Slug generation ──────────────────────────────────────────
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ── Date formatting ──────────────────────────────────────────
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// ── Property type labels ─────────────────────────────────────
export function getTypeLabel(type: PropertyType): string {
  return type === 'sale' ? 'Venta' : 'Renta'
}

// ── Property status labels ───────────────────────────────────
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Activo',
    sold: 'Vendido',
    rented: 'Rentado',
    inactive: 'Inactivo',
  }
  return labels[status] ?? status
}

// ── Get first image URL ──────────────────────────────────────
export function getPropertyThumbnail(
  images?: Array<{ image_url: string; order: number }>,
  fallback = '/placeholder-property.svg'
): string {
  if (!images || images.length === 0) return fallback
  const sorted = [...images].sort((a, b) => a.order - b.order)
  return sorted[0].image_url
}

// ── Truncate text ────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength).trim()}…`
}

// ── SEO site URL ─────────────────────────────────────────────
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://casaseis.mx'
}
