import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios.config";
import "./PostPublication.scss";

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

  // Check if user is authorized
  if (!user || user.userType !== "PROFESSOR") {
    navigate("/profile");
    return null;
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "previewPages" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append("file", formData.file);
      uploadData.append("title", formData.title);
      uploadData.append("previewPages", formData.previewPages);
      uploadData.append("uploaderId", user.id);

      // Upload to backend
      const response = await axiosInstance.post(
        "/publication/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Publication uploaded successfully");
        navigate("/publications");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload publication");
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
          />
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
          />
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
