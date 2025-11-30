import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProfessorCard, ProjectCard } from "../../components/SIGCards";
import {
  fetchSIGById,
  fetchProfessorsBySIG,
  fetchProjectsBySIG,
} from "../../utils/sigDataUtils";
import { getSIGBySlug } from "../../constants/sig.constants";
import BackgroundMedia from "../../components/BackgroundMedia";
import "./SIGDetail.scss";

const SIGDetail = () => {
  const { domain } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("professors");
  const [sigData, setSigData] = useState(null);
  const [sigConfig, setSigConfig] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSIGData = async () => {
      if (!domain) return;

      setLoading(true);
      setError(null);

      const config = getSIGBySlug(domain);
      if (!config) {
        setError("Invalid SIG domain");
        setLoading(false);
        return;
      }
      setSigConfig(config);

      try {
        const [sigResponse, professorsResponse, projectsResponse] =
          await Promise.all([
            fetchSIGById(domain),
            fetchProfessorsBySIG(domain),
            fetchProjectsBySIG(domain),
          ]);

        setSigData(sigResponse.data);
        setProfessors(professorsResponse.professors || []);
        setProjects(projectsResponse.data || []);
      } catch (err) {
        console.error("Error loading SIG data:", err);
        setError("Failed to load SIG data");
      } finally {
        setLoading(false);
      }
    };

    loadSIGData();
  }, [domain]);

  if (loading) {
    return (
      <div className="sig-detail__loading container">
        <div className="loading-spinner" />
        <p>Loading SIG details...</p>
      </div>
    );
  }

  if (error || !sigConfig || !sigData) {
    return (
      <div className="sig-detail__error container">
        <h1>SIG Not Found</h1>
        <p>{error || "The requested Special Interest Group does not exist."}</p>
        <button onClick={() => navigate("/sig")} className="btn primary">
          Back to SIGs
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeView) {
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

      case "projects":
        return (
          <div className="sig-detail__grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            ) : (
              <p className="sig-detail__empty">No projects available yet.</p>
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

          <h1 className="sig-detail__title">{sigData.name}</h1>
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
              activeView === "projects" ? "is-active" : ""
            }`}
            onClick={() => setActiveView("projects")}
            role="tab"
            aria-selected={activeView === "projects"}
            aria-controls="projects-panel"
          >
            Projects
            <span className="sig-detail__tab-count">{projects.length}</span>
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
