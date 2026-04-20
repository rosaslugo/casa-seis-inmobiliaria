import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Dimensiones reales del archivo de logo: 1021 × 712 px
 * Aspect ratio: 1021 / 712 ≈ 1.4339
 *
 * USO:
 *   <Logo />                       → dark, height=36 (header público)
 *   <Logo variant="light" />       → blanco (sidebar admin oscuro)
 *   <Logo height={34} />           → tamaño personalizado por altura
 *   <Logo width={120} />           → tamaño personalizado por ancho
 *
 * REGLA: nunca pasar width + height con valores arbitrarios — el componente
 * calcula la dimensión faltante para mantener el aspect ratio exacto.
 *
 * CONSISTENCIA POR CONTEXTO:
 *   Header público   → height={34}  variant="dark"
 *   Sidebar admin    → height={36}  variant="light"  (era 30, muy pequeño)
 *   Login admin      → height={38}  variant="dark"
 */

const LOGO_W = 1021
const LOGO_H = 712
const ASPECT = LOGO_W / LOGO_H // 1.4339...

interface LogoProps {
  /** 'dark' para fondos claros (header, login). 'light' para fondos oscuros (sidebar). */
  variant?: 'dark' | 'light'
  /** Altura en px. Prioridad sobre `width`. Default: 36. */
  height?: number
  /** Ancho en px. Solo se usa si `height` no está definido. */
  width?: number
  className?: string
  priority?: boolean
}

export default function Logo({
  variant  = 'dark',
  height,
  width,
  className,
  priority = false,
}: LogoProps) {
  const src = variant === 'light' ? '/logo-white.png' : '/logo-casa-seis.png'

  // Resolver dimensiones conservando aspect ratio
  const resolvedH = height ?? (width ? Math.round(width / ASPECT) : 36)
  const resolvedW = Math.round(resolvedH * ASPECT)

  return (
    <Image
      src={src}
      alt="Casa Seis Inmobiliaria"
      width={resolvedW}
      height={resolvedH}
      priority={priority}
      // object-contain es crítico: evita que next/image recorte o estire el logo
      // cuando el contenedor padre tenga dimensiones diferentes
      className={cn('object-contain', className)}
    />
  )
}
