import { useState, useEffect, type ReactElement } from 'react'
import './About.css'
import farmFamilyImg from '../assets/about/farm-family.jpg'
import gingerHarvestImg from '../assets/about/ginger-harvest.jpeg'
import gingerFieldImg from '../assets/about/ginger-field.jpg'
import teamBannerImg from '../assets/about/team-banner.jpeg'
import { supabase, supabaseConfigError } from '../lib/supabase'
import { resolveAssetUrl } from '../lib/productImage'

function LeafIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 5c-6.5 0-11 3.5-13 9 2.5 1.5 5.5 2 8.5 1.2C18.5 14.2 21 10.5 19 5Z" />
            <path d="M9 14c1.5-2 3.5-3.5 6-4.5" />
        </svg>
    )
}

function ClockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l2.5 2.5" />
        </svg>
    )
}

function HandshakeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 11 5.5 8.5a2 2 0 0 0-2.8 0l-.2.2a2 2 0 0 0 0 2.8L8 17" />
            <path d="m16 11 2.5-2.5a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8L16 17" />
            <path d="m8 11 3-3a2.8 2.8 0 0 1 4 0l1 1" />
            <path d="m8 17 1.5 1.5a2 2 0 0 0 2.8 0l.7-.7" />
            <path d="m11 14 1 1a2 2 0 0 0 2.8 0L16 13.8" />
        </svg>
    )
}

function BoxIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3 4 7l8 4 8-4-8-4Z" />
            <path d="M4 7v10l8 4 8-4V7" />
            <path d="M12 11v10" />
        </svg>
    )
}

const VALUE_ICONS: Record<string, ReactElement> = {
    leaf: <LeafIcon />,
    clock: <ClockIcon />,
    handshake: <HandshakeIcon />,
    box: <BoxIcon />,
}

type AboutContent = {
    hero_image_url?: string
    story_image_url?: string
    approach_image_url?: string
    team_banner_url?: string
    hero_title: string
    hero_para1: string
    hero_para2: string
    hero_para3: string
    values_subtitle: string
    value1_title: string
    value1_body: string
    value1_icon: string
    value2_title: string
    value2_body: string
    value2_icon: string
    value3_title: string
    value3_body: string
    value3_icon: string
    value4_title: string
    value4_body: string
    value4_icon: string
    story_title: string
    story_para1: string
    story_para2: string
    story_para3: string
    focus_subtitle: string
    focus1_title: string
    focus1_body: string
    focus2_title: string
    focus2_body: string
    focus3_title: string
    focus3_body: string
    focus4_title: string
    focus4_body: string
    approach_title: string
    approach_para: string
    approach_check1: string
    approach_check2: string
    approach_check3: string
    approach_check4: string
    team_title: string
    team_para1: string
    team_para2: string
    team_para3: string
}

