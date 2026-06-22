import { useState, useEffect } from 'react'
import cutGingerImg from '../assets/about/cutGinger.jpg'
import chinaGingerImg from '../assets/about/China Ginger.png'
import chineseGingerFallbackImg from '../assets/about/img1.png'
import GEPHeroSection from '../assets/about/GEPHeroSection.mp4'
import { supabase } from '../lib/supabase'
import { productImageUrl, resolveAssetUrl } from '../lib/productImage'
import { ProductSlideshow, type Product as SlideshowProduct } from '../components/ProductSlideshow'
import './Home.css'

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

export function Home() {
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(GEPHeroSection)
  const [heroLeadText, setHeroLeadText] = useState<string>('THE GINGER EXPERTS - Ginger Solutions for European Markets')
  const [products, setProducts] = useState<SlideshowProduct[]>([])

  useEffect(() => {
    if (!supabase) return

    Promise.all([
      supabase.from('home_hero').select('video_url, lead_text').order('id', { ascending: false }).limit(1).single(),
      supabase.from('home_products').select('*').eq('is_active', true).order('sort_order'),
    ]).then(([heroRes, productsRes]) => {
      if (heroRes.data?.video_url) setHeroVideoUrl(resolveAssetUrl(heroRes.data.video_url))
      if (heroRes.data?.lead_text) setHeroLeadText(heroRes.data.lead_text)

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
    })
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
            <a href="/catalogue" className="home-hero__btn home-hero__btn--primary">Browse Catalogue</a>
            <a href="/contact" className="home-hero__btn home-hero__btn--ghost">Get in Touch</a>
          </div>
        </div>
        <div className="home-hero__scroll" aria-hidden="true">
          <span className="home-hero__scroll-label">Scroll</span>
          <span className="home-hero__scroll-line" />
        </div>
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
              <div className="certification-badge">
                <div className="certification-badge__icon">IFS</div>
                <p className="certification-badge__text">IFS FOOD</p>
              </div>
              <div className="certification-badge">
                <div className="certification-badge__icon">SKAL</div>
                <p className="certification-badge__text">SKAL Organic</p>
              </div>
              <div className="certification-badge">
                <div className="certification-badge__icon">EU</div>
                <p className="certification-badge__text">EU Organic</p>
              </div>
              <div className="certification-badge">
                <div className="certification-badge__icon">GlobalG.A.P</div>
                <p className="certification-badge__text">GlobalG.A.P Certified</p>
              </div>
            </div>
          </div>
        </section>
      </div>

    </main>
  )
}
