import React from 'react'
import './Footer.css'
import { Link } from "react-router-dom";

const NAV_COLUMNS = [
  {
    heading: "About",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "PSD Store", to: "/psd-store" },
      { label: "Services", to: "/services" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Development", to: "/services" },
      { label: "Graphic Design", to: "/services" },
      { label: "Photography", to: "/services" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login / Register", to: "/login" },
      { label: "My Profile", to: "/user-dashboard", protected: true },
      { label: "My Orders", to: "/user-dashboard", protected: true },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQs / Help", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms-of-service" },
    ],
  },
];

const SOCIALS = [
  { label: 'FB', href: 'https://web.facebook.com/gh.kojosweet.5' },
  { label: 'TK', href: 'https://www.tiktok.com/@techwithbenjamin_' },
  { label: 'WA', href: 'https://wa.me/233541254645' },
  { label: 'LI', href: '#' },
]

const Footer = () => {
  return (
    <footer className="footer__root">

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
              <a key={s.label} href={s.href} className="footer__social-link" target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Nav */}
        <div className="footer__center">
          <nav className="footer__nav">
            {NAV_COLUMNS.map((col) => (
              <div key={col.heading} className="footer__nav-col">
                <h4 className="footer__nav-heading">{col.heading}</h4>
                <ul className="footer__nav-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="footer__nav-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span className="footer__copyright">© 2026 Benkreations. All rights reserved.</span>
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