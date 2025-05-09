import React, { useState } from "react";
import "./PostPublications.scss";
import { FaCloudUploadAlt } from "react-icons/fa";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";

const PostPublications = () => {
  const [formData, setFormData] = useState({
    title: "",
    publication_pdf: null,
  });

  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setFormData((prevState) => ({
          ...prevState,
          publication_pdf: file,
        }));
        setFileName(file.name);
        setError(null);
      } else {
        setError("Please upload a PDF file");
        e.target.value = ""; // Reset file input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.publication_pdf) {
      setError("Please select a PDF file");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = formData;
      // const formDataToSend = new FormData();
      // formDataToSend.append('title', formData.title);
      // formDataToSend.append('file', formData.publication_pdf);

      // Log the data properly
      console.log("Form Data Contents:");
      console.log(formDataToSend);
      // for (let pair of formDataToSend.entries()) {
      //     console.log(pair[0] + ': ' + pair[1]);
      // }

      const response = await sarcAPI.post(
        "/publication/create-publication",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check response status and data
      if (response.status === 201 || response.status === 200) {
        // Handle both success codes
        setFormData({
          title: "",
          publication_pdf: null,
        });
        setFileName("");
        alert("Publication posted successfully!");
        setIsSubmitting(false);
        return;
      }

      throw new Error("Failed to create publication");
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to post publication. Make sure you are logged in as a professor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Publication"}
        </button>
      </form>
    </div>
  );
};

export default PostPublications;
