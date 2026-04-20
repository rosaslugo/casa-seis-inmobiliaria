/**
 * Constantes compartidas entre properties-server.ts y properties-client.ts.
 * Centraliza la query SELECT para evitar duplicación y posibles inconsistencias.
 *
 * ANTES: SELECT_PROPERTY estaba duplicado en properties-server.ts y properties-client.ts
 * AHORA: Una sola fuente de verdad.
 */
export const SELECT_PROPERTY = '*, images(id, image_url, alt_text, order)' as const
