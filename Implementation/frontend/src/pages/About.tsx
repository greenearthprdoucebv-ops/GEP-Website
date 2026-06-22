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
                        GreenEarth Produce is a Venlo-based company active in the fresh
                        fruit and vegetable sector. The company focuses on sourcing and
                        distributing quality produce while building reliable connections
                        between growers, suppliers, and customers.
                    </p>

                    <p>
                        Our goal is to support a consistent and efficient produce flow
                        from origin to market. By combining product knowledge, supply
                        chain coordination, and a strong focus on quality, we aim to
                        create value for both partners and customers.
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
                        At GreenEarth Produce, fresh produce is more than a product category
                        — it is a business built on coordination, timing, and trust. Our work
                        is centered around connecting supply and demand in a way that supports
                        quality and continuity.
                    </p>

                    <p>
                        We operate in a market where reliability matters at every stage. From
                        sourcing and selection to distribution and delivery, each step contributes
                        to making sure products reach the right destination in the right condition.
                    </p>

                    <p>
                        By focusing on clear communication, practical processes, and strong
                        partnerships, we contribute to an efficient and professional fresh
                        produce network.
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
                <div className="about-section-heading">
                    <h2>Our Team</h2>
                    <p>People working behind the flow of fresh produce</p>
                </div>

                <div className="about-image-frame about-team__banner">
                    <img src={teamBannerImg} alt="GreenEarth team members smiling" />
                </div>

                <div className="about-card-grid about-team-grid about-team-grid--single">
                    <article className="about-card about-team-card about-team-card--featured">
                        <h3>Mia Zhang</h3>
                        <p>
                            Mia Zhang helps maintain strong customer relationships through
                            clear communication, responsive support, and dependable service
                            across the fresh produce flow.
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
