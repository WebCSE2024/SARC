import { useState, useEffect } from "react";
import "./PublicationsCard.scss";
import {
  FaEnvelope,
  FaFilePdf,
  FaUserEdit,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import defaultProfile from "../../../public/NoProfileImg.png";
import { Document, Page, pdfjs } from "react-pdf";
import PropTypes from "prop-types";

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PublicationsCard = ({ data }) => {
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Determine how many preview pages to show (default to 1 if not specified)
  const previewPagesCount = data?.previewPages || 1;

  useEffect(() => {
    if (data?.publicationURL) {
      const url = data.publicationURL;

      // This function checks if the URL is a Google Drive or OneDrive link and formats it properly
      const formatExternalPdfUrl = (url) => {
        if (url.includes("drive.google.com")) {
          // Convert Google Drive view URL to direct download
          if (url.includes("/view")) {
            return url.replace("/view", "/preview");
          } else if (url.includes("id=")) {
            const fileId = new URLSearchParams(url.split("?")[1]).get("id");
            return `https://drive.google.com/file/d/${fileId}/preview`;
          }
        } else if (url.includes("onedrive.live.com")) {
          // Format OneDrive URL for embedding
          return url.replace("view.aspx", "embed");
        }
        // Return the original URL if it's not a recognized cloud storage link
        return url;
      };

      setPdfUrl(formatExternalPdfUrl(url));
      setLoading(false);
    } else {
      setError("No publication URL available");
      setLoading(false);
    }
  }, [data]);

  const handleContactClick = () => {
    if (user?.email) {
      window.location.href = `mailto:${user.email}`;
    } else {
      toast.error("Contact information not available");
    }
  };

  const handleOpenFullPdf = () => {
    if (pdfUrl) {
      window.open(data.publicationURL, "_blank");
    } else {
      toast.error("PDF URL not available");
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const renderPreview = () => {
    if (loading) {
      return <div className="loading-preview">Loading preview...</div>;
    }

    if (error) {
      return <div className="error-preview">{error}</div>;
    }

    if (!pdfUrl) {
      return <div className="no-preview">Preview not available</div>;
    }

    // If the URL is for Google Drive or OneDrive, use iframe
    if (
      pdfUrl.includes("drive.google.com") ||
      pdfUrl.includes("onedrive.live.com")
    ) {
      return (
        <div className="iframe-container">
          <iframe
            src={pdfUrl}
            title="Publication Preview"
            className="pdf-iframe"
            allowFullScreen
          />
        </div>
      );
    }

    // Otherwise, use react-pdf for local or direct PDF URLs
    return (
      <div className="pdf-container">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => setError("Failed to load PDF")}
          loading={<div className="loading-pdf">Loading PDF...</div>}
          error={<div className="error-pdf">Could not load PDF</div>}
        >
          {Array.from(
            new Array(Math.min(previewPagesCount, numPages || 1)),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={300}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            )
          )}
        </Document>
        {numPages && previewPagesCount < numPages && (
          <div className="preview-info">
            Showing {previewPagesCount} of {numPages} pages
          </div>
        )}
      </div>
    );
  };

  const [showDetails, setShowDetails] = useState(false);

  const renderAuthors = (entries) => {
    if (!entries || entries.length === 0) return [];
    if (Array.isArray(entries)) {
      return entries
        .map((entry) => {
          if (typeof entry === "string") return entry;
          return entry.name || entry.author || entry;
        })
        .filter(Boolean);
    }
    if (typeof entries === "string") {
      return entries
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }
    return [];
  };

  const getEssentialFields = () => {
    const fields = [];
    if (data.year) fields.push({ label: "Year", value: data.year });
    if (data.volume) fields.push({ label: "Volume", value: data.volume });
    if (data.issue) fields.push({ label: "Issue", value: data.issue });
    if (data.pages) fields.push({ label: "Pages", value: data.pages });
    if (data.issn) fields.push({ label: "ISSN", value: data.issn });
    if (data.isbn) fields.push({ label: "ISBN", value: data.isbn });
    return fields;
  };

  const getTechnicalDetails = () => {
    const details = [];
    if (data.publicationType)
      details.push({ label: "Type", value: data.publicationType });
    if (data.publisherName)
      details.push({ label: "Publisher", value: data.publisherName });
    return details;
  };

  const authors = renderAuthors(data.authors);
  const essentialFields = getEssentialFields();
  const technicalDetails = getTechnicalDetails();
  const hasCollapsibleContent = technicalDetails.length > 0 || data.description;

  return (
    <div className="PublicationsCard">
      {/* Header with Title and Toggle */}
      <div className="card-header">
        <h3 className="title">{data.title || "Untitled Publication"}</h3>
        {hasCollapsibleContent && (
          <button
            className="toggle-details-btn"
            onClick={() => setShowDetails(!showDetails)}
            title={showDetails ? "Hide details" : "Show details"}
          >
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      {/* Authors */}
      {authors.length > 0 && (
        <div className="authors-section">
          <div className="section-label">
            <FaUserEdit className="label-icon" />
            Authors
          </div>
          <div className="authors-list">
            {authors.map((author, idx) => (
              <span key={idx} className="author-tag">
                {author}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Essential Fields - Always Visible */}
      {essentialFields.length > 0 && (
        <div className="essential-fields">
          <div className="fields-grid">
            {essentialFields.map((field, idx) => (
              <div key={idx} className="field-item">
                <span className="field-label">{field.label}</span>
                <span className="field-value">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Content - Technical Details & Description */}
      {showDetails && hasCollapsibleContent && (
        <div className="collapsible-content">
          {/* Technical Details */}
          {technicalDetails.length > 0 && (
            <div className="technical-details">
              {technicalDetails.map((detail, idx) => (
                <div key={idx} className="detail-item">
                  <span className="detail-label">{detail.label}</span>
                  <span className="detail-value">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div className="description-box">
              <p className="description-text">{data.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Preview Section */}
      <div className="preview-section">
        {renderPreview()}

        <div className="preview-actions">
          <button className="view-full-btn" onClick={handleOpenFullPdf}>
            <FaFilePdf /> View Full Publication
          </button>
        </div>
      </div>

      {/* Author Contact */}
      <div className="author-section">
        <img
          src={user?.profilePicture?.url || defaultProfile}
          alt="Author"
          className="author-pic"
        />
        <div className="author-details">
          <div className="name">
            {user?.name || "Unknown Author"}
            <p className="designation">{user?.userType || "Author"}</p>
          </div>
          <button className="contact-btn" onClick={handleContactClick}>
            <FaEnvelope /> Contact Author
          </button>
        </div>
      </div>

      <p className="publication-note">
        Kindly contact the author for access to full publication.
      </p>
    </div>
  );
};

PublicationsCard.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    publicationURL: PropTypes.string,
    previewPages: PropTypes.number,
  }).isRequired,
};

export default PublicationsCard;
