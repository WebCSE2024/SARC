import React, { useState } from "react";
import publications from "../../../Sample_Data/research_publications.json";
import SIGPublicationCard from "../../../pages/SIGs/SIGPublicationCard.jsx";
import "./ComputerSystemsPage.scss";
import SystemsCanvas from "./SystemsCanvas.jsx";
import SIGProfessorCard from "../../../pages/SIGs/SIGProfessorCard.jsx";
import SIGSeminarCard from "../../../pages/SIGs/SIGSeminarCard.jsx";

export default function BlockchainPage({ onBack, showBack = false }) {
  const data = publications.find((d) => d.domain === "Computer Systems (OS, Distributed and Parallel Computing, IoT, Edge Computing)");
  const [view, setView] = useState("publications");

  return (
    <section className="bc">
      <div className="bc__hero">
        {showBack && (
          <button className="bc__back" onClick={onBack} aria-label="Back to SIGs">← SIGs</button>
        )}
  <SystemsCanvas className="bc__canvas" />
        <div className="bc__mesh" aria-hidden="true" />
        <div className="bc__fade" aria-hidden="true" />
        <div className="bc__content container">
          <h1 className="bc__title">Computer Systems</h1>
          <p className="bc__subtitle">OS, distributed systems, IoT, and edge computing.</p>
          <div className="bc__chips" aria-label="Core concepts">
            <span className="bc-chip">Distributed Systems</span>
            <span className="bc-chip">Consensus</span>
            <span className="bc-chip">Scheduling</span>
            <span className="bc-chip">IoT</span>
            <span className="bc-chip">Edge</span>
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
      )}

      {view === "professors" && (
        <div className="container bc__list" style={{marginTop: "2rem"}}>
          <h2 className="bc__section-title">Professors in this domain</h2>
          <div className="bc__cards">
            {data?.professors?.map((prof, idx) => (
              <SIGProfessorCard key={idx} {...prof} />
            ))}
          </div>
        </div>
      )}

      {view === "seminars" && (
        <div className="container bc__list" style={{marginTop: "2rem"}}>
          <h2 className="bc__section-title">Seminars</h2>
          <div className="bc__cards">
            {data?.seminars?.map((sem, idx) => (
              <SIGSeminarCard key={idx} {...sem} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