const STATIC: AboutContent = {
    hero_title: 'About GreenEarth Produce',
    hero_para1: 'Green Earth Produce B.V. was established in Venlo, the Netherlands, with a strong focus on fresh ginger. Our team brings nearly 30 years of experience in the ginger industry, covering cultivation, sourcing, processing, packaging, distribution, and international trade. Over the years, we have built long-term and stable partnerships with professional growers and packing facilities in China. This enables us to supply both organic ginger and GlobalG.A.P.-certified conventional ginger that complies with EU Maximum Residue Levels (MRL) requirements.',
    hero_para2: 'Our expertise covers the entire supply chain, including cultivation management, sourcing, production, quality control, food safety management, and international logistics. Since the beginning, we have remained committed to one clear goal: building the shortest possible supply chain to deliver premium products, consistent quality, and reliable year-round supply to our customers.',
    hero_para3: 'Today, we supply supermarkets, wholesalers, foodservice companies, and food retailers throughout Europe. In addition to fresh ginger, we also offer value-added services such as repacking, processing, and customized labeling. Our mission remains unchanged — to provide reliable quality, stable supply, and professional service to our customers.',
    values_subtitle: 'The principles that shape the way we work',
    value1_title: 'Quality', value1_body: 'We value freshness, consistency, and product standards that support long-term trust.', value1_icon: 'leaf',
    value2_title: 'Reliability', value2_body: 'We focus on dependable coordination between sourcing, supply, and customer needs.', value2_icon: 'clock',
    value3_title: 'Partnership', value3_body: 'Strong business relationships are essential to building stable and effective produce networks.', value3_icon: 'handshake',
    value4_title: 'Efficiency', value4_body: 'We aim for practical, well-organized processes that support smooth distribution and delivery.', value4_icon: 'box',
    story_title: 'From Source to Market',
    story_para1: 'We work closely with carefully selected growers and production farms in China, Peru, Brazil, and Thailand. These partners operate their own ginger farms and have extensive cultivation experience and expertise.',
    story_para2: 'Our long-term partnerships enable us to ensure full traceability, consistent quality, and reliable year-round supply. We know our partners, and we trust their quality. We strongly believe that close cooperation at origin is the key to delivering premium ginger to the European market.',
    story_para3: 'At Green Earth Produce, we believe in keeping things simple and fresh — every day. That is a promise our customers can count on.',
    focus_subtitle: 'Key areas that define our daily work',
    focus1_title: 'Fresh Produce', focus1_body: 'Fruit and vegetable products handled with attention to quality and consistency.',
    focus2_title: 'Supply Coordination', focus2_body: 'Supporting the connection between sourcing, distribution, and customer demand.',
    focus3_title: 'Business Relationships', focus3_body: 'Building dependable cooperation with partners across the produce chain.',
    focus4_title: 'Market Awareness', focus4_body: 'Responding to product, timing, and supply expectations in a practical way.',
    approach_title: 'A Responsible Approach',
    approach_para: 'GreenEarth Produce values professional and responsible ways of working. In a sector where quality, timing, and product handling are essential, careful coordination and efficient processes play an important role in supporting reliable supply.',
    approach_check1: 'Focus on product quality and consistency',
    approach_check2: 'Clear coordination across the supply chain',
    approach_check3: 'Attention to efficient distribution processes',
    approach_check4: 'Commitment to dependable business relationships',
    team_title: 'Our Team',
    team_para1: 'For over 30 years, GEP team has specialized in ginger supply chain management, building expertise that spans the entire value chain — from cultivation and sourcing to food safety, quality control, logistics, and global distribution.',
    team_para2: 'Driven by professionalism, dedication, and attention to detail, we are committed to ensuring product quality, supply stability, and operational excellence at every step.',
    team_para3: 'More than a supplier, we are a strategic supply chain solutions partner. We work closely with our customers to deliver not only premium ginger products, but also reliable, efficient, and sustainable supply chain solutions that support long-term business growth.',
}

