import { Link } from 'react-router-dom'

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.45c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  )
}


// Static content (unlike Home/About/Catalogue, which pull from Supabase) —
// there's no admin UI for footer text/links, so changes require a code edit.
export function Footer() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer__inner">

        {/* Brand column */}
        <section className="site-footer__col site-footer__col--brand">
          <h2 className="site-footer__heading">Green Earth Produce B.V.</h2>
          <p className="site-footer__blurb">
            <a href="https://maps.google.com/?q=Venrayseweg+118+C,+5928+RH+Venlo" target="_blank" rel="noreferrer" className="site-footer__link" aria-label="Location">
              Venrayseweg 118 C, 5928 RH Venlo
            </a>
            <br />
            <a href="tel:+31772066760" className="site-footer__link" aria-label="Call us">+31 77 206 6760</a>
          </p>
          <div className="site-footer__socials" aria-label="Social media">
            <a className="site-footer__social" href="https://www.instagram.com/greenearthproducebv/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <IconInstagram />
            </a>
<a className="site-footer__social" href="https://www.linkedin.com/in/green-earth-produce-b-v-35a570371/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <IconLinkedIn />
            </a>
          </div>
        </section>

        {/* Nav columns */}
        <nav className="site-footer__col" aria-labelledby="site-footer-products">
          <h2 id="site-footer-products" className="site-footer__heading">Products</h2>
          <ul className="site-footer__list">
            <li><Link className="site-footer__link" to="/catalogue">Fresh Produce</Link></li>
          </ul>
        </nav>

        <nav className="site-footer__col" aria-labelledby="site-footer-support">
          <h2 id="site-footer-support" className="site-footer__heading">Support</h2>
          <ul className="site-footer__list">
            <li><Link className="site-footer__link" to="/contact">Support</Link></li>
          </ul>
        </nav>

        <nav className="site-footer__col" aria-labelledby="site-footer-legal">
          <h2 id="site-footer-legal" className="site-footer__heading">Legal</h2>
          <ul className="site-footer__list">
            <li><Link className="site-footer__link" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="site-footer__link" to="/imprint">Imprint</Link></li>
          </ul>
        </nav>

        {/* Link to the CMS login — gated by Supabase auth on the /admin route itself */}
        <nav className="site-footer__col" aria-labelledby="site-footer-admin">
          <h2 id="site-footer-admin" className="site-footer__heading">Admin</h2>
          <ul className="site-footer__list">
            <li><Link className="site-footer__link" to="/admin">Admin Portal</Link></li>
          </ul>
        </nav>

      </div>
    </footer>
  )
}
