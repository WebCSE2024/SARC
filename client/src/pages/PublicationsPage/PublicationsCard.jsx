import { useState, useEffect } from "react";
import "./PublicationsCard.scss";
import { FaEnvelope, FaFilePdf } from "react-icons/fa";
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

  return (
    <div className="PublicationsCard">
      <div className="title-save">
        <h3 className="title">{data.title}</h3>
      </div>

      <div className="preview-section">
        {renderPreview()}

        <div className="preview-actions">
          <button className="view-full-btn" onClick={handleOpenFullPdf}>
            <FaFilePdf /> View Full Publication
          </button>
        </div>
      </div>

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
