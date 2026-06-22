import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const subjectOptions = [
  'Product inquiry',
  'Wholesale pricing',
  'Order or bulk quantities',
  'Shipping and delivery',
  'Quality and certification',
  'Partnership or supplier cooperation',
  'General question',
]

function prefilledFromCatalogueQuery(searchParams: URLSearchParams): {
  formKey: string
  subject: string
  message: string
} {
  const title = searchParams.get('title')?.trim() ?? ''
  const quantity = searchParams.get('quantity')?.trim() ?? ''
  const pid = searchParams.get('pid')?.trim() ?? ''
  const qtyId = searchParams.get('qty')?.trim() ?? ''

  const formKey = searchParams.toString()

  if (!title && !quantity && !pid && !qtyId) {
    return { formKey, subject: '', message: '' }
  }

  const subject = 'Product inquiry'

  const messageLines = ['Hello,', '']
  if (title || quantity) {
    const interest = [title, quantity && `quantity: ${quantity}`].filter(Boolean).join(', ')
    messageLines.push(`I am interested in ${interest}.`)
  } else {
    messageLines.push('I am interested in your products.')
  }
  messageLines.push('')
  if (pid) messageLines.push(`Product ID: ${pid}`)
  if (qtyId) messageLines.push(`Quantity option: ${qtyId}`)
  if (pid || qtyId) messageLines.push('')
  messageLines.push('Please send more information.', '', 'Thank you.')
  const message = messageLines.join('\n')

  return { formKey, subject, message }
}

const contactDetails = [
  {
    label: 'Email',
    value: 'info@greenearthproduce.nl',
    href: 'mailto:info@greenearthproduce.nl',
    icon: <path d="M4 6h16v12H4z" />,
  },
  {
    label: 'Phone',
    value: '077 206 6760',
    href: 'tel:+31772066760',
    icon: <path d="M8 5.5 10.2 8l-1.6 1.8a10.9 10.9 0 0 0 5.6 5.6l1.8-1.6L18.5 16v2.2c0 .7-.5 1.2-1.2 1.2A13.5 13.5 0 0 1 3 6.7c0-.7.5-1.2 1.2-1.2H8Z" />,
  },
  {
    label: 'Address',
    value: ['Venrayseweg 118 C', '5928 RH Venlo', 'The Netherlands'],
    href: 'https://www.google.com/maps/search/?api=1&query=Venrayseweg%20118%20C%205928%20RH%20Venlo',
    icon: (
      <>
        <path d="M12 21s5-4.9 5-9a5 5 0 1 0-10 0c0 4.1 5 9 5 9Z" />
        <circle cx="12" cy="12" r="1.9" />
      </>
    ),
  },
  {
    label: 'Business Hours',
    value: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday & Sunday: Closed'],
    href: undefined,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
]

const benefits = [
  'Premium quality organic ginger',
  'Direct relationships with farmers',
  'Fast and reliable shipping',
  'Competitive wholesale pricing',
]

function InfoIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="contact-info-item__icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  )
}

export function Contact() {
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const queryString = searchParams.toString()
  const { formKey, subject, message } = useMemo(() => {
    const sp = new URLSearchParams(queryString)
    return prefilledFromCatalogueQuery(sp)
  }, [queryString])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitState(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      subject: String(formData.get('subject') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const responseText = await response.text()
      let json: { error?: string } | null = null
      try {
        json = responseText ? (JSON.parse(responseText) as { error?: string }) : null
      } catch {
        json = null
      }

      if (!response.ok) {
        const fallbackError = responseText
          ? `Server returned ${response.status}: ${responseText.slice(0, 140)}`
          : `Server returned ${response.status}. Please try again.`

        setSubmitState({
          type: 'error',
          message: json?.error ?? fallbackError,
        })
        return
      }

      form.reset()
      setSubmitState({
        type: 'success',
        message: 'Message sent successfully. We will get back to you soon.',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.'

      setSubmitState({
        type: 'error',
        message: `Network error: ${errorMessage}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact-page" aria-labelledby="contact-page-title">
      <div className="contact-page__inner">
        <header className="contact-page__intro">
          <h1 id="contact-page-title" className="contact-page__title">
            Contact Us
          </h1>
          <p className="contact-page__lead">
            We&apos;d love to hear from you. Whether you have a question about our products,
            pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </header>

        <div className="contact-page__grid">
          <article className="contact-card contact-card--form" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="contact-card__title">
              Send us a Message
            </h2>

            <form key={formKey || 'default'} className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label className="contact-field__label" htmlFor="name">
                  Name <span aria-hidden="true">*</span>
                </label>
                <input
                  className="contact-field__input"
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-field__label" htmlFor="email">
                  Email <span aria-hidden="true">*</span>
                </label>
                <input
                  className="contact-field__input"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-field__label" htmlFor="phone">
                  Phone <span className="contact-field__optional">(optional)</span>
                </label>
                <input
                  className="contact-field__input"
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
              </div>

              <div className="contact-field">
                <label className="contact-field__label" htmlFor="subject">
                  Subject <span aria-hidden="true">*</span>
                </label>
                <select
                  className="contact-field__select"
                  id="subject"
                  name="subject"
                  defaultValue={subject}
                  required
                >
                  <option value="" disabled>
                    Choose a subject
                  </option>
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-field">
                <label className="contact-field__label" htmlFor="message">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  className="contact-field__textarea"
                  id="message"
                  name="message"
                  rows={6}
                  required
                  defaultValue={message}
                />
              </div>

              <button className="contact-form__submit" type="submit" disabled={isSubmitting}>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                  <path d="M22 2 11 13" />
                </svg>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {submitState ? (
                <p
                  className={`contact-form__status contact-form__status--${submitState.type}`}
                  role={submitState.type === 'error' ? 'alert' : 'status'}
                >
                  {submitState.message}
                </p>
              ) : null}
            </form>
          </article>

          <div className="contact-page__stack">
            <article className="contact-card" aria-labelledby="contact-info-title">
              <h2 id="contact-info-title" className="contact-card__title">
                Contact Information
              </h2>

              <div className="contact-info-list">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="contact-info-item">
                    <InfoIcon>{detail.icon}</InfoIcon>
                    <div>
                      <h3 className="contact-info-item__label">{detail.label}</h3>
                      {Array.isArray(detail.value) ? (
                        detail.href ? (
                          <a
                            className="contact-info-item__link"
                            href={detail.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {detail.value.map((line) => (
                              <span key={line} className="contact-info-item__line">
                                {line}
                              </span>
                            ))}
                          </a>
                        ) : (
                          <p className="contact-info-item__value">
                            {detail.value.map((line) => (
                              <span key={line} className="contact-info-item__line">
                                {line}
                              </span>
                            ))}
                          </p>
                        )
                      ) : (
                        <a className="contact-info-item__link" href={detail.href}>
                          {detail.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="contact-card" aria-labelledby="contact-why-title">
              <h2 id="contact-why-title" className="contact-card__title">
                Why Choose Us?
              </h2>
              <p className="contact-why__lead">
                With over 25 years of experience in importing premium ginger, we provide the
                highest quality products and exceptional service to our customers worldwide.
              </p>

              <ul className="contact-why__list">
                {benefits.map((benefit) => (
                  <li key={benefit}>
                    <span className="contact-why__check" aria-hidden="true">
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
