import React from "react";
import publications from "../../research_publications.json";
import SIGPublicationCard from "../../pages/SIGs/SIGPublicationCard.jsx";
import "./BlockchainPage.scss";
import BitcoinCanvas from "./BitcoinCanvas.jsx";

export default function BlockchainPage({ onBack, showBack = false }) {
  const data = publications.find((d) => d.domain.toLowerCase() === "blockchain");

  return (
    <section className="bc">
      <div className="bc__hero">
        {showBack && (
          <button className="bc__back" onClick={onBack} aria-label="Back to SIGs">← SIGs</button>
        )}
        <BitcoinCanvas className="bc__canvas" />
        <div className="bc__mesh" aria-hidden="true" />
        <div className="bc__fade" aria-hidden="true" />
        <div className="bc__content container">
          <h1 className="bc__title">Blockchain</h1>
          <p className="bc__subtitle">PoW consensus, UTXO model, and decentralized money systems.</p>
          <div className="bc__chips" aria-label="Core concepts">
            <span className="bc-chip">Proof of Work</span>
            <span className="bc-chip">UTXO</span>
            <span className="bc-chip">Mining</span>
            <span className="bc-chip">Lightning</span>
            <span className="bc-chip">Halving</span>
          </div>
        </div>
      </div>

      <div className="container bc__list">
        <h2 className="bc__section-title">Research publications</h2>
        <div className="bc__cards">
          {data?.research_publications?.map((item, idx) => {
            const previews = [
              { type: "image", src: "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=1200&auto=format&fit=crop&q=60" },
              { type: "image", src: "https://images.unsplash.com/photo-1621416382950-43a0b25b5bc8?w=1200&auto=format&fit=crop&q=60" },
              { type: "image", src: "https://images.unsplash.com/photo-1641971926420-1f1f4a88c205?w=1200&auto=format&fit=crop&q=60" },
            ];
            return <SIGPublicationCard key={idx} {...item} preview={previews[idx % previews.length]} />;
          })}
        </div>
      </div>
    </section>
  );
}
