import React, { useState } from 'react'
import './Contact.css'

// ---------------------------------------------------------------------------
// Backend endpoint — point this at your Django view/DRF route.
// Expected payload: { name, email, subject, message }
// ---------------------------------------------------------------------------
const CONTACT_ENDPOINT = '/api/contact/'

const contactDetails = [
  {
    id: 'email',
    label: 'Email',
    value: 'hello@yourstudio.com',
    icon: 'mail',
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+233 55 045 6342',
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
  { id: 'instagram', label: 'Instagram', href: '#' },
  { id: 'twitter', label: 'Twitter', href: '#' },
  { id: 'linkedin', label: 'LinkedIn', href: '#' },
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
  send: <path d="M3 11.2L21 3l-8.2 18-2-8-8-1.8z" />,
  chevron: <polyline points="6 9 12 15 18 9" />,
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
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitState, setSubmitState] = useState('idle') // idle | sending | sent | error
  const [openFaqId, setOpenFaqId] = useState(null)

  const handleFieldChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitState('sending')

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Request failed')

      setSubmitState('sent')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setSubmitState('error')
    }
  }

  const toggleFaq = (id) => {
    setOpenFaqId((current) => (current === id ? null : id))
  }

  return (
    <div className="contact__wrapper">
      {/* Get in touch */}
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

          <h3 className="contact__followHeading">Follow Us</h3>
          <ul className="contact__socialList">
            {socialLinks.map((social) => (
              <li key={social.id}>
                <a className="contact__socialLink" href={social.href}>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__formRow">
            <div className="contact__formGroup">
              <label className="contact__fieldLabel" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                className="contact__textInput"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleFieldChange('name')}
                required
              />
            </div>

            <div className="contact__formGroup">
              <label className="contact__fieldLabel" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                className="contact__textInput"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleFieldChange('email')}
                required
              />
            </div>
          </div>

          <div className="contact__formGroup">
            <label className="contact__fieldLabel" htmlFor="contact-subject">
              Subject
            </label>
            <input
              id="contact-subject"
              className="contact__textInput"
              type="text"
              placeholder="What's this about?"
              value={formData.subject}
              onChange={handleFieldChange('subject')}
              required
            />
          </div>

          <div className="contact__formGroup">
            <label className="contact__fieldLabel" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              className="contact__messageInput"
              placeholder="Tell us about your project..."
              value={formData.message}
              onChange={handleFieldChange('message')}
              rows={6}
              required
            />
          </div>

          <button type="submit" className="contact__submitButton" disabled={submitState === 'sending'}>
            <ContactIcon name="send" />
            {submitState === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {submitState === 'sent' && (
            <p className="contact__formStatus contact__formStatus--success">
              Message sent — we'll get back to you soon.
            </p>
          )}
          {submitState === 'error' && (
            <p className="contact__formStatus contact__formStatus--error">
              Something went wrong. Please try again in a moment.
            </p>
          )}
        </form>
      </section>

     
    </div>
  )
}

export default Contact