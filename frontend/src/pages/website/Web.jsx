import React from 'react'
import './web.css'
import img1 from '../../assets/VOTEAFRIC.png'
import img2 from '../../assets/inhim.png'
import img3 from '../../assets/amazing.png'

const projects = [
    {
        id: 1,
        img: img1,
        name: 'VoteAfric',
        desc: 'Secure online and USSD voting platform with real-time results, live vote tracking, and seamless payment integration.',
        link: '#',
    },
    {
        id: 2,
        img: img2,
        name: 'himfoundation',
        desc: 'A non-profit foundation providing support, care, and community assistance to widows, the needy, persons with disabilities, and underserved communities.',
        link: '#',
    },
    {
        id: 3,
        img: img3,
        name: 'Amazing',
        desc: 'An amazing project that brings joy and excitement to everyone who experiences it.',
        link: '#',
    }

]

const WebApp = () => {
    return (
        <section className="web-app">
            <div className="web-app__header">
                <span className="web-app__eyebrow">PSD Store</span>
                <h2 className="web-app__title">Our Projects</h2>
                <p className="web-app__subtitle">Editable flyer and social media templates, designed for fast customization.</p>
            </div>

            <div className="web-app__grid">
                {projects.map((project) => (
                    <div className="web-app__card" key={project.id}>
                        <img className="web-app__card-img" src={project.img} alt={project.name} />
                        <div className="web-app__card-body">
                            <p className="web-app__card-desc">
                                <strong>{project.name}</strong> {project.desc}
                            </p>
                            <a href={project.link} className="web-app__card-btn">View Project</a>
                        </div>
                    </div>
                ))}

            </div>
            
        </section>
    )
}

export default WebApp