import React from "react";
import publications from "../../research_publications.json";
import SIGPublicationCard from "../../pages/SIGs/SIGPublicationCard.jsx";
import "./OthersPage.scss";
import OthersCanvas from "./OthersCanvas.jsx";

export default function OthersPage({ onBack, showBack = false }) {
  const data = publications.find((d) => d.domain.toLowerCase() === "others");

  return (
    <section className="gen">
      <div className="gen__hero">
        {showBack && (
          <button className="gen__back" onClick={onBack} aria-label="Back to SIGs">← SIGs</button>
        )}
        <OthersCanvas className="gen__canvas" />
        <div className="gen__orbs" aria-hidden="true" />
        <div className="gen__fade" aria-hidden="true" />
        <div className="gen__content container">
          <h1 className="gen__title">Others</h1>
          <p className="gen__subtitle">DBMS, IoT, Web Development, and Systems Design.</p>
          <div className="gen__chips" aria-label="Areas">
            <span className="gen-chip">DBMS</span>
            <span className="gen-chip">IoT</span>
            <span className="gen-chip">Web Dev</span>
            <span className="gen-chip">Systems Design</span>
            <span className="gen-chip">Distributed</span>
          </div>
        </div>
      </div>

      <div className="container gen__list">
        <h2 className="gen__section-title">Research publications</h2>
        <div className="gen__cards">
          {data?.research_publications?.map((item, idx) => {
            const previews = [
              { type: "image", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=60" }, // DB
              { type: "image", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=60" }, // IoT
              { type: "image", src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=60" }, // WebDev
              { type: "image", src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop&q=60" }, // Systems
            ];
            return <SIGPublicationCard key={idx} {...item} preview={previews[idx % previews.length]} />;
          })}
        </div>
      </div>
    </section>
  );
}
