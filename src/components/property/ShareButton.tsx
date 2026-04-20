'use client'

import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
}

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('URL copiada al portapapeles'))
        .catch(() => {})
    }
  }

  return (
    <button
      onClick={handleShare}
      className="btn-arch-ghost w-full justify-center mt-4 text-xs"
    >
      <Share2 size={13} />
      Compartir propiedad
    </button>
  )
}
