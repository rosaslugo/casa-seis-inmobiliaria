import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { getSiteUrl } from '@/lib/utils'
import { assertEnv } from '@/lib/env'

// ── Fonts — self-hosted, zero layout shift, no render-blocking ──
// ANTES: @import de Google Fonts en globals.css → bloquea el render
//        hasta que Google responda y Tailwind usaba vars que no existían.
// AHORA: next/font descarga las fuentes en build y las sirve self-hosted.
//        Las vars CSS (--font-display, --font-sans) quedan disponibles
//        globalmente y Tailwind las consume correctamente.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
})

// ── Env sanity check — fails fast at boot if misconfigured ──────
// Esto corre una vez al startup. Si falta alguna env crítica,
// verás un error claro en los logs de Vercel en lugar de 500s crípticos.
if (typeof window === 'undefined') {
  assertEnv()
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e2c56',
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Casa Seis Inmobiliaria — Propiedades en México',
    template: '%s | Casa Seis Inmobiliaria',
  },
  description:
    'Encuentra tu propiedad ideal en México. Casas, departamentos y terrenos en venta y renta. Casa Seis Inmobiliaria — elegancia y confianza.',
  keywords: ['inmobiliaria', 'propiedades', 'casas en venta', 'departamentos', 'renta', 'México'],
  authors: [{ name: 'Casa Seis Inmobiliaria' }],
  creator: 'Casa Seis Inmobiliaria',
  publisher: 'Casa Seis Inmobiliaria',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: 'KciAe0u15Yrb8QG4C1A9OHnrZ5cuurqi5Z8rKjnNsqs',
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: getSiteUrl(),
    siteName: 'Casa Seis Inmobiliaria',
    title: 'Casa Seis Inmobiliaria — Propiedades en México',
    description: 'Encuentra tu propiedad ideal. Casas, departamentos y terrenos en venta y renta.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Casa Seis Inmobiliaria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Seis Inmobiliaria',
    description: 'Propiedades en venta y renta en México.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}

