import React from "react";
import publications from "../../research_publications.json";
import SIGPublicationCard from "../../pages/SIGs/SIGPublicationCard.jsx";
import "./CybersecPage.scss";
import CodeRainCanvas from "./CodeRainCanvas.jsx";

export default function CybersecPage({ onBack, showBack = false }) {
  const data = publications.find((d) => d.domain.toLowerCase() === "cybersecurity");

  return (
    <section className="sec">
      <div className="sec__hero">
        {showBack && (
          <button className="sec__back" onClick={onBack} aria-label="Back to SIGs">← SIGs</button>
        )}
        <CodeRainCanvas className="sec__canvas" />
        <div className="sec__grid" aria-hidden="true" />
        <div className="sec__fade" aria-hidden="true" />
        <div className="sec__content container">
          <h1 className="sec__title">Cybersecurity</h1>
          <p className="sec__subtitle">Threat modeling, secure systems, and privacy.</p>
          <div className="sec__chips" aria-label="Security domains">
            <span className="sec-chip">Red Team</span>
            <span className="sec-chip">Blue Team</span>
            <span className="sec-chip">Threat Intel</span>
            <span className="sec-chip">Cryptography</span>
            <span className="sec-chip">Zero Trust</span>
          </div>
        </div>
      </div>

      <div className="container sec__list">
        <h2 className="sec__section-title">Research publications</h2>
        <div className="sec__cards">
          {data?.research_publications?.map((item, idx) => {
            const previews = [
              { type: "image", src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&auto=format&fit=crop&q=60" },
              { type: "image", src: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1200&auto=format&fit=crop&q=60" },
              { type: "image", src: "https://images.unsplash.com/photo-1555949963-aa79dcee981d?w=1200&auto=format&fit=crop&q=60" },
            ];
            return <SIGPublicationCard key={idx} {...item} preview={previews[idx % previews.length]} />;
          })}
        </div>
      </div>
    </section>
  );
}
