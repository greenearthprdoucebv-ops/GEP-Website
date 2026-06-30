import { useEffect, useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gepLogo from '../assets/about/GEPLogo.png';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [show, setShow] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // Only the homepage has a full-bleed hero, so elsewhere the navbar is always
  // visible/solid. On home it fades in at 75% of one viewport height of scroll
  // and turns solid once the user has scrolled a full viewport past the hero.
  const onScroll = useCallback(() => {
    if (!isHome) return;
    const y = window.scrollY;
    const heroH = window.innerHeight;
    setShow(y > heroH * 0.75);
    setSolid(y >= heroH);
  }, [isHome]);

  useEffect(() => {
    if (isHome) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    } else {
      setShow(false);
      setSolid(false);
    }
  }, [isHome, onScroll]);

  // Close the mobile drawer on navigation, and also if the navbar itself
  // scrolls out of view (so the drawer can't stay open over a hidden bar).
  useEffect(() => { closeMenu(); }, [location.pathname]);
  useEffect(() => { if (!show) closeMenu(); }, [show]);

  const navClass = [
    'navbar',
    isHome && show ? 'show' : '',
    isHome && solid ? 'solid' : '',
    !isHome ? 'always-visible' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <nav className={navClass}>
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src={gepLogo}
            alt="Green Earth Produce Logo"
            style={{ height: '40px', width: 'auto' }}
          />
        </Link>

        <ul className="nav-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/catalogue">Products</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <button
          className={`nav-hamburger${menuOpen ? ' nav-hamburger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`nav-drawer${menuOpen ? ' nav-drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/catalogue" onClick={closeMenu}>Products</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
      </div>

      {menuOpen && <div className="nav-backdrop" onClick={closeMenu} />}
    </>
  );
}
