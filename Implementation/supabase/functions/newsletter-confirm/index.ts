import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import {
  confirmSubscriber,
  getAlreadyConfirmedMessage,
  getConfirmedMessage,
  getExpiredTokenMessage,
  getInvalidTokenMessage,
  sha256,
} from '../_shared/newsletter.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ message: 'Method not allowed.' }, { status: 405 })
  }

  try {
    const { token } = await request.json().catch(() => ({ token: '' }))
    const normalizedToken = typeof token === 'string' ? token.trim() : ''

    if (!normalizedToken) {
      return jsonResponse({ message: 'Missing confirmation token.' }, { status: 400 })
    }

    const result = await confirmSubscriber(await sha256(normalizedToken))

    if (result.kind === 'invalid') {
      return jsonResponse({ message: getInvalidTokenMessage(), status: result.kind }, { status: 200 })
    }

    if (result.kind === 'expired') {
      return jsonResponse({ message: getExpiredTokenMessage(), status: result.kind }, { status: 200 })
    }

    if (result.kind === 'already_confirmed') {
      return jsonResponse(
        { message: getAlreadyConfirmedMessage(), status: result.kind, email: result.email },
        { status: 200 },
      )
    }

    return jsonResponse(
      { message: getConfirmedMessage(), status: result.kind, email: result.email },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Confirmation failed.'
    return jsonResponse({ message }, { status: 500 })
  }
})
