const fs = require('node:fs')
const path = require('node:path')
const http = require('node:http')

let Resend
try {
  ;({ Resend } = require('resend'))
} catch {
  ;({ Resend } = require(path.resolve(__dirname, '../node_modules/resend/dist/index.js')))
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const raw = fs.readFileSync(filePath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalize(input) {
  return typeof input === 'string' ? input.trim() : ''
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 1_000_000) {
        req.socket.destroy()
        reject(new Error('Payload too large'))
      }
    })
    req.on('end', () => {
      if (!data) return resolve({})
      try {
        resolve(JSON.parse(data))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.end(JSON.stringify(payload))
}

function buildHtml({ name, email, phone, subject, message }) {
  const safeMessage = message.replace(/\n/g, '<br />')
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
    <p><strong>Message:</strong><br />${safeMessage}</p>
  `
}

function buildNewsletterHtml() {
  return `
    <h1>Thank you for subscribing!</h1>
    <p>You have successfully subscribed to GreenEarth Produce updates.</p>
    <p>We will keep you informed about seasonal products, company updates, and future offers.</p>
  `
}

async function start() {
  const rootDir = path.resolve(__dirname, '..')
  loadEnvFile(path.join(rootDir, '.env.local'))

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  const to = process.env.CONTACT_EMAIL_TO

  if (!apiKey || !from) {
    console.error('Missing RESEND_API_KEY or RESEND_FROM in Implementation/.env.local')
    process.exit(1)
  }

  const resend = new Resend(apiKey)
  const port = Number(process.env.CONTACT_API_PORT || 8787)

  const server = http.createServer(async (req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
      return sendJson(res, 200, { ok: true })
    }

    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed.' })
    }

    if (req.url !== '/api/contact' && req.url !== '/api/subscribe') {
      return sendJson(res, 404, { error: 'Not found.' })
    }

    try {
      const body = await readJsonBody(req)

      if (req.url === '/api/subscribe') {
        const email = normalize(body.email)

        if (!email || !isValidEmail(email)) {
          return sendJson(res, 400, { message: 'Please enter a valid email address.' })
        }

        const sendResult = await resend.emails.send({
          from,
          to: [email],
          subject: 'Welcome to GreenEarth Produce',
          html: buildNewsletterHtml(),
        })

        if (sendResult.error) {
          return sendJson(res, 502, { message: sendResult.error.message })
        }

        return sendJson(res, 200, {
          message: 'Subscription confirmation email sent successfully.',
          id: sendResult.data?.id,
        })
      }

      const payload = {
        name: normalize(body.name),
        email: normalize(body.email),
        phone: normalize(body.phone),
        subject: normalize(body.subject),
        message: normalize(body.message),
      }

      if (!to) {
        return sendJson(res, 500, { error: 'Contact email service is not configured.' })
      }

      if (!payload.name || !payload.email || !payload.message) {
        return sendJson(res, 400, { error: 'Name, email, and message are required.' })
      }
      if (!isValidEmail(payload.email)) {
        return sendJson(res, 400, { error: 'Email is invalid.' })
      }

      const sendResult = await resend.emails.send({
        from,
        to: [to],
        subject: payload.subject || `New message from ${payload.name}`,
        replyTo: payload.email,
        html: buildHtml(payload),
      })

      if (sendResult.error) {
        return sendJson(res, 502, { error: sendResult.error.message })
      }

      return sendJson(res, 200, { ok: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email.'
      return sendJson(res, 500, { error: message })
    }
  })

  server.listen(port, () => {
    console.log(`Contact API listening on http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error(error)
  process.exit(1)
})
