import React, { useState } from "react";
import publications from "../../../Sample_Data/research_publications.json";
import SIGPublicationCard from "../../../pages/SIGs/SIGPublicationCard.jsx";
import "./TheoreticalCS_Page.scss";
import OthersCanvas from "./OthersCanvas.jsx";
import TheoryCanvas from "./TheoryCanvas.jsx";
import SIGProfessorCard from "../../../pages/SIGs/SIGProfessorCard.jsx";
import SIGSeminarCard from "../../../pages/SIGs/SIGSeminarCard.jsx";

export default function OthersPage({ onBack, showBack = false }) {
  const data = publications.find((d) => d.domain === "Theoretical Computer Science (Quantum Computing, Discrete Mathematics & Graph Theory)");
  const [view, setView] = useState("publications");

  return (
    <section className="gen">
      <div className="gen__hero">
        {showBack && (
          <button className="gen__back" onClick={onBack} aria-label="Back to SIGs">← SIGs</button>
        )}

        {/* here Put TheoryCanvas to show theory specific animation */}
  <TheoryCanvas className="gen__canvas" />
  <OthersCanvas className="gen__canvas" />
        <div className="gen__orbs" aria-hidden="true" />
        <div className="gen__fade" aria-hidden="true" />
        <div className="gen__content container">
          <h1 className="gen__title">Theoretical CS</h1>
          <p className="gen__subtitle">Quantum computing, discrete mathematics, and graph theory.</p>
          <div className="gen__chips" aria-label="Areas">
            <span className="gen-chip">Quantum</span>
            <span className="gen-chip">Complexity</span>
            <span className="gen-chip">Graph Theory</span>
            <span className="gen-chip">Combinatorics</span>
            <span className="gen-chip">Algorithms</span>
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
        <div className="container gen__list sig-section">
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
      )}

      {view === "professors" && (
        <div className="container gen__list sig-section" style={{marginTop: "2rem"}}>
          <h2 className="gen__section-title">Professors in this domain</h2>
          <div className="gen__cards">
            {data?.professors?.map((prof, idx) => (
              <SIGProfessorCard key={idx} {...prof} />
            ))}
          </div>
        </div>
      )}

      {view === "seminars" && (
        <div className="container gen__list sig-section" style={{marginTop: "2rem"}}>
          <h2 className="gen__section-title">Seminars</h2>
          <div className="gen__cards">
            {data?.seminars?.map((sem, idx) => (
              <SIGSeminarCard key={idx} {...sem} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
