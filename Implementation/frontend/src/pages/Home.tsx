import { useState, useEffect, useRef, useCallback } from 'react'
import cutGingerImg from '../assets/about/cutGinger.jpg'
import chinaGingerImg from '../assets/about/China Ginger.png'
import chineseGingerFallbackImg from '../assets/about/img1.png'
import GEPHeroSection from '../assets/about/GEPHeroSection.mp4'
import { supabase } from '../lib/supabase'
import { productImageUrl, resolveAssetUrl } from '../lib/productImage'
import { ProductSlideshow, type Product as SlideshowProduct } from '../components/ProductSlideshow'
import './Home.css'

type HeroSlide = { id: number; image_url: string; title: string | null; caption: string | null; sort_order: number }
type Certification = { id: number; name: string; image_url: string | null; sort_order: number }

function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((idx: number) => {
    setCurrent(idx)
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [slides.length])

  if (!slides.length) return null
  const slide = slides[current]

  return (
    <div className="hero-slideshow">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-slideshow__slide${i === current ? ' hero-slideshow__slide--active' : ''}`}
          style={{ backgroundImage: `url(${resolveAssetUrl(s.image_url)})` }}
        />
      ))}
      <div className="home-hero__overlay" />
      <div className="home-hero__content">
        <h1 className="home-hero__title">{slide.title || 'THE GINGER EXPERTS'}</h1>
        {slide.caption && <p className="home-hero__lead">{slide.caption}</p>}
        <div className="home-hero__actions">
          <a href="/catalogue" className="home-hero__btn home-hero__btn--primary">Browse Catalogue</a>
          <a href="/contact" className="home-hero__btn home-hero__btn--ghost">Get in Touch</a>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="hero-slideshow__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-slideshow__dot${i === current ? ' hero-slideshow__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function slowVideo(el: HTMLVideoElement | null) {
  if (el) el.playbackRate = 0.8
}

function isChineseGingerProduct(name: string | null | undefined) {
  return typeof name === 'string' && name.toLowerCase().includes('chinese ginger')
}

function normalizeHomeProductOrigin(name: string | null | undefined, origin: string | null | undefined) {
  if (isChineseGingerProduct(name)) {
    return 'SOUTH / NORTH, CHINA'
  }

  const cleanedOrigin = origin?.trim() ?? ''
  if (cleanedOrigin.toLowerCase().includes('china')) {
    return 'SOUTH / NORTH, CHINA'
  }

  return cleanedOrigin
}

function getHomeProductImage(name: string | null | undefined, imageUrl: string | null | undefined) {
  if (imageUrl) return productImageUrl(imageUrl)
  if (isChineseGingerProduct(name)) return chineseGingerFallbackImg
  return chinaGingerImg
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

const whyCards = [
  { icon: <LeafIcon />, title: 'Sustainable Farming',    body: 'We partner only with farms that prioritise soil health and eco-friendly practices.' },
  { icon: <CheckIcon />, title: 'Quality & Transparency', body: 'Every shipment is lab-tested and fully documented — no surprises.' },
  { icon: <TruckIcon />, title: 'Direct & Reliable',      body: 'No middlemen. Better prices, shorter lead times, direct grower relationships.' },
]

const STATIC_CERTIFICATIONS = [
  { id: -1, name: 'IFS Food', image_url: null, sort_order: 1 },
  { id: -2, name: 'SKAL Organic', image_url: null, sort_order: 2 },
  { id: -3, name: 'EU Organic', image_url: null, sort_order: 3 },
  { id: -4, name: 'GlobalG.A.P', image_url: null, sort_order: 4 },
]

export function Home() {
  const [heroMode, setHeroMode] = useState<'video' | 'slideshow'>('video')
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(GEPHeroSection)
  const [heroLeadText, setHeroLeadText] = useState<string>('Ginger Solutions for European Markets')
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [products, setProducts] = useState<SlideshowProduct[]>([])
  const [certifications, setCertifications] = useState<Certification[]>(STATIC_CERTIFICATIONS)

  useEffect(() => {
    if (!supabase) return

    Promise.all([
      supabase.from('home_hero').select('*').order('id', { ascending: false }).limit(1),
      supabase.from('home_products').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('home_slideshow').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('certifications').select('*').eq('is_active', true).order('sort_order'),
    ]).then(([heroRes, productsRes, slidesRes, certsRes]) => {
      const hero = heroRes.data?.[0]
      if (hero?.video_url) setHeroVideoUrl(resolveAssetUrl(hero.video_url))
      if (hero?.lead_text) setHeroLeadText(hero.lead_text)
      if (hero?.mode) setHeroMode(hero.mode as 'video' | 'slideshow')

      if (productsRes.data && productsRes.data.length > 0) {
        setProducts(
          productsRes.data.map((p) => ({
            name:        p.name,
            origin:      normalizeHomeProductOrigin(p.name, p.origin),
            image:       getHomeProductImage(p.name, p.image_url),
            description: p.description,
            keywords:    p.keywords ?? [],
            imageLeft:   p.image_left,
          })),
        )
      }

      if (slidesRes.data && slidesRes.data.length > 0) {
        setHeroSlides(slidesRes.data)
      }

      if (certsRes.data && certsRes.data.length > 0) {
        setCertifications(certsRes.data)
      }
    })
  }, [])

  return (
    <main className="home">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="home-hero">
        {heroMode === 'slideshow' && heroSlides.length > 0 ? (
          <HeroSlideshow slides={heroSlides} />
        ) : (
          <>
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
              <h1 className="home-hero__title">THE GINGER EXPERTS</h1>
              <p className="home-hero__lead">{heroLeadText}</p>
              <div className="home-hero__actions">
                <a href="/catalogue" className="home-hero__btn home-hero__btn--primary">Browse Catalogue</a>
                <a href="/contact" className="home-hero__btn home-hero__btn--ghost">Get in Touch</a>
              </div>
            </div>
            <div className="home-hero__scroll" aria-hidden="true">
              <span className="home-hero__scroll-label">Scroll</span>
              <span className="home-hero__scroll-line" />
            </div>
          </>
        )}
      </section>

      {/* ── Products Slideshow ────────────────────────────────────────────── */}
      <section className="home-products">
        <div className="home-section-inner">
          <h2 className="home-section-title">Our Products</h2>
          <ProductSlideshow products={products} />
        </div>
      </section>

      {/* ── Why + Certifications on cutGinger background ─────────────────────── */}
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

        <section className="home-certifications">
          <div className="home-section-inner">
            <h2 className="home-section-title">Certifications & Standards</h2>
            <div className="home-certifications__grid">
              {certifications.map((cert) => (
                <div key={cert.id} className="certification-badge">
                  {cert.image_url ? (
                    <div className="certification-badge__img-wrap">
                      <img
                        src={resolveAssetUrl(cert.image_url)}
                        alt={cert.name}
                        className="certification-badge__img"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                  ) : (
                    <div className="certification-badge__icon">{cert.name.split(' ')[0]}</div>
                  )}
                  <p className="certification-badge__text">{cert.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

    </main>
  )
}
