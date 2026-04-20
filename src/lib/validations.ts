// ── Shared Zod schemas — single source of truth ──────────────
// Used by both AdminForm (client) and API routes (server)
import { z } from 'zod'
import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_TYPES } from '@/constants'

export const slugSchema = z
  .string()
  .min(3, 'El slug debe tener al menos 3 caracteres')
  .max(100, 'El slug es demasiado largo')
  .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones')
  .refine((s) => !s.startsWith('-') && !s.endsWith('-'), 'El slug no puede empezar ni terminar con guión')

export const propertySchema = z.object({
  title:       z.string().min(3, 'El título debe tener al menos 3 caracteres').max(150),
  slug:        slugSchema,
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres').max(5000),
  price:       z.number({ invalid_type_error: 'El precio es requerido' }).positive('El precio debe ser mayor a 0').max(999_999_999),
  location:    z.string().min(2).max(200),
  address:     z.string().min(5, 'La dirección es requerida').max(300),
  city:        z.string().min(2, 'La ciudad es requerida').max(100),
  state:       z.string().min(2, 'El estado es requerido').max(100),
  latitude:    z.number({ invalid_type_error: 'La latitud es requerida' }).min(-90).max(90),
  longitude:   z.number({ invalid_type_error: 'La longitud es requerida' }).min(-180).max(180),
  type:        z.enum(['sale', 'rent'], { required_error: 'El tipo es requerido' }),
  status:      z.enum(['active', 'sold', 'rented', 'inactive']),
  bedrooms:    z.number().int().min(0).max(50),
  bathrooms:   z.number().int().min(0).max(50),
  area:        z.number().positive('La superficie debe ser mayor a 0').max(100_000),
  parking:     z.number().int().min(0).max(50),
  featured:    z.boolean(),
})

export type PropertyFormData = z.infer<typeof propertySchema>

export const imageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_IMAGE_SIZE_BYTES, `El archivo no puede superar ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`)
  .refine(
    (f) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(f.type),
    'Solo se permiten imágenes JPG, PNG o WebP'
  )

export const contactSchema = z.object({
  name:    z.string().min(2, 'El nombre es requerido').max(100),
  email:   z.string().email('Correo electrónico inválido'),
  phone:   z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(2000),
})

export type ContactFormData = z.infer<typeof contactSchema>
