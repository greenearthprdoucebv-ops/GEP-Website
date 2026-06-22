import { useState, useEffect, useRef } from 'react'
import cutGingerImg from '../assets/about/cutGinger.jpg'
import chinaGingerImg from '../assets/about/China Ginger.png'
import peruGingerImg from '../assets/about/Peru Ginger.webp'
import GEPHeroSection from '../assets/about/GEPHeroSection.mp4'
import { supabase } from '../lib/supabase'
import { productImageUrl } from '../lib/productImage'
import './Home.css'

function slowVideo(el: HTMLVideoElement | null) {
  if (el) el.playbackRate = 0.8
}

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
    <path d="M16 2s1 3-1 5-5 1-5 1"/>
    <path d="M8 12s1 2 4 2 4-2 4-2"/>
    <path d="M12 17v3"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

// ── Static fallbacks (used when Supabase has no data yet) ─────────────────────

type Product = {
  name: string
  origin: string
  image: string
  description: string
  keywords: string[]
  imageLeft: boolean
}

type Review = {
  stars: number
  text: string
  author: string
  role: string
}

const STATIC_PRODUCTS: Product[] = [
  {
    name: 'Chinese Ginger',
    origin: 'Shandong, China',
    image: chinaGingerImg,
    description: 'Grown in the fertile soils of Shandong province — bold, pungent, and aromatic. A staple for food manufacturers and spice traders worldwide.',
    keywords: ['Organic', 'Grade A', 'Year-round supply'],
    imageLeft: true,
  },
  {
    name: 'Peru Ginger',
    origin: 'Junín, Peru',
    image: peruGingerImg,
    description: 'High-altitude farms in Junín produce a milder, slightly sweet ginger — ideal for specialty food, beverage, and wellness markets.',
    keywords: ['Mild flavor', 'Export quality', 'Seasonal harvest'],
    imageLeft: false,
  },
]

const STATIC_REVIEWS: Review[] = [
  { stars: 5, text: 'Consistent quality every shipment. GreenEarth is our go-to supplier.',                  author: 'Maria L.',  role: 'Head of Procurement, FoodCo' },
  { stars: 5, text: 'The Peru ginger opened up a whole new product line for us. Exceptional.',               author: 'James T.',  role: 'Product Developer, TeaHouse' },
  { stars: 5, text: 'Reliable, transparent, and genuinely easy to work with.',                               author: 'Sara K.',   role: 'Operations Manager, SpiceTrade' },
  { stars: 4, text: 'Grade A quality and fast delivery every time. Will keep ordering.',                     author: 'David R.',  role: 'Buyer, GlobalFoods' },
  { stars: 5, text: 'Switched two years ago and never looked back. Our customers can taste the difference.', author: 'Anika K.',  role: 'Director, Specialty Foods Austria' },
  { stars: 5, text: 'From first enquiry to final delivery — smooth, professional, no surprises.',            author: 'Thomas R.', role: 'Operations, Food Service Switzerland' },
  { stars: 5, text: 'Year-round availability for Chinese ginger is a lifesaver for our supply chain.',       author: 'Lena D.',   role: 'Procurement, Distribution France' },
  { stars: 4, text: 'Custom packaging made a real difference on our retail shelves. Great partner.',         author: 'Sophie F.', role: 'Category Manager, Wholesale Germany' },
]

const whyCards = [
  { icon: <LeafIcon />, title: 'Sustainable Farming',    body: 'We partner only with farms that prioritise soil health and eco-friendly practices.' },
  { icon: <CheckIcon />, title: 'Quality & Transparency', body: 'Every shipment is lab-tested and fully documented — no surprises.' },
  { icon: <TruckIcon />, title: 'Direct & Reliable',      body: 'No middlemen. Better prices, shorter lead times, direct grower relationships.' },
]

const ReviewCard = ({ stars, text, author, role }: Review) => (
  <div className="review-card">
    <div className="review-card__stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
    <p className="review-card__text">"{text}"</p>
    <div className="review-card__author">
      <span className="review-card__name">{author}</span>
      <span className="review-card__role">{role}</span>
    </div>
  </div>
)

