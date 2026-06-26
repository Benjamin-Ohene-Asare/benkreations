import React from 'react'
import './banner.css'
import image from '../../assets/banner2.png'

const Banner = () => {
  return (
    <div className='banner'>
      <img className="banner__img" src={image} alt="banner" />
      <div className="banner__overlay"></div>

      <div className="banner__content">
        <h1 className="banner__title">
          Professional Design,<br />
          <span>Made Simple.</span>
        </h1>
        <p className="banner__subtitle">
          Get high-end Canva templates and digital assets from Oflex Creative.
        </p>
        <a href="#" className="banner__btn">
          Shop Collection <span className="banner__btn-arrow">→</span>
        </a>
      </div>
    </div>
  )
}

export default Banner