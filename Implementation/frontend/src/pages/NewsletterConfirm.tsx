import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase, supabaseConfigError } from '../lib/supabase'
import './NewsletterConfirm.css'

type ConfirmState = 'loading' | 'success' | 'already-confirmed' | 'expired' | 'error'

export function NewsletterConfirm() {
  const [params] = useSearchParams()
  const token = useMemo(() => params.get('token')?.trim() ?? '', [params])
  const [state, setState] = useState<ConfirmState>('loading')
  const [message, setMessage] = useState('Confirming your subscription...')

  useEffect(() => {
    let isMounted = true

    async function confirmSubscription() {
      if (!token) {
        if (!isMounted) return
        setState('error')
        setMessage('The confirmation link is incomplete. Please subscribe again.')
        return
      }

      if (!supabase) {
        if (!isMounted) return
        setState('error')
        setMessage(supabaseConfigError ?? 'Newsletter service is not configured.')
        return
      }

      const { data, error } = await supabase.functions.invoke('newsletter-confirm', {
        body: { token },
      })

      if (!isMounted) return

      if (error) {
        setState('error')
        setMessage(error.message || 'We could not confirm your subscription.')
        return
      }

      const status = typeof data?.status === 'string' ? data.status : ''
      const nextMessage =
        typeof data?.message === 'string'
          ? data.message
          : 'We could not confirm your subscription.'

      if (status === 'confirmed') {
        setState('success')
        setMessage(nextMessage)
        return
      }

      if (status === 'already_confirmed') {
        setState('already-confirmed')
        setMessage(nextMessage)
        return
      }

      if (status === 'expired') {
        setState('expired')
        setMessage(nextMessage)
        return
      }

      setState('error')
      setMessage(nextMessage)
    }

    void confirmSubscription()

    return () => {
      isMounted = false
    }
  }, [token])

  return (
    <div className="newsletter-confirm">
      <div className={`newsletter-confirm__card newsletter-confirm__card--${state}`}>
        <p className="newsletter-confirm__eyebrow">Newsletter</p>
        <h1 className="newsletter-confirm__title">Subscription confirmation</h1>
        <p className="newsletter-confirm__message">{message}</p>
        <div className="newsletter-confirm__actions">
          <Link to="/about" className="newsletter-confirm__btn newsletter-confirm__btn--primary">
            Back to About
          </Link>
          <Link to="/" className="newsletter-confirm__btn newsletter-confirm__btn--secondary">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
