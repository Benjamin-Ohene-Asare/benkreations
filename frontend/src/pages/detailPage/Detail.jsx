import React from 'react'
import image from '../../assets/1.jpg'
import './Detail.css'

const Detail = () => {
  return (
    <div className='detail-page'>

      <div className="detail-img">
        <img src={image} alt="Bible Study Flyer" />
      </div>

      <div className="detail-info">

        <span className="detail-info__badge">Church Flyers</span>

        <h1>Bible Study Flyer</h1>

        <div className="detail-info__rating">
          <span className="detail-info__stars">★★★★★</span>
          <span className="detail-info__rating-text">(4.9/5 rating)</span>
        </div>

        <p className="detail-info__desc">
          A premium digital product designed to enhance your creative workflow.
        </p>

        <div className="detail-info__included">
          <h3>What's Included:</h3>
          <ul className="detail-info__included-list">
            <li>Instant digital download</li>
            <li>Editable in Canva / PSD</li>
            <li>Commercial use license</li>
          </ul>
        </div>

        <div className="detail-info__price">
          <span className="detail-info__price-amount">$0.01</span>
          <span className="detail-info__price-label">one-time purchase</span>
        </div>

        <button className="detail-info__btn">🛒 Add to Cart</button>

        {/* <p className="detail-info__secure">Secure checkout • Instant delivery after payment</p> */}

      </div>

    </div>
  )
}

export default Detail