export function Home() {
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(GEPHeroSection)
  const [heroLeadText, setHeroLeadText] = useState<string>('Premium ginger sourced directly from farms across Asia and South America.')
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS)
  const [reviews, setReviews] = useState<Review[]>(STATIC_REVIEWS)
  const reviewsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!supabase) return

    Promise.all([
      supabase.from('home_hero').select('video_url, lead_text').order('id', { ascending: false }).limit(1).single(),
      supabase.from('home_products').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('home_reviews').select('*').eq('is_active', true).order('sort_order'),
    ]).then(([heroRes, productsRes, reviewsRes]) => {
      if (heroRes.data?.video_url) setHeroVideoUrl(heroRes.data.video_url)
      if (heroRes.data?.lead_text) setHeroLeadText(heroRes.data.lead_text)

      if (productsRes.data && productsRes.data.length > 0) {
        const bundledImages: Record<string, string> = {
          'Chinese Ginger': chinaGingerImg,
          'Peru Ginger':    peruGingerImg,
        }
        setProducts(
          productsRes.data.map((p) => ({
            name:        p.name,
            origin:      p.origin,
            image:       p.image_url
              ? productImageUrl(p.image_url)
              : (bundledImages[p.name] ?? chinaGingerImg),
            description: p.description,
            keywords:    p.keywords ?? [],
            imageLeft:   p.image_left,
          })),
        )
      }

      if (reviewsRes.data && reviewsRes.data.length > 0) {
        setReviews(
          reviewsRes.data.map((r) => ({
            stars:  r.stars,
            text:   r.review_text,
            author: r.author,
            role:   r.role,
          })),
        )
      }
    })
  }, [])

  // JS-driven auto-scroll: runs continuously, pauses when user interacts
  useEffect(() => {
    const reviewsEl = reviewsRef.current!
    if (!reviewsEl) return

    let rafId: number
    let paused = false
    let resumeTimer: ReturnType<typeof setTimeout>
    let dragging = false
    let dragStartX = 0
    let dragScrollStart = 0

    function tick() {
      if (!paused) {
        reviewsEl.scrollLeft += 0.7
        // Seamless loop: reset when the first copy has scrolled out of view
        if (reviewsEl.scrollLeft >= reviewsEl.scrollWidth / 2) reviewsEl.scrollLeft = 0
      }
      rafId = requestAnimationFrame(tick)
    }

    function pause() {
      paused = true
      clearTimeout(resumeTimer)
    }

    function scheduleResume(ms = 1500) {
      clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => { paused = false }, ms)
    }

    function onMouseDown(e: MouseEvent) {
      dragging = true
      pause()
      dragStartX = e.clientX
      dragScrollStart = reviewsEl.scrollLeft
      reviewsEl.style.cursor = 'grabbing'
    }

    function onMouseMove(e: MouseEvent) {
      if (!dragging) return
      reviewsEl.scrollLeft = dragScrollStart + (dragStartX - e.clientX)
    }

    function onMouseUp() {
      if (!dragging) return
      dragging = false
      reviewsEl.style.cursor = 'grab'
      scheduleResume()
    }

    // Touch: let native scroll handle movement, just pause/resume auto-scroll
    function onTouchStart() { pause() }
    function onTouchEnd() { scheduleResume(2000) }

    // Mouse wheel: native scroll works, auto-scroll briefly pauses
    function onWheel() { pause(); scheduleResume() }

    reviewsEl.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    reviewsEl.addEventListener('touchstart', onTouchStart, { passive: true })
    reviewsEl.addEventListener('touchend', onTouchEnd)
    reviewsEl.addEventListener('wheel', onWheel, { passive: true })

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resumeTimer)
      reviewsEl.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      reviewsEl.removeEventListener('touchstart', onTouchStart)
      reviewsEl.removeEventListener('touchend', onTouchEnd)
      reviewsEl.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <main className="home">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="home-hero">
        <video
          ref={slowVideo}
          className="home-hero__video"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div className="home-hero__content">
          <p className="home-hero__lead">{heroLeadText}</p>
          <div className="home-hero__actions">
            <a href="/Catalogue" className="home-hero__btn home-hero__btn--primary">Browse Catalogue</a>
            <a href="/Contact" className="home-hero__btn home-hero__btn--ghost">Get in Touch</a>
          </div>
        </div>
        <div className="home-hero__scroll" aria-hidden="true">
          <span className="home-hero__scroll-label">Scroll</span>
          <span className="home-hero__scroll-line" />
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────────────────────── */}
      <section className="home-products">
        <div className="home-section-inner">
          <h2 className="home-section-title">Our Products</h2>
          <div className="home-products__list">
            {products.map((p) => (
              <div key={p.name} className={`product-card${p.imageLeft ? '' : ' product-card--reverse'}`}>
                <div className="product-card__img-wrap">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="product-card__img"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = chinaGingerImg }}
                  />
                </div>
                <div className="product-card__body">
                  <span className="product-card__origin">{p.origin}</span>
                  <h3 className="product-card__name">{p.name}</h3>
                  <p className="product-card__desc">{p.description}</p>
                  <ul className="product-card__tags">
                    {p.keywords.map((k) => <li key={k}>{k}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why + Reviews on cutGinger background ────────────────────────────── */}
      <div className="home-ginger-bg" style={{ backgroundImage: `url(${cutGingerImg})` }}>
        <section className="home-why">
          <div className="home-section-inner">
            <h2 className="home-section-title">Why GreenEarth</h2>
            <div className="home-why__grid">
              {whyCards.map((c) => (
                <div key={c.title} className="why-card">
                  <span className="why-card__icon">{c.icon}</span>
                  <h3 className="why-card__title">{c.title}</h3>
                  <p className="why-card__body">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-reviews">
          <div className="home-section-inner">
            <h2 className="home-section-title">What Clients Say</h2>
          </div>
          <div className="home-reviews__overflow" ref={reviewsRef}>
            <div className="home-reviews__track" aria-label="Client reviews">
              {reviews.map((r, i) => <ReviewCard key={i} {...r} />)}
              <div aria-hidden="true" style={{ display: 'contents' }}>
                {reviews.map((r, i) => <ReviewCard key={`dup-${i}`} {...r} />)}
              </div>
            </div>
          </div>
        </section>
      </div>

    </main>
  )
}
