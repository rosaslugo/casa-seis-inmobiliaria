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
    default: 'Casa Seis Inmobiliaria — Casas y Propiedades en Los Mochis, Sinaloa',
    template: '%s | Casa Seis Inmobiliaria Los Mochis',
  },
  description:
    'Inmobiliaria en Los Mochis, Sinaloa. Casas, departamentos y terrenos en venta y renta. Asesoría personalizada sin costo. Llámanos al +52 668 116 3380.',
  keywords: [
    // Búsquedas locales principales
    'inmobiliaria Los Mochis',
    'casas en venta Los Mochis',
    'casas en renta Los Mochis',
    'departamentos en venta Los Mochis',
    'departamentos en renta Los Mochis',
    'propiedades Los Mochis Sinaloa',
    // Marca
    'Casa Seis Inmobiliaria',
    'Casa Seis Los Mochis',
    // Variantes regionales
    'inmobiliaria Sinaloa',
    'bienes raíces Los Mochis',
    'bienes raíces Sinaloa',
    'casas Los Mochis',
    'terrenos en venta Los Mochis',
    // Intención de compra/renta
    'comprar casa Los Mochis',
    'rentar casa Los Mochis',
    'vender propiedad Los Mochis',
    'valuación de propiedades Los Mochis',
  ],
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
    title: 'Casa Seis Inmobiliaria — Casas y Propiedades en Los Mochis, Sinaloa',
    description: 'Casas, departamentos y terrenos en venta y renta en Los Mochis, Sinaloa. Asesoría personalizada sin costo. ¡Contáctanos hoy!',
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
    description: 'Casas y propiedades en venta y renta en Los Mochis, Sinaloa. ¡Contáctanos!',
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

