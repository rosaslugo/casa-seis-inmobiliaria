'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertyImage } from '@/types'

interface ImageGalleryProps {
  images: PropertyImage[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Touch swipe support
  const touchStartX = useRef<number | null>(null)

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  // Keyboard navigation — arrows + Escape
  useEffect(() => {
    if (images.length <= 1) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      if (e.key === 'Escape')     setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, images.length])

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] md:aspect-[16/9] bg-stone-900 flex items-center justify-center">
        <p className="text-stone-600 text-sm">Sin imágenes disponibles</p>
      </div>
    )
  }

  return (
    <>
      {/* Main gallery */}
      <div className="relative">

        {/* Main image */}
        <div
          className="relative aspect-[4/3] md:aspect-[16/9] cursor-zoom-in group overflow-hidden"
          onClick={() => setLightboxOpen(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={images[activeIndex].image_url}
            alt={images[activeIndex].alt_text ?? `${title} - imagen ${activeIndex + 1}`}
            fill
            sizes="100vw"
            className="object-cover transition-opacity duration-300"
            priority
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 bg-stone-950/60 backdrop-blur-sm px-3 py-1.5">
            <span className="text-xs text-white font-medium tracking-wide">
              {activeIndex + 1} / {images.length}
            </span>
          </div>

          {/* Navigation arrows — always visible on mobile, hover on desktop */}
          {images.length > 1 && (
            <>
              <button
                aria-label="Imagen anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm
                           flex items-center justify-center
                           md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                onClick={(e) => { e.stopPropagation(); prev() }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="Imagen siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm
                           flex items-center justify-center
                           md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                onClick={(e) => { e.stopPropagation(); next() }}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 bg-stone-900 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={cn(
                  'relative shrink-0 w-24 h-16 md:w-28 md:h-20 overflow-hidden transition-all duration-200',
                  i === activeIndex
                    ? 'ring-2 ring-navy-400 opacity-100'
                    : 'opacity-50 hover:opacity-80'
                )}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text ?? `thumbnail ${i + 1}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            aria-label="Cerrar"
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={22} />
          </button>

          <div
            className="relative w-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={images[activeIndex].image_url}
                alt={images[activeIndex].alt_text ?? title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  aria-label="Imagen anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  onClick={prev}
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                  aria-label="Imagen siguiente"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  onClick={next}
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </>
            )}

            <p className="text-center text-white/50 text-xs mt-4 tracking-wide">
              {activeIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
