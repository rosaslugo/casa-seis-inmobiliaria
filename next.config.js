/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/avif', 'image/webp'],

    /**
     * ANTES: 86400 (24h) — con el sistema de nombres basado en Date.now(),
     * si la URL pública no cambiaba, next/image servía la versión cacheada
     * durante 24 horas aunque Supabase ya tuviera una imagen nueva.
     *
     * AHORA: 31536000 (1 año) — seguro porque con UUID cada imagen tiene
     * una URL única e inmutable. Si la imagen cambia, la URL cambia →
     * el cache nunca es stale. Además mejora rendimiento (menos re-fetch).
     */
    minimumCacheTTL: 31536000,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://maps.googleapis.com https://maps.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://maps.googleapis.com",
              "frame-src https://www.google.com",
            ].join('; '),
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        source: '/propiedades',
        has: [{ type: 'query', key: 'page', value: '1' }],
        destination: '/propiedades',
        permanent: true,
      },
    ]
  },

  compress: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: false },
  eslint:     { ignoreDuringBuilds: false },
}

module.exports = nextConfig
