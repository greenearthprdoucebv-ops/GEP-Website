import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import {
  generateToken,
  getConfirmUrl,
  getGenericSubscribeMessage,
  isValidEmail,
  normalizeEmail,
  sendConfirmationEmail,
  sha256,
  upsertPendingSubscriber,
} from '../_shared/newsletter.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ message: 'Method not allowed.' }, { status: 405 })
  }

  try {
    const { email } = await request.json().catch(() => ({ email: '' }))
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return jsonResponse({ message: 'Please enter a valid email address.' }, { status: 400 })
    }

    const token = generateToken()
    const tokenHash = await sha256(token)
    const upsertResult = await upsertPendingSubscriber(normalizedEmail, tokenHash)

    if (upsertResult !== 'already_confirmed') {
      await sendConfirmationEmail(normalizedEmail, getConfirmUrl(token))
    }

    return jsonResponse(
      {
        message: getGenericSubscribeMessage(),
        status: upsertResult === 'already_confirmed' ? 'already_confirmed' : 'pending_confirmation',
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Subscription failed.'
    return jsonResponse({ message }, { status: 500 })
  }
})
