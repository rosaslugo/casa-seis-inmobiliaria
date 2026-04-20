'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn, generateSlug } from '@/lib/utils'
import { propertySchema, type PropertyFormData } from '@/lib/validations'
import {
  adminCreateProperty,
  adminUpdateProperty,
  adminAddPropertyImage,
  adminDeletePropertyImage,
} from '@/lib/properties-client'
import {
  uploadPropertyImage,
  deletePropertyImageFromStorage,
  extractStoragePath,
} from '@/lib/supabase-client'
import type { Property, PropertyImage } from '@/types'

// ── Field wrapper — definido FUERA del componente para no re-crearse ──
interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className="label-arch block mb-2">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-text mb-6 pb-3 border-b border-border flex items-center gap-2">
      <span className="w-4 h-px bg-accent inline-block" aria-hidden="true" />
      {children}
    </h2>
  )
}

interface AdminFormProps {
  property?: Property
  mode: 'create' | 'edit'
}

export default function AdminForm({ property, mode }: AdminFormProps) {
  const router = useRouter()
  const [saving, setSaving]             = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [existingImages, setExistingImages]   = useState<PropertyImage[]>(
    [...(property?.images ?? [])].sort((a, b) => a.order - b.order)
  )
  const [newImagePreviews, setNewImagePreviews] = useState<{ file: File; preview: string }[]>([])
  const [globalError, setGlobalError]   = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title:       property?.title       ?? '',
      slug:        property?.slug        ?? '',
      description: property?.description ?? '',
      price:       property?.price       ?? undefined,
      location:    property?.location    ?? '',
      address:     property?.address     ?? '',
      city:        property?.city        ?? '',
      state:       property?.state       ?? '',
      latitude:    property?.latitude    ?? undefined,
      longitude:   property?.longitude   ?? undefined,
      type:        property?.type        ?? 'sale',
      status:      property?.status      ?? 'active',
      bedrooms:    property?.bedrooms    ?? 0,
      bathrooms:   property?.bathrooms   ?? 0,
      area:        property?.area        ?? undefined,
      parking:     property?.parking     ?? 0,
      featured:    property?.featured    ?? false,
    },
  })

  const titleValue = watch('title')

  const handleTitleBlur = () => {
    if (mode === 'create' && titleValue) {
      setValue('slug', generateSlug(titleValue))
    }
  }

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return
    const allowed = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const previews = allowed.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setNewImagePreviews((prev) => [...prev, ...previews])
  }

  const removeNewImage = (index: number) => {
    setNewImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  /**
   * CORRECCIÓN CRÍTICA:
   * La versión original solo borraba el registro en la tabla `images`
   * pero dejaba el archivo en Supabase Storage → archivos huérfanos +
   * la URL antigua podía seguir siendo servida por el CDN.
   *
   * Ahora: primero borra de Storage, luego borra de la DB.
   */
  const removeExistingImage = async (image: PropertyImage) => {
    if (!confirm('¿Eliminar esta imagen?')) return

    // 1. Borrar de Supabase Storage (evita archivos huérfanos)
    const storagePath = extractStoragePath(image.image_url)
    if (storagePath) {
      const { error: storageError } = await deletePropertyImageFromStorage(storagePath)
      if (storageError) {
        // No bloquear si falla Storage — puede que ya no exista el archivo
        // pero sí queremos eliminar el registro de DB
        console.warn('Storage delete warning:', storageError)
      }
    }

    // 2. Borrar registro de la tabla `images`
    const { error } = await adminDeletePropertyImage(image.id)
    if (error) { alert(`Error al eliminar imagen: ${error}`); return }

    setExistingImages((prev) => prev.filter((img) => img.id !== image.id))
  }

  const onSubmit = async (data: PropertyFormData) => {
    setSaving(true)
    setGlobalError('')

    try {
      let propertyId = property?.id

      if (mode === 'create') {
        const { id, error } = await adminCreateProperty(data)
        if (error || !id) { setGlobalError(error ?? 'Error al crear propiedad'); return }
        propertyId = id
      } else {
        const { error } = await adminUpdateProperty(property!.id, data)
        if (error) { setGlobalError(error); return }
      }

      if (newImagePreviews.length > 0 && propertyId) {
        setUploadingImages(true)
        const startOrder = existingImages.length
        for (let i = 0; i < newImagePreviews.length; i++) {
          const { url, error } = await uploadPropertyImage(newImagePreviews[i].file, propertyId)
          if (error || !url) {
            console.error('Error uploading image:', error)
            continue
          }
          await adminAddPropertyImage(propertyId, url, startOrder + i)
        }
        setUploadingImages(false)
      }

      // Limpiar previews (liberar memoria de ObjectURLs)
      newImagePreviews.forEach((p) => URL.revokeObjectURL(p.preview))

      router.push('/admin')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {globalError && (
        <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600">
          {globalError}
        </div>
      )}

      {/* ── Información básica ── */}
      <section>
        <SectionTitle>Información básica</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Título" error={errors.title?.message}>
            <input
              {...register('title')}
              onBlur={handleTitleBlur}
              placeholder="Casa moderna en el centro"
              className="input-arch"
            />
          </Field>

          <Field label="Slug (URL)" error={errors.slug?.message}>
            <input
              {...register('slug')}
              placeholder="casa-moderna-centro"
              className="input-arch font-mono text-xs"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Descripción" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Describe la propiedad con detalle…"
                className="input-arch resize-y min-h-[120px]"
              />
            </Field>
          </div>
        </div>
      </section>

      {/* ── Precio y tipo ── */}
      <section>
        <SectionTitle>Precio y tipo</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Precio (MXN)" error={errors.price?.message}>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              placeholder="2500000"
              className="input-arch"
            />
          </Field>

          <Field label="Tipo" error={errors.type?.message}>
            <select {...register('type')} className="input-arch cursor-pointer">
              <option value="sale">Venta</option>
              <option value="rent">Renta</option>
            </select>
          </Field>

          <Field label="Estado" error={errors.status?.message}>
            <select {...register('status')} className="input-arch cursor-pointer">
              <option value="active">Activo</option>
              <option value="sold">Vendido</option>
              <option value="rented">Rentado</option>
              <option value="inactive">Inactivo</option>
            </select>
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            {...register('featured')}
            className="w-4 h-4 border-border text-action-primary"
          />
          <label htmlFor="featured" className="text-sm text-stone-600 cursor-pointer">
            Marcar como propiedad destacada
          </label>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section>
        <SectionTitle>Ubicación</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Ubicación (resumen)" error={errors.location?.message}>
            <input {...register('location')} placeholder="Los Mochis, Sinaloa" className="input-arch" />
          </Field>

          <Field label="Dirección completa" error={errors.address?.message}>
            <input {...register('address')} placeholder="Av. Obregón 123, Col. Centro" className="input-arch" />
          </Field>

          <Field label="Ciudad" error={errors.city?.message}>
            <input {...register('city')} placeholder="Los Mochis" className="input-arch" />
          </Field>

          <Field label="Estado" error={errors.state?.message}>
            <input {...register('state')} placeholder="Sinaloa" className="input-arch" />
          </Field>

          <Field label="Latitud" error={errors.latitude?.message}>
            <input
              type="number"
              step="any"
              {...register('latitude', { valueAsNumber: true })}
              placeholder="25.7910"
              className="input-arch font-mono text-xs"
            />
          </Field>

          <Field label="Longitud" error={errors.longitude?.message}>
            <input
              type="number"
              step="any"
              {...register('longitude', { valueAsNumber: true })}
              placeholder="-108.9870"
              className="input-arch font-mono text-xs"
            />
          </Field>
        </div>
        <p className="text-xs text-stone-400 mt-3">
          💡 Obtén coordenadas desde{' '}
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline">
            Google Maps
          </a>{' '}
          haciendo clic derecho en el mapa.
        </p>
      </section>

      {/* ── Características ── */}
      <section>
        <SectionTitle>Características</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Field label="Recámaras" error={errors.bedrooms?.message}>
            <input type="number" min={0} {...register('bedrooms', { valueAsNumber: true })} className="input-arch" />
          </Field>
          <Field label="Baños" error={errors.bathrooms?.message}>
            <input type="number" min={0} {...register('bathrooms', { valueAsNumber: true })} className="input-arch" />
          </Field>
          <Field label="Superficie (m²)" error={errors.area?.message}>
            <input type="number" step="0.01" {...register('area', { valueAsNumber: true })} className="input-arch" />
          </Field>
          <Field label="Estacionamiento" error={errors.parking?.message}>
            <input type="number" min={0} {...register('parking', { valueAsNumber: true })} className="input-arch" />
          </Field>
        </div>
      </section>

      {/* ── Imágenes ── */}
      <section>
        <SectionTitle>Imágenes</SectionTitle>

        {existingImages.length > 0 && (
          <div className="mb-6">
            <p className="label-arch mb-3">Imágenes actuales</p>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative w-28 h-20 group">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text ?? 'Imagen propiedad'}
                    fill
                    sizes="112px"
                    className="object-cover"
                    // Sin unoptimized — next/image puede optimizar
                    // porque las URLs ahora son inmutables (UUID)
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    aria-label="Eliminar imagen"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {newImagePreviews.length > 0 && (
          <div className="mb-6">
            <p className="label-arch mb-3">Por subir ({newImagePreviews.length})</p>
            <div className="flex flex-wrap gap-3">
              {newImagePreviews.map((preview, i) => (
                <div key={i} className="relative w-28 h-20 group border-2 border-dashed border-action-ghostBorder">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.preview}
                    alt={`Vista previa ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    aria-label="Quitar imagen"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className={cn(
          'flex flex-col items-center justify-center h-32 border-2 border-dashed cursor-pointer transition-colors',
          'border-border hover:border-action-ghostBorder bg-surface-section hover:bg-action-ghost'
        )}>
          <Upload size={20} className="text-stone-400 mb-2" />
          <p className="text-sm text-stone-500">Clic para subir imágenes</p>
          <p className="text-xs text-stone-400 mt-1">JPG, PNG, WebP — múltiples archivos</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageFiles(e.target.files)}
            className="sr-only"
          />
        </label>
      </section>

      {/* ── Submit ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-stone-100">
        <button
          type="submit"
          disabled={saving}
          className="btn-arch-primary py-3.5 px-8 text-xs disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              {uploadingImages ? 'Subiendo imágenes…' : 'Guardando…'}
            </span>
          ) : (
            mode === 'create' ? 'Crear propiedad' : 'Guardar cambios'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="btn-arch py-3.5 px-6 text-xs w-full sm:w-auto"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
