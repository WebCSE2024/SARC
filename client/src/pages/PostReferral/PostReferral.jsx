import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostReferral.scss";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";

const PostReferral = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    jobProfile: "",
    companyName: "",
    description: "",
    requirements: "",
    location: {
      city: "",
      country: "",
    },
    mode: "",
    stipend: {
      amount: "",
      currency: "INR",
    },
    deadline: new Date().toISOString().split("T")[0],
    website: "",
    email: "",
    contact: "",
    status: "active",
  });

  // Enhanced Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  // Define formats for the Quill editor
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
    "blockquote",
    "code-block",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error for this field when user makes changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      description: content,
    }));

    // Clear error when content changes
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleRequirementsChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      requirements: content,
    }));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.jobProfile.trim()) {
      newErrors.jobProfile = "Job profile is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    // Validate rich text content by removing HTML tags and checking if there's text content
    const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").trim();

    if (!stripHtml(formData.description)) {
      newErrors.description = "Description is required";
    }

    if (!formData.mode) {
      newErrors.mode = "Work mode is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Application deadline is required";
    }

    if (!formData.email) {
      newErrors.email = "Contact email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Website format validation (if provided)
    if (formData.website && !/^https?:\/\/\S+\.\S+/.test(formData.website)) {
      newErrors.website =
        "Invalid website URL format (should start with http:// or https://)";
    }

    // Phone number validation (if provided)
    if (formData.contact && !/^[+]?[\d\s()-]{7,20}$/.test(formData.contact)) {
      newErrors.contact = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    // Check if user is authenticated and has a valid ID
    if (!user || !user.id) {
      toast.error("You must be logged in to post a referral");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Create a clean copy of form data without the user ID initially
      const submissionData = { ...formData };

      // Validate user ID format (MongoDB ObjectId is 24 hex characters)
      if (user.id && /^[0-9a-fA-F]{24}$/.test(user.id)) {
        submissionData.addedBy = user.id;
      } else if (user._id && /^[0-9a-fA-F]{24}$/.test(user._id)) {
        // Try alternate _id field if id is not valid
        submissionData.addedBy = user._id;
      } else {
        // If no valid ID is found, log this but continue without it
        // The server should handle this case (either reject or use session info)
        console.warn("No valid user ID found for addedBy field");
      }

      const response = await sarcAPI.post(
        "sarc/v0/referral/create",
        submissionData
      );

      if (response.data.success) {
        toast.success("Referral posted successfully");
        navigate("/referrals");
      } else {
        throw new Error(response.data.message || "Failed to post referral");
      }
    } catch (error) {
      console.error("Error posting referral:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to post referral"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to the first error when validation fails
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [errors]);

  return (
    <div className="post-referral-container">
      <h2>Post a Referral</h2>
      <form onSubmit={handleSubmit} className="referral-form">
        {/* Company Details */}
        <div className={`form-group ${errors.companyName ? "has-error" : ""}`}>
          <label htmlFor="companyName">Company Name*</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            placeholder="e.g. Google"
          />
          {errors.companyName && (
            <span className="error-message">{errors.companyName}</span>
          )}
        </div>

        <div className={`form-group ${errors.jobProfile ? "has-error" : ""}`}>
          <label htmlFor="jobProfile">Job Profile*</label>
          <input
            type="text"
            id="jobProfile"
            name="jobProfile"
            value={formData.jobProfile}
            onChange={handleChange}
            required
            placeholder="e.g. Software Engineer"
          />
          {errors.jobProfile && (
            <span className="error-message">{errors.jobProfile}</span>
          )}
        </div>

        {/* Description and Requirements */}
        <div className={`form-group ${errors.description ? "has-error" : ""}`}>
          <label htmlFor="description">Description*</label>
          <ReactQuill
            id="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            modules={modules}
            formats={formats}
            placeholder="Job description and responsibilities"
            className="rich-text-editor"
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Requirements</label>
          <ReactQuill
            id="requirements"
            value={formData.requirements}
            onChange={handleRequirementsChange}
            modules={modules}
            formats={formats}
            placeholder="Required skills and qualifications"
            className="rich-text-editor"
          />
        </div>

        {/* Location and Mode */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location.city">City</label>
            <input
              type="text"
              id="location.city"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              placeholder="e.g. Bangalore"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location.country">Country</label>
            <input
              type="text"
              id="location.country"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              placeholder="e.g. India"
            />
          </div>
        </div>

        <div className={`form-group ${errors.mode ? "has-error" : ""}`}>
          <label htmlFor="mode">Work Mode*</label>
          <select
            id="mode"
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
          >
            <option value="">Select work mode</option>
            <option value="onsite">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {errors.mode && <span className="error-message">{errors.mode}</span>}
        </div>

        {/* Stipend */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stipend.amount">Stipend Amount</label>
            <input
              type="number"
              id="stipend.amount"
              name="stipend.amount"
              value={formData.stipend.amount}
              onChange={handleChange}
              placeholder="e.g. 50000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stipend.currency">Currency</label>
            <select
              id="stipend.currency"
              name="stipend.currency"
              value={formData.stipend.currency}
              onChange={handleChange}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Deadline */}
        <div className={`form-group ${errors.deadline ? "has-error" : ""}`}>
          <label htmlFor="deadline">Application Deadline*</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.deadline && (
            <span className="error-message">{errors.deadline}</span>
          )}
        </div>

        {/* Contact Information */}
        <div className={`form-group ${errors.website ? "has-error" : ""}`}>
          <label htmlFor="website">Company Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://company.com"
          />
          {errors.website && (
            <span className="error-message">{errors.website}</span>
          )}
        </div>

        <div className={`form-group ${errors.email ? "has-error" : ""}`}>
          <label htmlFor="email">Contact Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="contact@company.com"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className={`form-group ${errors.contact ? "has-error" : ""}`}>
          <label htmlFor="contact">Contact Number</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="+91 1234567890"
          />
          {errors.contact && (
            <span className="error-message">{errors.contact}</span>
          )}
        </div>

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
            {loading ? "Posting..." : "Post Referral"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostReferral;
