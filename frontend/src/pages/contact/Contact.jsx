import React from 'react'
import './Contact.css'

const contactDetails = [
  {
    id: 'email',
    label: 'Email',
    value: 'benjaminoheneasare65@gmail.com',
    icon: 'mail',
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+233 54 125 4645',
    icon: 'phone',
  },
  {
    id: 'location',
    label: 'Location',
    value: 'Accra, Ghana',
    icon: 'pin',
  },
]

const socialLinks = [
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'gh.kojosweet.5',
    href: 'https://web.facebook.com/gh.kojosweet.5',
    color: '#1877F2',
    bg: '#E7F0FD',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: '@techwithbenjamin_',
    href: 'https://www.tiktok.com/@techwithbenjamin_',
    color: '#010101',
    bg: '#F0F0F0',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    handle: '0541254645',
    href: 'https://wa.me/233541254645',
    color: '#25D366',
    bg: '#E9FBF0',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L.057 23.552a.5.5 0 00.613.612l5.757-1.47A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.028-1.383l-.36-.214-3.733.953.984-3.641-.235-.374A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'Connect with us',
    href: '#',
    color: '#0A66C2',
    bg: '#E8F0FB',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

const contactIcons = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M6.5 3h2.7l1.8 4.5-2 1.2a12.5 12.5 0 006.3 6.3l1.2-2 4.5 1.8v2.7a2 2 0 01-2.1 2A17 17 0 014.5 5.1 2 2 0 016.5 3z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-7.4 7-12.3A7 7 0 005 8.7C5 13.6 12 21 12 21z" />
      <circle cx="12" cy="8.7" r="2.4" />
    </>
  ),
}

function ContactIcon({ name }) {
  return (
    <svg
      className="contact__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {contactIcons[name]}
    </svg>
  )
}

const Contact = () => {
  return (
    <div className="contact__wrapper">
      <section className="contact__getInTouch">

        <div className="contact__infoColumn">
          <h2 className="contact__heading">Get In Touch</h2>
          <p className="contact__introText">
            Ready to start your project? Contact us through any of these channels.
          </p>

          <ul className="contact__infoList">
            {contactDetails.map((detail) => (
              <li className="contact__infoCard" key={detail.id}>
                <span className="contact__infoIconWrap">
                  <ContactIcon name={detail.icon} />
                </span>
                <span className="contact__infoText">
                  <span className="contact__infoLabel">{detail.label}</span>
                  <span className="contact__infoValue">{detail.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="contact__socialColumn">
          <h3 className="contact__followHeading">Follow Us</h3>
          <p className="contact__followSubtext">Find us on social media and reach out anytime.</p>

          <ul className="contact__socialList">
            {socialLinks.map((social) => (
              <li key={social.id}>
                <a
                  className="contact__socialCard"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ '--social-color': social.color, '--social-bg': social.bg }}
                >
                  <span className="contact__socialIconWrap">
                    {social.icon}
                  </span>
                  <span className="contact__socialInfo">
                    <span className="contact__socialLabel">{social.label}</span>
                    <span className="contact__socialHandle">{social.handle}</span>
                  </span>
                  <svg className="contact__socialArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

      </section>
    </div>
  )
}

export default Contact