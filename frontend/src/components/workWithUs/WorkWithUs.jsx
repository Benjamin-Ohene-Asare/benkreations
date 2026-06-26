import React from 'react'
import './WorkWithUs.css'
import  benk from '../../assets/ben.jpg'

const WorkWithUs = () => {
  return (
    <div className="work-with-us__wrapper">
      <div className="work-with-us__grid">

        {/* LEFT: text */}
        <div className="work-with-us__content">
          <div className="work-with-us__eyebrow">
            <span className="work-with-us__eyebrow-dot" />
            <span className="work-with-us__eyebrow-text">Let's Build Something Amazing</span>
          </div>

          <h1 className="work-with-us__headline">
            Ready to <span className="work-with-us__headline-accent">elevate</span>
            <br />your brand<span className="work-with-us__headline-accent">?</span>
          </h1>

          <p className="work-with-us__body">
            Join hundreds of satisfied clients who have transformed their digital
            presence. From concept to launch, we're your partners in creative excellence.
          </p>

          <div className="work-with-us__cta-row">
            <button className="work-with-us__btn-primary">
              Start a Project
              <span className="work-with-us__btn-arrow">→</span>
            </button>
            <button className="work-with-us__btn-ghost">View Our Work</button>
          </div>

          <div className="work-with-us__social-proof">
            <div className="work-with-us__avatar-stack">
              <div className="work-with-us__avatar work-with-us__avatar--1" />
              <div className="work-with-us__avatar work-with-us__avatar--2" />
              <div className="work-with-us__avatar work-with-us__avatar--3" />
              <div className="work-with-us__avatar work-with-us__avatar--4" />
            </div>
            <span className="work-with-us__proof-text">
              <strong className="work-with-us__proof-count">200+</strong> brands launched this year
            </span>
          </div>
        </div>

        {/* RIGHT: browser card */}
        <div className="work-with-us__card">
          <div className="work-with-us__chrome">
            <div className="work-with-us__chrome-dot work-with-us__chrome-dot--red" />
            <div className="work-with-us__chrome-dot work-with-us__chrome-dot--yellow" />
            <div className="work-with-us__chrome-dot work-with-us__chrome-dot--green" />
          </div>

          <div className="work-with-us__image-placeholder">
            <div className="work-with-us__camera-icon-wrap">
              <svg
                className="work-with-us__camera-icon"
                width="26" height="26" viewBox="0 0 24 24"
                fill="none" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <circle cx="12" cy="12.5" r="3.5" />
                <path d="M8 6l1.5-2h5L16 6" />
              </svg>
            </div>
            <p className="work-with-us__placeholder-label">Drop your image here</p>
          </div>

          <div className="work-with-us__card-footer">
            <div className="work-with-us__footer-icon" />
            <div className="work-with-us__footer-lines">
              <div className="work-with-us__footer-line work-with-us__footer-line--wide" />
              <div className="work-with-us__footer-line work-with-us__footer-line--narrow" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default WorkWithUs