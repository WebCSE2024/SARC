import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SIG_CONFIG } from "../../constants/sig.constants";
import "./SIGOverview.scss";

const SIGOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSIGClick = (slug) => {
    navigate(`/sig/${slug}`);
  };

  return (
    <div className="sig-overview">
      <div className="sig-overview__hero">
        <div className="sig-overview__hero-content container">
          <h1 className="sig-overview__title">Special Interest Groups</h1>
          <p className="sig-overview__subtitle">
            Explore cutting-edge research, connect with faculty, and discover
            opportunities across diverse computer science domains.
          </p>
        </div>
      </div>

      <div className="sig-overview__content container">
        <div className="sig-overview__grid">
          {SIG_CONFIG.map((sig) => (
            <article
              key={sig.id}
              className="sig-overview__card"
              style={{ "--sig-accent": sig.color }}
              onClick={() => handleSIGClick(sig.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSIGClick(sig.slug);
                }
              }}
              aria-label={`View ${sig.name}`}
            >
              <div className="sig-overview__card-header">
                <h2 className="sig-overview__card-title">{sig.name}</h2>
                <p className="sig-overview__card-description">
                  {sig.description}
                </p>
              </div>

              {sig.tags && sig.tags.length > 0 && (
                <div className="sig-overview__card-tags">
                  {sig.tags.slice(0, 5).map((tag, idx) => (
                    <span key={idx} className="sig-overview__card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="sig-overview__card-footer">
                <span className="sig-overview__card-link">
                  Explore
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 3L11 8L6 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SIGOverview;
