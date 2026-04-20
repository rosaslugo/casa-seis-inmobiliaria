#!/bin/bash
# ============================================================
# clear-image-cache.sh
#
# Uso: bash scripts/clear-image-cache.sh
#
# Limpia la caché de imágenes optimizadas de next/image
# en el directorio .next/cache/images/.
#
# Cuándo usarlo:
#   - Después de migrar al sistema de nombres UUID (primera vez)
#   - Si sospechas que imágenes stale siguen siendo servidas
#   - Después de cambiar minimumCacheTTL en next.config.js
#
# NOTA: Solo afecta el servidor de desarrollo/producción LOCAL.
# En Vercel, el deployment nuevo ya genera un cache fresco.
# ============================================================

set -e

CACHE_DIR=".next/cache/images"

if [ ! -d "$CACHE_DIR" ]; then
  echo "ℹ️  No existe $CACHE_DIR — nada que limpiar."
  exit 0
fi

SIZE=$(du -sh "$CACHE_DIR" 2>/dev/null | cut -f1)
COUNT=$(find "$CACHE_DIR" -type f | wc -l | tr -d ' ')

echo "🗑️  Limpiando caché de imágenes de Next.js..."
echo "   Directorio : $CACHE_DIR"
echo "   Archivos   : $COUNT"
echo "   Tamaño     : $SIZE"

rm -rf "$CACHE_DIR"
mkdir -p "$CACHE_DIR"

echo ""
echo "✅ Caché limpiada correctamente."
echo "   Reinicia el servidor: npm run dev  (o  npm run build && npm start)"
