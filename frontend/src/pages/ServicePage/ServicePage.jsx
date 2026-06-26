import React from 'react'
import './Service.css'

const SERVICES = [
  {
    id: 'development',
    title: 'Development',
    icon: 'code',
    desc: 'Full-stack engineering for web and mobile. We build robust websites, scalable web apps, custom software, and native mobile applications tailored to your business logic.',
    features: ['Full-Stack Web Dev', 'Mobile App Dev', 'Custom Software', 'Scalable Systems'],
  },
  {
    id: 'design',
    title: 'Graphic Design',
    icon: 'palette',
    desc: "Strategic UI/UX and visual identity. We design intuitive interfaces and striking brand visuals that bridge the gap between aesthetic beauty and functional performance.",
    features: ['UI/UX Design', 'Visual Identity', 'Brand Graphics', 'Creative Direction'],
  },
  {
    id: 'photography',
    title: 'Photography',
    icon: 'camera',
    desc: "Professional visual storytelling. High-quality commercial and product photography designed to elevate your brand's aesthetic and showcase your work with clarity.",
    features: ['Commercial Photo', 'Product Shoots', 'Brand Imagery', 'Visual Clarity'],
  },
]

const STEPS = [
  { id: '01', title: 'Discovery', desc: 'Understanding your needs, goals, and vision.' },
  { id: '02', title: 'Strategy', desc: 'Creating a tailored plan for your project.' },
  { id: '03', title: 'Creation', desc: 'Bringing your vision to life with precision.' },
  { id: '04', title: 'Delivery', desc: 'Final review and handover of your assets.' },
]

const ICONS = {
  code: (
    <>
      <polyline points="9 7 4 12 9 17" />
      <polyline points="15 7 20 12 15 17" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 100 18c1.4 0 2.1-.9 2.1-2 0-.6-.2-1.1-.5-1.6-.3-.5-.5-1-.5-1.6 0-1.2 1-2.1 2.2-2.1H17a4 4 0 004-4c0-3.8-4-6.7-9-6.7z" />
      <circle cx="8.3" cy="10.2" r="1.1" />
      <circle cx="11.8" cy="7.6" r="1.1" />
      <circle cx="15.6" cy="9.4" r="1.1" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.2 7L9.6 4.2h4.8L15.8 7" />
      <circle cx="12" cy="13.5" r="3.4" />
    </>
  ),
}

function Icon({ name }) {
  return (
    <svg
      className="service__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  )
}

const ServicePage= () => {
  return (
    <div className="service__wrapper">
      {/* Intro */}
      <section className="service__intro">
        <span className="service__eyebrow">Our Expertise</span>
        <h2 className="service__heading">Comprehensive Creative Solutions</h2>
        <p className="service__subhead">
          We combine strategic thinking with creative excellence to deliver results that
          elevate your brand and engage your audience.
        </p>
      </section>

      {/* Service cards */}
      <section className="service__grid">
        {SERVICES.map((service, i) => (
          <article className="service__card" key={service.id}>
            <span className="service__tag">
              <span className="service__tagHole" />
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="service__iconWrap">
              <Icon name={service.icon} />
            </div>

            <h3 className="service__cardTitle">{service.title}</h3>
            <p className="service__cardDesc">{service.desc}</p>

            <ul className="service__features">
              {service.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <button type="button" className="service__cta service__cta--primary">
              Get in Touch
            </button>
          </article>
        ))}
      </section>

      {/* How we work */}
      <section className="service__method">
        <span className="service__eyebrow">Our Method</span>
        <h2 className="service__heading">How We Work</h2>
        <p className="service__subhead">A transparent and collaborative approach to every project.</p>

        <div className="service__steps">
          <span className="service__stepsLine" aria-hidden="true" />
          {STEPS.map((step) => (
            <div className="service__step" key={step.id}>
              <span className="service__stepNumber">{step.id}</span>
              <h4 className="service__stepTitle">{step.title}</h4>
              <p className="service__stepDesc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="service__ctaPanel">
        <span className="service__ctaDots" aria-hidden="true" />
        <span className="service__ctaGlow" aria-hidden="true" />
        <span className="service__ctaRing" aria-hidden="true" />

        <div className="service__ctaContent">
          <h2 className="service__ctaTitle">Have a Project in Mind?</h2>
          <p className="service__ctaSub">
            We're always excited to discuss new ideas and help bring them to life. Let's
            start building your next success story.
          </p>
          <div className="service__ctaActions">
            <button type="button" className="service__cta service__cta--primary">
              Start a Project
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="service__cta service__cta--ghost">
              Browse Templates
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicePage