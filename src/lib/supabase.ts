// Safe client-side re-exports only (no next/headers)
export { createSupabaseClient, uploadPropertyImage, deletePropertyImage } from './supabase-client'
export { createSupabaseAdmin, getPublicImageUrl } from './supabase-admin'
// createSupabaseServerClient is intentionally excluded — import directly from './supabase-server'
