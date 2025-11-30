import { useState } from "react";
import PropTypes from "prop-types";
import {
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaBook,
  FaFileAlt,
  FaBuilding,
  FaInfoCircle,
} from "react-icons/fa";
import "./PublicationEntry.scss";

/**
 * Individual Publication Entry Component
 * Displays a single publication entry with elegant card design
 */
const PublicationEntry = ({ entry, professorInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderAuthors = (authors) => {
    if (!authors || authors.length === 0) return null;

    const authorList = Array.isArray(authors)
      ? authors
      : authors.split(",").map((a) => a.trim());

    return authorList.join(", ");
  };

  // Only show "More Details" if publisherName or description exists
  const hasExpandableContent = entry.publisherName || entry.description;

  const getPublicationTypeConfig = (type) => {
    const typeLower = (type || "").toLowerCase();
    if (typeLower.includes("journal")) {
      return {
        bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
        color: "#166534",
        border: "#86efac",
        label: "Journal",
        icon: FaBook,
      };
    }
    if (typeLower.includes("conference")) {
      return {
        bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
        color: "#1e40af",
        border: "#93c5fd",
        label: "Conference",
        icon: FaFileAlt,
      };
    }
    if (typeLower.includes("book")) {
      return {
        bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        color: "#92400e",
        border: "#fcd34d",
        label: "Book",
        icon: FaBook,
      };
    }
    if (typeLower.includes("patent")) {
      return {
        bg: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
        color: "#7c3aed",
        border: "#c4b5fd",
        label: "Patent",
        icon: FaFileAlt,
      };
    }
    return {
      bg: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      color: "#374151",
      border: "#d1d5db",
      label: type || "Publication",
      icon: FaFileAlt,
    };
  };

  const typeConfig = getPublicationTypeConfig(entry.publicationType);
  const TypeIcon = typeConfig.icon;

  const handlePublisherClick = () => {
    if (entry.publicationURL) {
      window.open(entry.publicationURL, "_blank", "noopener,noreferrer");
    }
  };

  const handleContactClick = () => {
    if (professorInfo?.email) {
      window.location.href = `mailto:${professorInfo.email}?subject=Inquiry about: ${entry.title}`;
    }
  };

  // Build metadata items that should be shown normally (not in expanded section)
  const getMetadataItems = () => {
    const items = [];
    if (entry.volume) items.push({ label: "Volume", value: entry.volume });
    if (entry.issue) items.push({ label: "Issue", value: entry.issue });
    if (entry.pages) items.push({ label: "Pages", value: entry.pages });
    if (entry.issn) items.push({ label: "ISSN", value: entry.issn });
    if (entry.isbn) items.push({ label: "ISBN", value: entry.isbn });
    return items;
  };

  const metadataItems = getMetadataItems();

  return (
    <article className={`publication-entry ${isExpanded ? "expanded" : ""}`}>
      {/* Left Accent Bar */}
      <div
        className="accent-bar"
        style={{ background: typeConfig.bg }}
        aria-hidden="true"
      />

      <div className="entry-body">
        {/* Header Section */}
        <header className="entry-header">
          <div className="header-top">
            {/* Year Badge */}
            {entry.year && (
              <div className="year-badge">
                <FaCalendarAlt className="year-icon" />
                <span>{entry.year}</span>
              </div>
            )}

            {/* Tags */}
            <div className="tags-container">
              {entry.publicationType && (
                <span
                  className="tag type-tag"
                  style={{
                    background: typeConfig.bg,
                    color: typeConfig.color,
                    borderColor: typeConfig.border,
                  }}
                >
                  <TypeIcon className="tag-icon" />
                  {typeConfig.label}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="entry-title">
            {entry.title || "Untitled Publication"}
          </h3>

          {/* Authors */}
          {entry.authors && (
            <p className="entry-authors">{renderAuthors(entry.authors)}</p>
          )}
        </header>

        {/* Content Section */}
        <div className="entry-content">
          {/* Metadata Items - shown normally */}
          {metadataItems.length > 0 && (
            <div className="metadata-inline">
              {metadataItems.map((item, idx) => (
                <span key={idx} className="metadata-chip">
                  <span className="chip-label">{item.label}:</span>
                  <span className="chip-value">{item.value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Expanded Content - Publisher Name and Description */}
          {isExpanded && hasExpandableContent && (
            <div className="expanded-details">
              {entry.publisherName && (
                <div className="detail-item publisher-detail">
                  <div className="detail-header">
                    <FaBuilding className="detail-icon" />
                    <span className="detail-label">Publisher</span>
                  </div>
                  <p className="detail-text">{entry.publisherName}</p>
                </div>
              )}
              {entry.description && (
                <div className="detail-item description-detail">
                  <div className="detail-header">
                    <FaInfoCircle className="detail-icon" />
                    <span className="detail-label">Description</span>
                  </div>
                  <p className="detail-text">{entry.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <footer className="entry-footer">
          <div className="action-buttons">
            {entry.publicationURL && (
              <button
                className="action-btn publisher-btn"
                onClick={handlePublisherClick}
                title="View at Publisher"
              >
                <FaExternalLinkAlt className="btn-icon" />
                <span className="btn-label">View Publication</span>
              </button>
            )}
            {professorInfo?.email && (
              <button
                className="action-btn contact-btn"
                onClick={handleContactClick}
                title="Contact Author"
              >
                <FaEnvelope className="btn-icon" />
                <span className="btn-label">Contact</span>
              </button>
            )}
          </div>

          {/* Expand/Collapse Toggle */}
          {hasExpandableContent && (
            <button
              className="expand-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={
                isExpanded ? "Show less details" : "Show more details"
              }
            >
              <span className="toggle-text">
                {isExpanded ? "Less details" : "More details"}
              </span>
              {isExpanded ? (
                <FaChevronUp className="toggle-icon" />
              ) : (
                <FaChevronDown className="toggle-icon" />
              )}
            </button>
          )}
        </footer>
      </div>
    </article>
  );
};

PublicationEntry.propTypes = {
  entry: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    authors: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    publicationType: PropTypes.string,
    publisherName: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    volume: PropTypes.string,
    issue: PropTypes.string,
    pages: PropTypes.string,
    issn: PropTypes.string,
    isbn: PropTypes.string,
    description: PropTypes.string,
    publicationURL: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
  professorInfo: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default PublicationEntry;
