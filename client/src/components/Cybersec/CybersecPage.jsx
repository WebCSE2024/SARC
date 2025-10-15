import React, { useState } from "react";
import publications from "../../../Sample_Data/research_publications.json";
import SIGPublicationCard from "../../../pages/SIGs/SIGPublicationCard.jsx";
import "./CybersecPage.scss";
import CodeRainCanvas from "./CodeRainCanvas.jsx";
import SIGProfessorCard from "../../../pages/SIGs/SIGProfessorCard.jsx";
import SIGSeminarCard from "../../../pages/SIGs/SIGSeminarCard.jsx";

export default function CybersecPage({ onBack, showBack = false }) {
  const data = publications.find((d) => d.domain === "Information Security (Privacy, Blockchain, Network & Hardware Security, Post-quantum Cryptography and related areas)");
  const [view, setView] = useState("publications");

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
          <h1 className="sec__title">Information Security</h1>
          <p className="sec__subtitle">Privacy, blockchain, network/hardware security, and post-quantum crypto.</p>
          <div className="sec__chips" aria-label="Security domains">
            <span className="sec-chip">Privacy</span>
            <span className="sec-chip">Blockchain</span>
            <span className="sec-chip">Network Security</span>
            <span className="sec-chip">Hardware Security</span>
            <span className="sec-chip">Post-Quantum</span>
          </div>
        </div>
      </div>

      <div className="container" style={{marginTop: "1rem"}}>
        <div className="sig-view-tabs" role="tablist" aria-label="Domain content">
          <button className={`sig-tab ${view === "publications" ? "is-active" : ""}`} onClick={() => setView("publications")} aria-current={view === "publications" ? "page" : undefined}>Publications</button>
          <button className={`sig-tab ${view === "professors" ? "is-active" : ""}`} onClick={() => setView("professors")} aria-current={view === "professors" ? "page" : undefined}>Professors</button>
          <button className={`sig-tab ${view === "seminars" ? "is-active" : ""}`} onClick={() => setView("seminars")} aria-current={view === "seminars" ? "page" : undefined}>Seminars</button>
        </div>
      </div>

      {view === "publications" && (
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
      )}

      {view === "professors" && (
        <div className="container sec__list" style={{marginTop: "2rem"}}>
          <h2 className="sec__section-title">Professors in this domain</h2>
          <div className="sec__cards">
            {data?.professors?.map((prof, idx) => (
              <SIGProfessorCard key={idx} {...prof} />
            ))}
          </div>
        </div>
      )}

      {view === "seminars" && (
        <div className="container sec__list" style={{marginTop: "2rem"}}>
          <h2 className="sec__section-title">Seminars</h2>
          <div className="sec__cards">
            {data?.seminars?.map((sem, idx) => (
              <SIGSeminarCard key={idx} {...sem} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
