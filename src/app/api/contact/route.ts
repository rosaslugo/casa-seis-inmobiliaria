import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'
import { serializeError } from '@/lib/errors'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Use first IP from x-forwarded-for (may be comma-separated behind proxies)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  const allowed = await checkRateLimit(ip, { limit: 5, windowSec: 60 })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta en un minuto.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', fields: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email } = result.data
    logger.info('Contact form submitted', { name, email })

    // TODO: integrate Resend / SendGrid here
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'noreply@casaseis.mx',
    //   to: SITE_EMAIL,
    //   subject: `Contacto: ${name}`,
    //   text: result.data.message,
    //   replyTo: email,
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Contact form error', { error: String(error) })
    return NextResponse.json({ error: serializeError(error).message }, { status: 500 })
  }
}
