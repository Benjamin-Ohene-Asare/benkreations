import React from "react";
import { Code2, Palette, Share2 } from "lucide-react";
import banner from "../../assets/banner.jpg";
import "./hero.css";

const STATS = [
  { icon: Code2, value: "20+", label: "Websites Built" },
  { icon: Palette, value: "50+", label: "Designs Delivered" },
  { icon: Share2, value: "15+", label: "Brands Managed" },
];

const Hero = () => {
  return (
    <section className="hero" >
      <div className="hero-banner" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-blob hero-blob-a" aria-hidden="true" />
      <div className="hero-blob hero-blob-b" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <h1>
            Web Development, Design &amp; Social Media,{" "}
            <span className="hero-accent">All In One Place!</span>
          </h1>
          <p>
            We build fast, modern websites, craft striking graphic design,
            and manage social media that gets your brand noticed and grows
            your audience.
          </p>

          <div className="hero-actions">
            <a href="#portfolio" className="btn btn-primary">
              View Portfolio
            </a>
            <a href="#contact" className="btn btn-secondary">
              Get In Touch
            </a>
          </div>
        </div>

        <div className="hero-stats">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div className="stat-card" key={label}>
              <span className="stat-icon">
                <Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="stat-value">{value}</p>
                <p className="stat-label">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;