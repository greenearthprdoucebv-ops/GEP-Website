import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductDetailModal, type ProductModalData } from '../components/ProductDetailModal'
import { availabilityModifier } from '../lib/productMeta'
import { productImageUrl } from '../lib/productImage'
import { supabase, supabaseConfigError } from '../lib/supabase'

type Product = ProductModalData & {
  weight: string
  price: string
  image_url: string | null
}

type DbProduct = {
  id: string
  title: string
  weight: string
  description: string
  price: string
  tag: string
  origin: string | null
  availability: string | null
  cta: string
  image_url: string | null
}

function IconGauge() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <circle cx="12" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4 14 A8 8 0 0 1 20 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M12 14 L12 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function IconQuality() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 12.5 L11 15.5 L16.5 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGift() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path
        d="M5 11h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M5 11V9a2 2 0 0 1 2-2h1.5a2.5 2.5 0 0 1 5 0H15a2 2 0 0 1 2 2v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M12 7v14" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

const WHY_CHOOSE = [
  {
    key: 'sustainable',
    title: 'Sustainable Farming',
    text: 'Committed to sustainable farming practices and environmental stewardship.',
    Icon: IconGauge,
  },
  {
    key: 'quality',
    title: 'Quality & Transparency',
    text: 'Quality transparency and community-focused agriculture you can trust.',
    Icon: IconQuality,
  },
  {
    key: 'local',
    title: 'Local & Organic',
    text: 'Direct from farm, certified organic, supporting local communities.',
    Icon: IconGift,
  },
] as const

export function Catalogue() {
  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(supabase))
  const [errorMessage, setErrorMessage] = useState<string | null>(
    supabase ? null : (supabaseConfigError ?? 'Supabase is not configured.'),
  )

  useEffect(() => {
    if (!supabase) {
      return
    }

    const client = supabase

    const loadProducts = async () => {
      const { data, error } = await client
        .from('products')
        .select('id,title,weight,description,price,tag,origin,availability,cta,image_url')
        .order('created_at', { ascending: false })

      if (error) {
        setErrorMessage(error.message)
        setProducts([])
        setIsLoading(false)
        return
      }

      const normalizedProducts: Product[] = (data as DbProduct[] | null)?.map((product) => ({
        ...product,
        origin: product.origin?.trim() ?? '',
        availability: product.availability?.trim() ?? '',
        cta: product.cta === 'contact' ? 'contact' : 'cart',
      })) ?? []

      setErrorMessage(null)
      setProducts(normalizedProducts)
      setIsLoading(false)
    }

    void loadProducts()
  }, [])

  return (
    <div className="catalogue-page">
      <section className="catalogue-hero" aria-labelledby="catalogue-hero-heading">
        <p className="catalogue-hero__badge">Farm to table</p>
        <h1 id="catalogue-hero-heading" className="catalogue-hero__title">
          Our Ginger Collection
        </h1>
        <p className="catalogue-hero__lead">
          Fresh, organic, and sustainably grown ginger delivered straight from our farm to your
          table. Experience the difference of real, natural produce in various quantities to suit
          your needs.
        </p>
      </section>

      <section className="catalogue-grid-section" aria-label="Product catalogue">
        {errorMessage ? <p role="alert">Could not load products: {errorMessage}</p> : null}
        {isLoading ? <p>Loading products...</p> : null}
        {!isLoading && !errorMessage && products.length === 0 ? <p>No products found.</p> : null}

        <div className="catalogue-grid">
          {products.map((p) => (
            <article
              key={p.id}
              className="catalogue-card catalogue-card--interactive"
              role="button"
              tabIndex={0}
              aria-label={`View details for ${p.title}`}
              onClick={() => setModalProduct(p)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setModalProduct(p)
                }
              }}
            >
              <div className="catalogue-card__media">
                <img
                  className="catalogue-card__img"
                  src={productImageUrl(p.image_url)}
                  alt={p.title}
                  width={800}
                  height={520}
                  loading="lazy"
                />
                <span className="catalogue-card__tag">{p.tag}</span>
              </div>
              <div className="catalogue-card__body">
                <h2 className="catalogue-card__title">{p.title}</h2>
                {p.origin || p.availability ? (
                  <div className="catalogue-card__meta">
                    {p.origin ? (
                      <p className="catalogue-card__origin">
                        <span className="catalogue-card__meta-label">Origin</span>
                        <span className="catalogue-card__meta-value">{p.origin}</span>
                      </p>
                    ) : null}
                    {p.availability ? (
                      <span
                        className={`catalogue-card__availability catalogue-card__availability--${availabilityModifier(p.availability)}`}
                      >
                        {p.availability}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <p className="catalogue-card__weight">{p.weight}</p>
                <p className="catalogue-card__desc">{p.description}</p>
                <div
                  className="catalogue-card__footer"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <span className="catalogue-card__price">{p.price}</span>
                  {p.cta === 'contact' ? (
                    <Link className="catalogue-card__btn" to="/contact">
                      Contact Us
                    </Link>
                  ) : (
                    <button type="button" className="catalogue-card__btn">
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="catalogue-why-section" aria-labelledby="catalogue-why-heading">
        <div className="catalogue-why-card">
          <h2 id="catalogue-why-heading" className="catalogue-why__title">
            Why Choose Our Ginger?
          </h2>
          <div className="catalogue-why__columns">
            {WHY_CHOOSE.map(({ key, title, text, Icon }) => (
              <div key={key} className="catalogue-why__column">
                <div className="catalogue-why__icon" aria-hidden>
                  <Icon />
                </div>
                <h3 className="catalogue-why__column-title">{title}</h3>
                <p className="catalogue-why__column-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalProduct ? (
        <ProductDetailModal
          product={modalProduct}
          imageSrc={productImageUrl(modalProduct.image_url)}
          onClose={() => setModalProduct(null)}
        />
      ) : null}
    </div>
  )
}
