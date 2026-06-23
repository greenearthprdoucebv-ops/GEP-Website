import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { availabilityModifier } from '../lib/productMeta'

export type QuantityOption = {
  id: string
  label: string
}

export type ProductModalData = {
  id: string
  title: string
  description: string
  tag: string
  origin: string
  availability: string
  cta: 'contact' | 'cart'
  quantityOptions?: QuantityOption[]
}

const DEFAULT_QUANTITY_OPTIONS: QuantityOption[] = [
  { id: '2kg',    label: '2 kg'    },
  { id: '3kg',    label: '3 kg'    },
  { id: '5kg',    label: '5 kg'    },
  { id: '12.5kg', label: '12.5 kg' },
]

function badgeLabelForProduct(tag: string): string {
  if (tag === 'Premium') return 'Premium Quality'
  return tag
}

type ProductDetailModalProps = {
  product: ProductModalData
  imageSrc: string
  onClose: () => void
}

export function ProductDetailModal({ product, imageSrc, onClose }: ProductDetailModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const options = product.quantityOptions?.length
    ? product.quantityOptions
    : DEFAULT_QUANTITY_OPTIONS

  const [selectedQtyId, setSelectedQtyId] = useState<string>(
    () => options[0]?.id ?? '2kg',
  )

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const t = window.setTimeout(() => closeRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [onClose])

  const selectedLabel = options.find((o) => o.id === selectedQtyId)?.label ?? options[0]?.label ?? ''

  const contactHref = (() => {
    const sp = new URLSearchParams()
    sp.set('pid', product.id)
    sp.set('title', product.title)
    sp.set('qty', selectedQtyId)
    sp.set('quantity', selectedLabel)
    return `/contact?${sp.toString()}`
  })()

  return (
    <div className="product-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="product-modal__close"
          aria-label="Close product details"
          onClick={onClose}
        >
          <span aria-hidden>×</span>
        </button>

        <div className="product-modal__layout">
          <div className="product-modal__media">
            <img
              className="product-modal__img"
              src={imageSrc}
              alt=""
              width={960}
              height={640}
              decoding="async"
            />
            <span className="product-modal__badge">{badgeLabelForProduct(product.tag)}</span>
          </div>

          <div className="product-modal__panel">
            <h2 id={titleId} className="product-modal__title">
              {product.title}
            </h2>

            {product.origin || product.availability ? (
              <dl className="product-modal__meta">
                {product.origin ? (
                  <>
                    <dt className="product-modal__meta-label">Origin</dt>
                    <dd className="product-modal__meta-value">{product.origin}</dd>
                  </>
                ) : null}
                {product.availability ? (
                  <>
                    <dt className="product-modal__meta-label">Availability</dt>
                    <dd className="product-modal__meta-value">
                      <span
                        className={`product-modal__availability product-modal__availability--${availabilityModifier(product.availability)}`}
                      >
                        {product.availability}
                      </span>
                    </dd>
                  </>
                ) : null}
              </dl>
            ) : null}

            <p className="product-modal__desc">{product.description}</p>

            <div className="product-modal__quantity-block">
              <p className="product-modal__quantity-label">Select Quantity</p>
              <div className="product-modal__qty-grid">
                {options.map((opt) => {
                  const selected = opt.id === selectedQtyId
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={
                        selected
                          ? 'product-modal__qty-btn product-modal__qty-btn--selected'
                          : 'product-modal__qty-btn'
                      }
                      aria-pressed={selected}
                      onClick={() => setSelectedQtyId(opt.id)}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="product-modal__summary" aria-live="polite">
              <span className="product-modal__summary-label">Selected Quantity:</span>{' '}
              <span className="product-modal__summary-value">{selectedLabel}</span>
            </div>

            {product.cta === 'contact' ? (
              <Link className="product-modal__cta" to={contactHref} onClick={onClose}>
                Contact Us
              </Link>
            ) : (
              <button type="button" className="product-modal__cta" onClick={onClose}>
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
