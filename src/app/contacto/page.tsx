'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, Mail, MapPin, Send, CheckCircle, MessageCircle, Clock, Instagram, Facebook } from 'lucide-react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { SITE_PHONE, SITE_PHONE_WA, SITE_EMAIL, SITE_ADDRESS, SITE_FACEBOOK, SITE_INSTAGRAM, SITE_HOURS } from '@/constants'

export default function ContactoPage() {
  const [sent, setSent]               = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setServerError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        setServerError(json.error ?? 'Error al enviar. Intenta de nuevo.')
        return
      }
      setSent(true)
    } catch {
      setServerError('Error de conexión. Verifica tu internet e intenta de nuevo.')
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" className="pt-[72px] md:pt-24">

        {/* ── Page header ── */}
        <div className="page-container page-header mt-6">
          <p className="overline mb-2.5">Contáctanos</p>
          <h1 className="section-heading">
            Hablemos de
            <br />
            <em className="text-action-muted not-italic">tu propiedad</em>
          </h1>
        </div>

        <div className="page-container py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 lg:gap-20">

            {/* ── Left: info ── */}
            <aside className="lg:col-span-2 space-y-8">
              <p className="text-base text-stone-500 leading-relaxed">
                Estamos para ayudarte a encontrar la propiedad ideal o a vender y rentar la tuya.
                Un asesor te responderá en menos de 24 horas.
              </p>

              {/* Contact options */}
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${SITE_PHONE_WA}?text=Hola, me interesa una propiedad`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 group"
                  style={{ borderRadius: '8px' }}
                  aria-label="Contactar por WhatsApp"
                >
                  <div
                    className="w-11 h-11 bg-emerald-500 flex items-center justify-center shrink-0"
                    style={{ borderRadius: '8px' }}
                  >
                    <MessageCircle size={18} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-stone-400 mb-0.5">
                      WhatsApp · Respuesta inmediata
                    </p>
                    <p className="text-sm font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
                      {SITE_PHONE}
                    </p>
                  </div>
                </a>

                <a
                  href={`tel:${SITE_PHONE_WA}`}
                  className="flex items-center gap-4 p-4 border border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 transition-all duration-200 group"
                  style={{ borderRadius: '8px' }}
                  aria-label="Llamar por teléfono"
                >
                  <div
                    className="w-11 h-11 bg-stone-700 flex items-center justify-center shrink-0"
                    style={{ borderRadius: '8px' }}
                  >
                    <Phone size={18} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-stone-400 mb-0.5">
                      Teléfono
                    </p>
                    <p className="text-sm font-semibold text-stone-800 group-hover:text-stone-900 transition-colors">
                      {SITE_PHONE}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="flex items-center gap-4 p-4 border border-border hover:border-border-interactive hover:bg-surface-section transition-all duration-200 group"
                  style={{ borderRadius: '8px' }}
                  aria-label="Enviar correo electrónico"
                >
                  <div
                    className="w-11 h-11 bg-action-primary flex items-center justify-center shrink-0"
                    style={{ borderRadius: '8px' }}
                  >
                    <Mail size={18} className="text-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-stone-400 mb-0.5">
                      Correo electrónico
                    </p>
                    <p className="text-sm font-semibold text-content-primary group-hover:text-action-muted transition-colors break-all">
                      {SITE_EMAIL}
                    </p>
                  </div>
                </a>

                <div
                  className="flex items-center gap-4 p-4 border border-stone-100 bg-stone-50"
                  style={{ borderRadius: '8px' }}
                >
                  <div
                    className="w-11 h-11 bg-stone-200 flex items-center justify-center shrink-0"
                    style={{ borderRadius: '8px' }}
                  >
                    <MapPin size={18} className="text-stone-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-stone-400 mb-0.5">
                      Oficina
                    </p>
                    <p className="text-sm text-stone-700">{SITE_ADDRESS}</p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div
                className="flex items-start gap-3 p-4 border border-stone-100 bg-stone-50"
                style={{ borderRadius: '8px' }}
              >
                <Clock size={15} className="mt-0.5 shrink-0 text-content-icon" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-stone-500 mb-2">
                    Horario de atención
                  </p>
                  <p className="text-sm text-stone-600">{SITE_HOURS}</p>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3 pt-1">
                <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-stone-400">Síguenos</p>
                <a
                  href={SITE_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-800 transition-all duration-200 text-[11px] font-semibold"
                  style={{ borderRadius: '6px' }}
                  aria-label="Instagram"
                >
                  <Instagram size={13} aria-hidden="true" />
                  Instagram
                </a>
                <a
                  href={SITE_FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-800 transition-all duration-200 text-[11px] font-semibold"
                  style={{ borderRadius: '6px' }}
                  aria-label="Facebook"
                >
                  <Facebook size={13} aria-hidden="true" />
                  Facebook
                </a>
              </div>
            </aside>

            {/* ── Right: form ── */}
            <div className="lg:col-span-3">
              {sent ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center animate-scale-in"
                  role="status"
                  aria-live="polite"
                >
                  <div
                    className="w-18 h-18 bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-7"
                    style={{ width: '72px', height: '72px', borderRadius: '16px' }}
                  >
                    <CheckCircle size={30} className="text-emerald-500" />
                  </div>
                  <h2 className="font-display text-3xl text-stone-900 mb-3">Mensaje enviado</h2>
                  <p className="text-sm text-stone-500 leading-relaxed max-w-sm mb-8">
                    Gracias por contactarnos. Un asesor te responderá en menos de 24 horas.
                  </p>
                  <a
                    href={`https://wa.me/${SITE_PHONE_WA}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-3 px-6"
                    style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                  >
                    <MessageCircle size={14} />
                    ¿Necesitas respuesta inmediata? WhatsApp
                  </a>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-7"
                  noValidate
                  aria-label="Formulario de contacto"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="label-arch block mb-2.5">
                        Nombre completo{' '}
                        <span className="text-red-400 font-normal" aria-label="requerido">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Juan García"
                        className={`input-arch ${errors.name ? 'input-error' : ''}`}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-1.5 text-xs text-red-500" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="label-arch block mb-2.5">
                        Correo electrónico{' '}
                        <span className="text-red-400 font-normal" aria-label="requerido">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        placeholder="juan@correo.com"
                        className={`input-arch ${errors.email ? 'input-error' : ''}`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-1.5 text-xs text-red-500" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="label-arch block mb-2.5">
                      Teléfono{' '}
                      <span className="text-stone-400 font-normal normal-case tracking-normal text-[11px]">(opcional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+52 668 123 4567"
                      className="input-arch"
                      {...register('phone')}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="label-arch block mb-2.5">
                      Mensaje{' '}
                      <span className="text-red-400 font-normal" aria-label="requerido">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Estoy interesado en una propiedad en venta en Los Mochis, con presupuesto de…"
                      className={`input-arch resize-y min-h-[120px] ${errors.message ? 'input-error' : ''}`}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-1.5 text-xs text-red-500" role="alert">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <div
                      className="p-4 text-xs text-red-700"
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                      }}
                      role="alert"
                    >
                      {serverError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary text-xs py-4 px-8 w-full sm:w-auto"
                      aria-describedby={isSubmitting ? 'submit-status' : undefined}
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                          Enviando…
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Send size={14} aria-hidden="true" />
                          Enviar mensaje
                        </span>
                      )}
                    </button>
                    {isSubmitting && (
                      <span id="submit-status" className="sr-only">Enviando tu mensaje, por favor espera.</span>
                    )}
                    <p className="text-xs text-stone-400">* Campos requeridos</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
