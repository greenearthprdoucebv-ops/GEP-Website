import { useState } from 'react'
import './About.css'
import farmFamilyImg from '../assets/about/farm-family.jpg'
import gingerHarvestImg from '../assets/about/ginger-harvest.jpeg'
import gingerFieldImg from '../assets/about/ginger-field.jpg'
import teamBannerImg from '../assets/about/team-banner.jpeg'
import { supabase, supabaseConfigError } from '../lib/supabase'

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

export function About() {
    const [email, setEmail] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

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

            setStatusMessage(
                data?.message ?? 'Please check your inbox and confirm your subscription.',
            )
            setEmail('')
        } catch {
            setStatusMessage('The subscription service is currently unavailable.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="about-page">
            <section className="about-section about-hero">
                <div className="about-hero__content">
                    <h1>About GreenEarth Produce</h1>

                    <p>
                        Green Earth Produce B.V. was established in Venlo, the Netherlands, with a strong focus on fresh ginger. Our team brings nearly 30 years of experience in the ginger industry, covering cultivation, sourcing, processing, packaging, distribution, and international trade.
                    </p>

                    <p>
                        Over the years, we have built long-term and stable partnerships with professional growers and packing facilities in China. This enables us to supply both organic ginger and GlobalG.A.P.-certified conventional ginger that complies with EU Maximum Residue Levels (MRL) requirements.
                    </p>

                    <p>
                        Our expertise covers the entire supply chain, including cultivation management, sourcing, production, quality control, food safety management, and international logistics.
                    </p>

                    <div className="about-hero__actions">
                        <a href="/catalogue" className="about-btn about-btn--primary">
                            Discover More
                        </a>
                        <a href="#our-story" className="about-btn about-btn--secondary">
                            Our Approach
                        </a>
                    </div>
                </div>

                <div className="about-image-frame about-hero__image">
                    <img
                        src={gingerHarvestImg}
                        alt="Farmer harvesting fresh ginger in the field"
                    />
                </div>
            </section>

            <section className="about-section about-values">
                <div className="about-section-heading">
                    <h2>Our Core Values</h2>
                    <p>The principles that shape the way we work</p>
                </div>

                <div className="about-card-grid about-card-grid--four">
                    <article className="about-card about-value-card">
                        <div className="about-icon-badge" aria-hidden="true">
                            <LeafIcon />
                        </div>
                        <h3>Quality</h3>
                        <p>
                            We value freshness, consistency, and product standards that
                            support long-term trust.
                        </p>
                    </article>

                    <article className="about-card about-value-card">
                        <div className="about-icon-badge" aria-hidden="true">
                            <ClockIcon />
                        </div>
                        <h3>Reliability</h3>
                        <p>
                            We focus on dependable coordination between sourcing, supply,
                            and customer needs.
                        </p>
                    </article>

                    <article className="about-card about-value-card">
                        <div className="about-icon-badge" aria-hidden="true">
                            <HandshakeIcon />
                        </div>
                        <h3>Partnership</h3>
                        <p>
                            Strong business relationships are essential to building stable
                            and effective produce networks.
                        </p>
                    </article>

                    <article className="about-card about-value-card">
                        <div className="about-icon-badge" aria-hidden="true">
                            <BoxIcon />
                        </div>
                        <h3>Efficiency</h3>
                        <p>
                            We aim for practical, well-organized processes that support
                            smooth distribution and delivery.
                        </p>
                    </article>
                </div>
            </section>

            <section
                id="our-story"
                className="about-section about-split about-split--story"
            >
                <div className="about-image-frame about-split__image">
                    <img
                        src={farmFamilyImg}
                        alt="Family sitting together on a farm vehicle"
                    />
                </div>

                <div className="about-split__content">
                    <h2>From Source to Market</h2>

                    <p>
                        We work closely with carefully selected growers and production farms in China, Peru, Brazil, and Thailand. These partners operate their own ginger farms and have extensive cultivation experience and expertise.
                    </p>

                    <p>
                        Our long-term partnerships enable us to ensure full traceability, consistent quality, and reliable year-round supply. We know our partners, and we trust their quality. We strongly believe that close cooperation at origin is the key to delivering premium ginger to the European market.
                    </p>

                    <p>
                        At Green Earth Produce, we believe in keeping things simple and fresh — every day. That is a promise our customers can count on.
                    </p>
                </div>
            </section>

            <section className="about-section about-impact">
                <div className="about-section-heading">
                    <h2>What We Focus On</h2>
                    <p>Key areas that define our daily work</p>
                </div>

                <div className="about-card-grid about-card-grid--four">
                    <article className="about-card about-stat-card">
                        <strong>Fresh Produce</strong>
                        <span>Fruit and vegetable products handled with attention to quality
                              and consistency.
                        </span>
                    </article>

                    <article className="about-card about-stat-card">
                        <strong>Supply Coordination</strong>
                        <span>Supporting the connection between sourcing, distribution,
                              and customer demand.
                        </span>
                    </article>

                    <article className="about-card about-stat-card">
                        <strong>Business Relationships</strong>
                        <span>Building dependable cooperation with partners across the
                              produce chain.
                        </span>
                    </article>

                    <article className="about-card about-stat-card">
                        <strong>Market Awareness</strong>
                        <span>Responding to product, timing, and supply expectations
                              in a practical way.
                        </span>
                    </article>
                </div>
            </section>

            <section className="about-section about-split about-split--reverse">
                <div className="about-split__content">
                    <h2>A Responsible Approach</h2>

                    <p>
                        GreenEarth Produce values professional and responsible ways of
                        working. In a sector where quality, timing, and product handling
                        are essential, careful coordination and efficient processes play
                        an important role in supporting reliable supply.
                    </p>

                    <ul className="about-check-list">
                        <li>Focus on product quality and consistency</li>
                        <li>Clear coordination across the supply chain</li>
                        <li>Attention to efficient distribution processes</li>
                        <li>Commitment to dependable business relationships</li>
                    </ul>
                </div>

                <div className="about-image-frame about-split__image">
                    <img src={gingerFieldImg} alt="Fresh ginger displayed on soil" />
                </div>
            </section>

            <section className="about-section about-team">
                <div className="about-image-frame about-team__banner">
                    <img src={teamBannerImg} alt="GreenEarth team members smiling" />
                </div>

                <div className="about-card-grid about-team-grid about-team-grid--single">
                    <article className="about-card about-team-card about-team-card--featured">
                        <h3>Our Team</h3>
                        <p>
                            For over 30 years, GEP team has specialized in ginger supply chain management, building expertise that spans the entire value chain—from cultivation and sourcing to food safety, quality control, logistics, and global distribution.
                        </p>
                        <p>
                            Driven by professionalism, dedication, and attention to detail, we are committed to ensuring product quality, supply stability, and operational excellence at every step.
                        </p>
                        <p>
                            More than a supplier, we are a strategic supply chain solutions partner. We work closely with our customers to deliver not only premium ginger products, but also reliable, efficient, and sustainable supply chain solutions that support long-term business growth.
                        </p>
                    </article>
                </div>
            </section>

            <section className="about-section about-newsletter">
                <div className="about-newsletter__box">
                    <h2>Stay Connected</h2>
                    <p>
                        Follow GreenEarth Produce for updates, product information, and
                        company developments.
                    </p>
                    <p className="about-newsletter__subtext">
                        Stay informed about our work in the fresh produce sector.
                    </p>

                    <form className="about-newsletter__form" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="about-btn about-btn--accent"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>

                    {statusMessage && (
                        <p className="about-newsletter__status">
                            {statusMessage}
                        </p>
                    )}
                </div>
            </section>

        </div>
    )
}
