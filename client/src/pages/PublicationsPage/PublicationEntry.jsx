import { useState } from "react";
import PropTypes from "prop-types";
import { FaChevronDown, FaChevronUp, FaBook } from "react-icons/fa";
import "./PublicationEntry.scss";

/**
 * Individual Publication Entry Component
 * Displays a single publication entry with collapsible details
 */
const PublicationEntry = ({ entry, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderAuthors = (authors) => {
    if (!authors || authors.length === 0) return null;

    const authorList = Array.isArray(authors)
      ? authors
      : authors.split(",").map((a) => a.trim());

    return (
      <div className="publication-authors">
        {authorList.map((author, idx) => (
          <span key={idx} className="author-tag">
            {author}
          </span>
        ))}
      </div>
    );
  };

  const renderMetadataGrid = () => {
    const metadata = [];

    if (entry.year) metadata.push({ label: "Year", value: entry.year });
    if (entry.volume) metadata.push({ label: "Volume", value: entry.volume });
    if (entry.issue) metadata.push({ label: "Issue", value: entry.issue });
    if (entry.pages) metadata.push({ label: "Pages", value: entry.pages });
    if (entry.issn) metadata.push({ label: "ISSN", value: entry.issn });
    if (entry.isbn) metadata.push({ label: "ISBN", value: entry.isbn });

    if (metadata.length === 0) return null;

    return (
      <div className="metadata-grid">
        {metadata.map((item, idx) => (
          <div key={idx} className="metadata-item">
            <span className="metadata-label">{item.label}</span>
            <span className="metadata-value">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCollapsibleDetails = () => {
    const hasDetails =
      entry.publicationType || entry.publisherName || entry.description;

    if (!hasDetails || !isExpanded) return null;

    return (
      <div className="collapsible-details">
        {entry.publicationType && (
          <div className="detail-row">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{entry.publicationType}</span>
          </div>
        )}
        {entry.publisherName && (
          <div className="detail-row">
            <span className="detail-label">Publisher:</span>
            <span className="detail-value">{entry.publisherName}</span>
          </div>
        )}
        {entry.description && (
          <div className="detail-description">
            <p>{entry.description}</p>
          </div>
        )}
      </div>
    );
  };

  const hasCollapsibleContent =
    entry.publicationType || entry.publisherName || entry.description;

  return (
    <div className="publication-entry">
      <div className="entry-header">
        <div className="entry-number">
          <FaBook />
          <span>{index}</span>
        </div>
        <div className="entry-title-section">
          <h3 className="entry-title">
            {entry.title || "Untitled Publication"}
          </h3>
          {renderAuthors(entry.authors)}
        </div>
        {hasCollapsibleContent && (
          <button
            className="toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      {renderMetadataGrid()}
      {renderCollapsibleDetails()}
    </div>
  );
};

PublicationEntry.propTypes = {
  entry: PropTypes.shape({
    title: PropTypes.string,
    authors: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    year: PropTypes.number,
    volume: PropTypes.string,
    issue: PropTypes.string,
    pages: PropTypes.string,
    issn: PropTypes.string,
    isbn: PropTypes.string,
    publicationType: PropTypes.string,
    publisherName: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default PublicationEntry;
