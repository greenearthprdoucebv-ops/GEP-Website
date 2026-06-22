import { Resend } from 'resend'

declare const process: {
  env: Record<string, string | undefined>
}

type ContactPayload = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

type VercelRequest = {
  method?: string
  body?: unknown
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

const DEFAULT_RESEND_FROM = 'Green Earth Produce <contact@greenearthproducebv.eu>'
const DEFAULT_CONTACT_EMAIL_TO = 'greenearthprdoucebv@gmail.com'
const SUBJECT_OPTIONS = [
  'Product inquiry',
  'Wholesale pricing',
  'Order or bulk quantities',
  'Shipping and delivery',
  'Quality and certification',
  'Partnership or supplier cooperation',
  'General question',
]

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY

  return {
    apiKey,
    from: process.env.RESEND_FROM || DEFAULT_RESEND_FROM,
    to: process.env.CONTACT_EMAIL_TO || DEFAULT_CONTACT_EMAIL_TO,
  }
}

function parseBody(body: unknown): Record<string, unknown> {
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  if (typeof body === 'object') return body as Record<string, unknown>
  return {}
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function validatePayload(payload: ContactPayload): string | null {
  if (!payload.name) return 'Name is required.'
  if (!payload.email) return 'Email is required.'
  if (!payload.subject) return 'Subject is required.'
  if (!SUBJECT_OPTIONS.includes(payload.subject)) return 'Please choose a valid subject.'
  if (!payload.message) return 'Message is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'Email is invalid.'
  return null
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildEmailHtml(payload: ContactPayload): string {
  const subject = escapeHtml(payload.subject)
  const phone = escapeHtml(payload.phone || 'Not provided')
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br />')

  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong><br />${safeMessage}</p>
  `
}

function buildConfirmationEmailHtml(payload: ContactPayload): string {
  return `
    <h2>Thank you for contacting Green Earth Produce</h2>
    <p>Dear ${escapeHtml(payload.name)},</p>
    <p>We have received your message and will contact you as soon as possible.</p>
    <p>Kind regards,<br />Green Earth Produce</p>
  `
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  const emailConfig = getEmailConfig()
  if (!emailConfig.apiKey || !emailConfig.from || !emailConfig.to) {
    res.status(500).json({ error: 'Email service is not configured.' })
    return
  }

  const body = parseBody(req.body)
  const payload: ContactPayload = {
    name: normalizeString(body.name),
    email: normalizeString(body.email),
    phone: normalizeString(body.phone),
    subject: normalizeString(body.subject),
    message: normalizeString(body.message),
  }

  const validationError = validatePayload(payload)
  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }

  try {
    const resend = new Resend(emailConfig.apiKey)
    const sendResult = await resend.emails.send({
      from: emailConfig.from,
      to: [emailConfig.to],
      subject: payload.subject,
      replyTo: payload.email,
      html: buildEmailHtml(payload),
    })

    if (sendResult.error) {
      res.status(502).json({ error: sendResult.error.message })
      return
    }

    const confirmationResult = await resend.emails.send({
      from: emailConfig.from,
      to: [payload.email],
      subject: 'We received your message - Green Earth Produce',
      replyTo: emailConfig.to,
      html: buildConfirmationEmailHtml(payload),
    })

    if (confirmationResult.error) {
      res.status(502).json({ error: confirmationResult.error.message })
      return
    }

    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to send email.' })
  }
}
