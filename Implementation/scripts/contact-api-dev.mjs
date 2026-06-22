import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Resend } from 'resend'

const DEFAULT_PORT = 8787
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

loadLocalEnv()

const port = Number(process.env.CONTACT_API_PORT || DEFAULT_PORT)

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), '.env.local')

  try {
    const envFile = readFileSync(envPath, 'utf8')
    for (const line of envFile.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const equalsIndex = trimmed.indexOf('=')
      if (equalsIndex === -1) continue

      const key = trimmed.slice(0, equalsIndex).trim()
      const value = trimmed.slice(equalsIndex + 1).trim()
      if (key && process.env[key] === undefined) process.env[key] = value
    }
  } catch {
    // .env.local is optional. The request handler returns a clear error if required values are missing.
  }
}

function json(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  })
  res.end(JSON.stringify(body))
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validatePayload(payload) {
  if (!payload.name) return 'Name is required.'
  if (!payload.email) return 'Email is required.'
  if (!payload.subject) return 'Subject is required.'
  if (!SUBJECT_OPTIONS.includes(payload.subject)) return 'Please choose a valid subject.'
  if (!payload.message) return 'Message is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'Email is invalid.'
  return null
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildEmailHtml(payload) {
  const phone = escapeHtml(payload.phone || 'Not provided')
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br />')

  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
    <p><strong>Message:</strong><br />${safeMessage}</p>
  `
}

function buildConfirmationEmailHtml(payload) {
  return `
    <h2>Thank you for contacting Green Earth Produce</h2>
    <p>Dear ${escapeHtml(payload.name)},</p>
    <p>We have received your message and will contact you as soon as possible.</p>
    <p>Kind regards,<br />Green Earth Produce</p>
  `
}

function readRequestBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => resolveBody(body))
    req.on('error', rejectBody)
  })
}

async function handleContact(req, res) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || DEFAULT_RESEND_FROM
  const to = process.env.CONTACT_EMAIL_TO || DEFAULT_CONTACT_EMAIL_TO

  if (!apiKey || !from || !to) {
    json(res, 500, { error: 'Email service is not configured.' })
    return
  }

  let body
  try {
    body = JSON.parse(await readRequestBody(req))
  } catch {
    json(res, 400, { error: 'Request body must be valid JSON.' })
    return
  }

  const payload = {
    name: normalizeString(body.name),
    email: normalizeString(body.email),
    phone: normalizeString(body.phone),
    subject: normalizeString(body.subject),
    message: normalizeString(body.message),
  }

  const validationError = validatePayload(payload)
  if (validationError) {
    json(res, 400, { error: validationError })
    return
  }

  try {
    const resend = new Resend(apiKey)
    const sendResult = await resend.emails.send({
      from,
      to: [to],
      subject: payload.subject,
      replyTo: payload.email,
      html: buildEmailHtml(payload),
    })

    if (sendResult.error) {
      json(res, 502, { error: sendResult.error.message })
      return
    }

    const confirmationResult = await resend.emails.send({
      from,
      to: [payload.email],
      subject: 'We received your message - Green Earth Produce',
      replyTo: to,
      html: buildConfirmationEmailHtml(payload),
    })

    if (confirmationResult.error) {
      json(res, 502, { error: confirmationResult.error.message })
      return
    }

    json(res, 200, { ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send email.'
    json(res, 500, { error: message })
  }
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    json(res, 204, {})
    return
  }

  if (req.url === '/api/contact' && req.method === 'POST') {
    await handleContact(req, res)
    return
  }

  json(res, 404, { error: 'Not found.' })
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other API server or set CONTACT_API_PORT.`)
    process.exit(1)
  }

  throw error
})

server.listen(port, () => {
  console.log(`Local contact API listening on http://localhost:${port}/api/contact`)
})
