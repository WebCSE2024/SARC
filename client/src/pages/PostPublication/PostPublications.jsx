import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios.config.js";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./PostPublications.scss";
import { Document, Page, pdfjs } from "react-pdf";

// Setup PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PostPublications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    previewPages: 3, // Default value
    publication_pdf: null,
  });

  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [numPages, setNumPages] = useState(null);

  // Check if user is authorized to access this page
  useEffect(() => {
    if (user && user.userType !== "PROFESSOR") {
      toast.error("Only professors can post publications");
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "previewPages" ? parseInt(value) || 1 : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        if (file.size > 10 * 1024 * 1024) {
          // 10MB max
          setError("File size should not exceed 10MB");
          e.target.value = ""; // Reset file input
          return;
        }

        setFormData((prevState) => ({
          ...prevState,
          publication_pdf: file,
        }));
        setFileName(file.name);
        setPdfPreview(URL.createObjectURL(file));
        setError(null);
      } else {
        setError("Please upload a PDF file");
        e.target.value = ""; // Reset file input
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);

    // Limit previewPages to the actual number of pages in the PDF
    if (formData.previewPages > numPages) {
      setFormData((prev) => ({
        ...prev,
        previewPages: numPages,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Form validation
    if (!formData.title.trim()) {
      setError("Please enter a publication title");
      setIsSubmitting(false);
      return;
    }

    if (!formData.publication_pdf) {
      setError("Please select a PDF file");
      setIsSubmitting(false);
      return;
    }

    if (formData.previewPages < 1 || formData.previewPages > 10) {
      setError("Preview pages must be between 1 and 10");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData to send
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("previewPages", formData.previewPages);
      formDataToSend.append("file", formData.publication_pdf);

      const response = await axiosInstance.post(
        "/publication/create-publication",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success
      if (response.status === 201 || response.status === 200) {
        // Clean up
        if (pdfPreview) {
          URL.revokeObjectURL(pdfPreview);
        }

        setFormData({
          title: "",
          previewPages: 3,
          publication_pdf: null,
        });
        setFileName("");
        setPdfPreview(null);

        toast.success("Publication posted successfully!");
        navigate("/publications");
        return;
      }

      throw new Error("Failed to create publication");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to post publication. Please try again."
      );
      setError(
        err.response?.data?.message ||
          "Failed to post publication. Make sure you are logged in as a professor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Clean up
    if (pdfPreview) {
      URL.revokeObjectURL(pdfPreview);
    }
    navigate("/profile");
  };

  if (user && user.userType !== "PROFESSOR") {
    return null; // Prevents flash of content before redirect
  }

  return (
    <div className="post-publication-container">
      <h2>Post Research Publication</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="publication-form">
        <div className="form-group">
          <label htmlFor="title">Paper Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter research paper title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="previewPages">Number of Preview Pages*</label>
          <input
            type="number"
            id="previewPages"
            name="previewPages"
            min="1"
            max={numPages || 10}
            value={formData.previewPages}
            onChange={handleChange}
            required
          />
          <small className="form-text">
            Select how many pages should be available for preview (1-10)
          </small>
        </div>

        <div className="file-upload-group">
          <label htmlFor="pdfFile">Upload PDF*</label>
          <div className="upload-area">
            <input
              type="file"
              id="pdfFile"
              name="publication_pdf"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              required
            />
            <div className="upload-placeholder">
              <FaCloudUploadAlt className="upload-icon" />
              <p>{fileName || "Drag & Drop PDF here or click to browse"}</p>
            </div>
          </div>
          <small className="form-text">Maximum file size: 10MB</small>
        </div>

        {pdfPreview && (
          <div className="pdf-preview">
            <h3>PDF Preview</h3>
            <div className="pdf-container">
              <Document
                file={pdfPreview}
                onLoadSuccess={onDocumentLoadSuccess}
                loading="Loading PDF preview..."
                error="Failed to load PDF preview"
              >
                {Array.from(
                  new Array(Math.min(formData.previewPages, numPages || 0)),
                  (_, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={250}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  )
                )}
              </Document>
            </div>
            <p className="preview-note">
              Only the first {formData.previewPages} page
              {formData.previewPages > 1 ? "s" : ""} will be available as
              preview
            </p>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Publication"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostPublications;
