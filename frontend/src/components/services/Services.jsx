import React from 'react'
import './service.css'
const Services = () => {
    return (
        <div className='services'>
            <div className="heading">
                <h2>Our Services</h2>
                <p>Comprehensive creative solutions tailored to your needs

                </p>
            </div>
            <div className="service-grid">
                <div className="service-card">
                    <h3>Web Development</h3>
                    <p>We build fast, modern, and responsive websites that deliver excellent performance, user experience, and scalability to support your business growth.
</p>

                    <div className="learn-more">
                        <button>Learn More</button>
                    </div>

                </div>
                <div className="service-card">
                    <h3>Graphic Design</h3>
                    <p>Our creative designers craft impactful visuals, from logos and branding to marketing materials and web designs, helping your brand stand out and leave a lasting impression.
</p>
                    <div className="learn-more">
                        <button>Learn More</button>
                    </div>
                </div>

                <div className="service-card">
                    <h3>Social Media Management</h3>
                    <p>We help businesses grow online through effective social media management, engaging content, and strategic campaigns that increase brand awareness, visibility, and audience engagement.
</p>
                    <div className="learn-more">
                        <button>Learn More</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Services
