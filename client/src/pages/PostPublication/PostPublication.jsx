import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import "./PostPublication.scss";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";
import { PDFDocument } from "pdf-lib";

const PostPublication = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    previewPages: 3,
    file: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [fileError, setFileError] = useState("");

  // Check if user is authorized - route protection
  useEffect(() => {
    if (!user || user.userType !== "PROFESSOR") {
      toast.error("Only professors can post publications");
      navigate("/profile");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous error
    setFileError("");

    // Validate file type
    if (file.type !== "application/pdf") {
      setFileError("Please upload a PDF file");
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size should be less than 10MB");
      toast.error("File size should be less than 10MB");
      return;
    }

    setFormData((prev) => ({ ...prev, file }));

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setTitleError("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "previewPages" ? parseInt(value) || 0 : value,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.title.trim()) {
      setTitleError("Publication title is required");
      isValid = false;
    }

    if (!formData.file) {
      setFileError("PDF file is required");
      isValid = false;
    }

    if (formData.previewPages < 1 || formData.previewPages > 10) {
      toast.error("Preview pages should be between 1 and 10");
      isValid = false;
    }

    return isValid;
  };

  const extractPreviewPages = async (pdfFile, pageCount) => {
    try {
      // Read the file
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Limit preview pages to the actual number of pages in the document
      const totalPages = pdfDoc.getPageCount();
      const pagesToExtract = Math.min(pageCount, totalPages);

      // Create a new document for the preview
      const previewDoc = await PDFDocument.create();

      // Copy the first n pages to the preview document
      for (let i = 0; i < pagesToExtract; i++) {
        const [copiedPage] = await previewDoc.copyPages(pdfDoc, [i]);
        previewDoc.addPage(copiedPage);
      }

      // Serialize the preview document to a Uint8Array
      const previewPdfBytes = await previewDoc.save();

      // Convert to blob for upload
      return new Blob([previewPdfBytes], { type: "application/pdf" });
    } catch (error) {
      console.error("Error extracting preview pages:", error);
      throw new Error("Failed to extract preview pages");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Extract preview pages
      const previewPdfBlob = await extractPreviewPages(
        formData.file,
        formData.previewPages
      );

      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append("publication_pdf", previewPdfBlob);
      uploadData.append("title", formData.title);
      uploadData.append("previewPages", formData.previewPages);

      // Upload to backend
      const response = await sarcAPI.post(
        "sarc/v0/publication/create-publication",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          validateStatus: () => true, // Accept all status codes to handle errors locally
        }
      );

      if (response.data.status === 200) {
        toast.success("Publication uploaded successfully");
        navigate("/publications");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);

      // Don't let API errors affect authentication
      if (error.response?.status === 401) {
        toast.error(
          "Authentication error. Please try again without logging out."
        );
      } else {
        toast.error(error.message || "Failed to upload publication");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-publication-container">
      <h2>Post a Publication</h2>
      <form onSubmit={handleSubmit} className="publication-form">
        <div className="form-group">
          <label htmlFor="title">Publication Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter publication title"
            className={titleError ? "error" : ""}
          />
          {titleError && <span className="error-message">{titleError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="previewPages">Number of Preview Pages*</label>
          <input
            type="number"
            id="previewPages"
            name="previewPages"
            value={formData.previewPages}
            onChange={handleInputChange}
            min="1"
            max="10"
            required
          />
          <small>
            Select how many pages should be available for preview (1-10)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="file">PDF File*</label>
          <input
            type="file"
            id="file"
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            required
            className={fileError ? "error" : ""}
          />
          {fileError && <span className="error-message">{fileError}</span>}
          <small>Upload a PDF file (max 10MB)</small>
        </div>

        {previewUrl && (
          <div className="preview-section">
            <h3>File Preview</h3>
            <iframe
              src={previewUrl}
              title="PDF Preview"
              width="100%"
              height="400px"
            />
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/profile")}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "Upload Publication"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostPublication;
