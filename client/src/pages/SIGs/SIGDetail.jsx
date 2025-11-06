import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PublicationCard,
  ProfessorCard,
  SeminarCard,
} from "../../components/SIGCards";
import {
  getSIGById,
  getPublicationsBySIG,
  getProfessorsBySIG,
  getSeminarsBySIG,
} from "../../utils/sigDataUtils";
import { getSIGBySlug } from "../../constants/sig.constants";
import BackgroundMedia from "../../components/BackgroundMedia";
import "./SIGDetail.scss";

const SIGDetail = () => {
  const { domain } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("professors");

  const sigConfig = useMemo(() => getSIGBySlug(domain), [domain]);
  const sigData = useMemo(() => getSIGById(domain), [domain]);
  const publications = useMemo(() => getPublicationsBySIG(domain), [domain]);
  const professors = useMemo(() => getProfessorsBySIG(domain), [domain]);
  const seminars = useMemo(() => getSeminarsBySIG(domain), [domain]);

  if (!sigConfig || !sigData) {
    return (
      <div className="sig-detail__error container">
        <h1>SIG Not Found</h1>
        <p>The requested Special Interest Group does not exist.</p>
        <button onClick={() => navigate("/sig")} className="btn primary">
          Back to SIGs
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeView) {
      case "publications":
        return (
          <div className="sig-detail__grid">
            {publications.length > 0 ? (
              publications.map((pub) => (
                <PublicationCard key={pub.id} publication={pub} />
              ))
            ) : (
              <p className="sig-detail__empty">
                No publications available yet.
              </p>
            )}
          </div>
        );

      case "professors":
        return (
          <div className="sig-detail__grid">
            {professors.length > 0 ? (
              professors.map((prof) => (
                <ProfessorCard key={prof.id} professor={prof} />
              ))
            ) : (
              <p className="sig-detail__empty">No professors listed yet.</p>
            )}
          </div>
        );

      case "seminars":
        return (
          <div className="sig-detail__grid">
            {seminars.length > 0 ? (
              seminars.map((sem) => <SeminarCard key={sem.id} seminar={sem} />)
            ) : (
              <p className="sig-detail__empty">No seminars scheduled yet.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="sig-detail">
      <div
        className="sig-detail__hero"
        style={{ "--sig-color": sigConfig.color }}
      >
        {sigConfig.backgroundMedia && (
          <BackgroundMedia media={sigConfig.backgroundMedia} />
        )}
        <div className="sig-detail__hero-bg" aria-hidden="true" />
        <div className="sig-detail__hero-content container">
          <button
            className="sig-detail__back"
            onClick={() => navigate("/sig")}
            aria-label="Back to all SIGs"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All SIGs
          </button>

          <h1 className="sig-detail__title">{sigConfig.name}</h1>
          <p className="sig-detail__description">{sigData.description}</p>

          {sigConfig.tags && sigConfig.tags.length > 0 && (
            <div className="sig-detail__tags" aria-label="Key topics">
              {sigConfig.tags.map((tag, idx) => (
                <span key={idx} className="sig-detail__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sig-detail__content container">
        <nav
          className="sig-detail__tabs"
          role="tablist"
          aria-label="Content sections"
        >
          <button
            className={`sig-detail__tab ${
              activeView === "professors" ? "is-active" : ""
            }`}
            onClick={() => setActiveView("professors")}
            role="tab"
            aria-selected={activeView === "professors"}
            aria-controls="professors-panel"
          >
            Professors
            <span className="sig-detail__tab-count">{professors.length}</span>
          </button>
          <button
            className={`sig-detail__tab ${
              activeView === "publications" ? "is-active" : ""
            }`}
            onClick={() => setActiveView("publications")}
            role="tab"
            aria-selected={activeView === "publications"}
            aria-controls="publications-panel"
          >
            Publications
            <span className="sig-detail__tab-count">{publications.length}</span>
          </button>
          <button
            className={`sig-detail__tab ${
              activeView === "seminars" ? "is-active" : ""
            }`}
            onClick={() => setActiveView("seminars")}
            role="tab"
            aria-selected={activeView === "seminars"}
            aria-controls="seminars-panel"
          >
            Seminars
            <span className="sig-detail__tab-count">{seminars.length}</span>
          </button>
        </nav>

        <div
          className="sig-detail__panel"
          role="tabpanel"
          id={`${activeView}-panel`}
          aria-labelledby={`${activeView}-tab`}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SIGDetail;
