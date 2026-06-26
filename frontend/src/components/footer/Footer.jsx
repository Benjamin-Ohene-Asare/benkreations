import React, { useState } from 'react'
import './Footer.css'

const NAV_COLUMNS = [
  { heading: 'About',    links: ['Our Story', 'Team', 'Contact'] },
  { heading: 'Discover', links: ['Projects', 'Store', 'News'] },
  { heading: 'Services', links: ['Development', 'Graphic Design', 'Photography'] },
  { heading: 'Account',  links: ['Login / Register', 'My Profile', 'My Orders'] },
  { heading: 'Support',  links: ['FAQs / Help', 'Privacy Policy', 'Terms of Service'] },
]

const STORE_ITEMS = [
  { title: 'Bible Study Flyer', category: 'Church Flyers',  price: '$0.01' },
  { title: 'Charity Flyer',     category: 'NGO Templates',  price: '$0.01' },
  { title: 'Event Poster',      category: 'Marketing',      price: '$0.01' },
]

const TRUST_BADGES = [
  {
    label: 'Secure Payments',
    sub: 'Trusted checkout',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Instant Delivery',
    sub: 'Get it immediately',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
]

const SOCIALS = ['T', 'I', 'L', 'B']

const Footer = () => {
  const [email, setEmail] = useState('')

  return (
    <footer className="footer__root">

      {/* ── TOP: brand / store cards / newsletter ── */}
      <div className="footer__top">

        {/* Col 1: Brand */}
        <div className="footer__brand">
          <h2 className="footer__logo">
            Benkreations<span className="footer__logo-accent">.</span>
          </h2>
          <p className="footer__tagline">
            From concept to launch — your partners in creative excellence.
          </p>
          <div className="footer__location">
            <span className="footer__location-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span className="footer__location-text">Pentecost University, Sowutuom — Accra</span>
          </div>
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <a key={s} href="#" className="footer__social-link">{s}</a>
            ))}
          </div>
        </div>

        {/* Col 2: Nav + store cards stacked */}
        <div className="footer__center">
          <nav className="footer__nav">
            {NAV_COLUMNS.map((col) => (
              <div key={col.heading} className="footer__nav-col">
                <h4 className="footer__nav-heading">{col.heading}</h4>
                <ul className="footer__nav-list">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="footer__nav-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Store cards sit right below nav */}
          <div className="footer__store-grid">
            {STORE_ITEMS.map((item) => (
              <div key={item.title} className="footer__store-item">
                <div className="footer__store-thumb" />
                <div className="footer__store-info">
                  <span className="footer__store-title">{item.title}</span>
                  <span className="footer__store-cat">{item.category}</span>
                  <span className="footer__store-price">{item.price}</span>
                </div>
                <span className="footer__store-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Newsletter only */}
        <div className="footer__right">
          <h4 className="footer__section-heading">Stay Updated</h4>
          <p className="footer__section-sub">
            Subscribe for the latest design trends and updates.
          </p>
          <div className="footer__email-row">
            <input
              className="footer__email-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="footer__email-btn" aria-label="Subscribe">→</button>
          </div>
        </div>
      </div>

     

      {/* ── BOTTOM BAR ── */}
      <div className="footer__bottom">
        <span className="footer__copyright">© 2026 Studio. All rights reserved.</span>
        <div className="footer__bottom-links">
          <a href="#" className="footer__bottom-link">Privacy</a>
          <a href="#" className="footer__bottom-link">Terms</a>
          <a href="#" className="footer__bottom-link">Cookies</a>
        </div>
      </div>

    </footer>
  )
}

export default Footer