export function About() {
    const [email, setEmail] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [content, setContent] = useState<AboutContent>(STATIC)

    useEffect(() => {
        if (!supabase) return
        supabase.from('about_content').select('*').limit(1).single().then(({ data }) => {
            if (data) {
                const merged = { ...STATIC, ...data }
                // resolve storage paths for images
                if (data.hero_image_url)     merged.hero_image_url     = data.hero_image_url
                if (data.story_image_url)    merged.story_image_url    = data.story_image_url
                if (data.approach_image_url) merged.approach_image_url = data.approach_image_url
                if (data.team_banner_url)    merged.team_banner_url    = data.team_banner_url
                setContent(merged)
            }
        })
    }, [])

    async function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)
        setStatusMessage('')

        if (!supabase) {
            setStatusMessage(supabaseConfigError ?? 'Newsletter service is not configured.')
            setIsSubmitting(false)
            return
        }

        try {
            const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
                body: { email },
            })

            if (error) {
                setStatusMessage(error.message || 'Subscription failed. Please try again.')
                return
            }

            setStatusMessage(data?.message ?? 'Please check your inbox and confirm your subscription.')
            setEmail('')
        } catch {
            setStatusMessage('The subscription service is currently unavailable.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const c = content

    return (
        <div className="about-page">
            <section className="about-section about-hero">
                <div className="about-hero__content">
                    <h1>{c.hero_title}</h1>
                    <p>{c.hero_para1}</p>
                    <p>{c.hero_para2}</p>
                    <p>{c.hero_para3}</p>
                    <div className="about-hero__actions">
                        <a href="/catalogue" className="about-btn about-btn--primary">Discover More</a>
                        <a href="#our-story" className="about-btn about-btn--secondary">Our Approach</a>
                    </div>
                </div>
                <div className="about-image-frame about-hero__image">
                    <img src={c.hero_image_url ? resolveAssetUrl(c.hero_image_url) : gingerHarvestImg} alt="Farmer harvesting fresh ginger in the field" />
                </div>
            </section>

            <section className="about-section about-values">
                <div className="about-section-heading">
                    <h2>Our Core Values</h2>
                    <p>{c.values_subtitle}</p>
                </div>
                <div className="about-card-grid about-card-grid--four">
                    {[
                        { title: c.value1_title, body: c.value1_body, icon: c.value1_icon },
                        { title: c.value2_title, body: c.value2_body, icon: c.value2_icon },
                        { title: c.value3_title, body: c.value3_body, icon: c.value3_icon },
                        { title: c.value4_title, body: c.value4_body, icon: c.value4_icon },
                    ].map((v) => (
                        <article key={v.title} className="about-card about-value-card">
                            <div className="about-icon-badge" aria-hidden="true">
                                {VALUE_ICONS[v.icon] ?? <LeafIcon />}
                            </div>
                            <h3>{v.title}</h3>
                            <p>{v.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section id="our-story" className="about-section about-split about-split--story">
                <div className="about-image-frame about-split__image">
                    <img src={c.story_image_url ? resolveAssetUrl(c.story_image_url) : farmFamilyImg} alt="Family sitting together on a farm vehicle" />
                </div>
                <div className="about-split__content">
                    <h2>{c.story_title}</h2>
                    <p>{c.story_para1}</p>
                    <p>{c.story_para2}</p>
                    <p>{c.story_para3}</p>
                </div>
            </section>

            <section className="about-section about-impact">
                <div className="about-section-heading">
                    <h2>What We Focus On</h2>
                    <p>{c.focus_subtitle}</p>
                </div>
                <div className="about-card-grid about-card-grid--four">
                    {[
                        { title: c.focus1_title, body: c.focus1_body },
                        { title: c.focus2_title, body: c.focus2_body },
                        { title: c.focus3_title, body: c.focus3_body },
                        { title: c.focus4_title, body: c.focus4_body },
                    ].map((f) => (
                        <article key={f.title} className="about-card about-stat-card">
                            <strong>{f.title}</strong>
                            <span>{f.body}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-section about-split about-split--reverse">
                <div className="about-split__content">
                    <h2>{c.approach_title}</h2>
                    <p>{c.approach_para}</p>
                    <ul className="about-check-list">
                        <li>{c.approach_check1}</li>
                        <li>{c.approach_check2}</li>
                        <li>{c.approach_check3}</li>
                        <li>{c.approach_check4}</li>
                    </ul>
                </div>
                <div className="about-image-frame about-split__image">
                    <img src={c.approach_image_url ? resolveAssetUrl(c.approach_image_url) : gingerFieldImg} alt="Fresh ginger displayed on soil" />
                </div>
            </section>

            <section className="about-section about-team">
                <div className="about-image-frame about-team__banner">
                    <img src={c.team_banner_url ? resolveAssetUrl(c.team_banner_url) : teamBannerImg} alt="GreenEarth team members smiling" />
                </div>
                <div className="about-card-grid about-team-grid about-team-grid--single">
                    <article className="about-card about-team-card about-team-card--featured">
                        <h3>{c.team_title}</h3>
                        <p>{c.team_para1}</p>
                        <p>{c.team_para2}</p>
                        <p>{c.team_para3}</p>
                    </article>
                </div>
            </section>

            <section className="about-section about-newsletter">
                <div className="about-newsletter__box">
                    <h2>Stay Connected</h2>
                    <p>Follow GreenEarth Produce for updates, product information, and company developments.</p>
                    <p className="about-newsletter__subtext">Stay informed about our work in the fresh produce sector.</p>
                    <form className="about-newsletter__form" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                        <button type="submit" className="about-btn about-btn--accent" disabled={isSubmitting}>
                            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                    {statusMessage && <p className="about-newsletter__status">{statusMessage}</p>}
                </div>
            </section>
        </div>
    )
}
