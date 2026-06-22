import { createClient } from 'npm:@supabase/supabase-js@2'

type SubscriberStatus = 'pending' | 'confirmed' | 'unsubscribed'

type SubscriberRow = {
  id: string
  email: string
  status: SubscriberStatus
  confirmation_token_hash: string | null
  confirmation_sent_at: string | null
  confirmed_at: string | null
  unsubscribed_at: string | null
}

const encoder = new TextEncoder()
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_CONFIRM_PATH = '/newsletter/confirm'
const DEFAULT_CONFIRM_TTL_HOURS = 48
const DEFAULT_FROM = 'Green Earth Produce <onboarding@resend.dev>'

function requireEnv(name: string) {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function getSupabaseSecretKey() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (legacy) return legacy

  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (!secretKeys) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEYS')

  const parsed = JSON.parse(secretKeys) as Record<string, string>
  const defaultKey = parsed.default
  if (!defaultKey) throw new Error('SUPABASE_SECRET_KEYS does not contain a default key')
  return defaultKey
}

export function createAdminClient() {
  return createClient(requireEnv('SUPABASE_URL'), getSupabaseSecretKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function normalizeEmail(input: unknown) {
  return typeof input === 'string' ? input.trim().toLowerCase() : ''
}

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email)
}

export function getSiteUrl() {
  const value = Deno.env.get('SITE_URL') ?? Deno.env.get('PUBLIC_SITE_URL')
  if (!value) {
    throw new Error('Missing SITE_URL or PUBLIC_SITE_URL for newsletter confirmation links')
  }

  return value.replace(/\/+$/, '')
}

export function getConfirmUrl(token: string) {
  const siteUrl = getSiteUrl()
  return `${siteUrl}${DEFAULT_CONFIRM_PATH}?token=${encodeURIComponent(token)}`
}

export function getConfirmTtlHours() {
  const raw = Number(Deno.env.get('NEWSLETTER_CONFIRM_TTL_HOURS') ?? DEFAULT_CONFIRM_TTL_HOURS)
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_CONFIRM_TTL_HOURS
}

export function getResendApiKey() {
  return requireEnv('RESEND_API_KEY')
}

export function getResendFrom() {
  return Deno.env.get('RESEND_FROM') ?? DEFAULT_FROM
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function generateToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return bytesToHex(bytes)
}

export async function sha256(input: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(input))
  return bytesToHex(new Uint8Array(digest))
}

export async function sendConfirmationEmail(email: string, confirmUrl: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getResendApiKey()}`,
    },
    body: JSON.stringify({
      from: getResendFrom(),
      to: [email],
      subject: 'Confirm your GreenEarth Produce newsletter subscription',
      html: `
        <h1>Confirm your subscription</h1>
        <p>Thanks for signing up for GreenEarth Produce updates.</p>
        <p>Please confirm your email address by clicking the button below:</p>
        <p>
          <a
            href="${confirmUrl}"
            style="display:inline-block;padding:12px 20px;background:#117a52;color:#ffffff;text-decoration:none;border-radius:8px;"
          >
            Confirm subscription
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>${confirmUrl}</p>
      `,
      text: [
        'Confirm your GreenEarth Produce newsletter subscription.',
        '',
        `Open this link to confirm: ${confirmUrl}`,
      ].join('\n'),
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Failed to send confirmation email.'
    throw new Error(message)
  }

  return data
}

export function getGenericSubscribeMessage() {
  return 'If this email address is eligible, we have sent a confirmation link. Please check your inbox.'
}

export function getAlreadyConfirmedMessage() {
  return 'This email address is already confirmed for newsletter updates.'
}

export function getConfirmedMessage() {
  return 'Your email address has been confirmed. You are now subscribed to the newsletter.'
}

export function getInvalidTokenMessage() {
  return 'This confirmation link is invalid or has already been used.'
}

export function getExpiredTokenMessage() {
  return 'This confirmation link has expired. Please subscribe again to receive a new email.'
}

export function isConfirmationExpired(sentAt: string | null) {
  if (!sentAt) return true
  const sentTimestamp = new Date(sentAt).getTime()
  if (Number.isNaN(sentTimestamp)) return true

  const ttlMs = getConfirmTtlHours() * 60 * 60 * 1000
  return Date.now() - sentTimestamp > ttlMs
}

export async function getSubscriberByEmail(email: string) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('newsletter_subscribers')
    .select('id,email,status,confirmation_token_hash,confirmation_sent_at,confirmed_at,unsubscribed_at')
    .eq('email', email)
    .maybeSingle<SubscriberRow>()

  if (error) throw error
  return data
}

export async function getSubscriberByTokenHash(tokenHash: string) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('newsletter_subscribers')
    .select('id,email,status,confirmation_token_hash,confirmation_sent_at,confirmed_at,unsubscribed_at')
    .eq('confirmation_token_hash', tokenHash)
    .maybeSingle<SubscriberRow>()

  if (error) throw error
  return data
}

export async function upsertPendingSubscriber(email: string, tokenHash: string) {
  const admin = createAdminClient()
  const payload = {
    email,
    status: 'pending' as const,
    confirmation_token_hash: tokenHash,
    confirmation_sent_at: new Date().toISOString(),
    confirmed_at: null,
    unsubscribed_at: null,
    source: 'website_about_newsletter',
  }

  const existing = await getSubscriberByEmail(email)
  if (!existing) {
    const { error } = await admin.from('newsletter_subscribers').insert(payload)
    if (error) throw error
    return 'created' as const
  }

  if (existing.status === 'confirmed') {
    return 'already_confirmed' as const
  }

  const { error } = await admin
    .from('newsletter_subscribers')
    .update(payload)
    .eq('id', existing.id)

  if (error) throw error
  return existing.status === 'unsubscribed' ? ('reactivated' as const) : ('updated' as const)
}

export async function confirmSubscriber(tokenHash: string) {
  const admin = createAdminClient()
  const subscriber = await getSubscriberByTokenHash(tokenHash)
  if (!subscriber) return { kind: 'invalid' as const }

  if (subscriber.status === 'confirmed') {
    return { kind: 'already_confirmed' as const, email: subscriber.email }
  }

  if (isConfirmationExpired(subscriber.confirmation_sent_at)) {
    await admin
      .from('newsletter_subscribers')
      .update({ confirmation_token_hash: null })
      .eq('id', subscriber.id)
    return { kind: 'expired' as const, email: subscriber.email }
  }

  const { error } = await admin
    .from('newsletter_subscribers')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      confirmation_token_hash: null,
    })
    .eq('id', subscriber.id)

  if (error) throw error
  return { kind: 'confirmed' as const, email: subscriber.email }
}
