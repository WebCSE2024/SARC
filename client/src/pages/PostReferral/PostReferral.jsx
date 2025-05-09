import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios.config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostReferral.scss";

const PostReferral = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    jobProfile: "",
    companyName: "",
    description: "",
    requirements: "",
    location: {
      city: "",
      country: "",
    },
    mode: "remote",
    stipend: {
      amount: "",
      currency: "INR",
    },
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Default to 7 days from now
    website: "",
    email: "",
    contact: "",
  });

  // Check if user is authorized to access this page
  useEffect(() => {
    if (user && user.userType !== "PROFESSOR" && user.userType !== "ALUMNI") {
      toast.error("Only professors and alumni can post referrals");
      navigate("/profile");
    }
  }, [user, navigate]);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
  };

  const handleRequirementsChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      requirements: content,
    }));
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError("Company name is required");
      return false;
    }
    if (!formData.jobProfile.trim()) {
      setError("Job profile is required");
      return false;
    }
    if (
      !formData.description.trim() ||
      formData.description === "<p><br></p>"
    ) {
      setError("Description is required");
      return false;
    }
    if (
      !formData.requirements.trim() ||
      formData.requirements === "<p><br></p>"
    ) {
      setError("Requirements are required");
      return false;
    }
    if (!formData.location.city.trim() || !formData.location.country.trim()) {
      setError("Complete location information is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Contact email is required");
      return false;
    }
    if (!formData.website.trim()) {
      setError("Company website is required");
      return false;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    // Validate website URL format
    try {
      new URL(formData.website);
    } catch (err) {
      setError(
        "Please enter a valid website URL (include http:// or https://)"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      toast.error(error || "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/referral/create-referral",
        formData
      );

      if (
        response.data &&
        response.data.status >= 200 &&
        response.data.status < 300
      ) {
        toast.success("Referral posted successfully!");
        navigate("/referrals");
      } else {
        throw new Error(response.data.message || "Failed to post referral");
      }
    } catch (error) {
      console.error("Error posting referral:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to post referral. Please try again."
      );
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to post referral"
      );
    } finally {
      setLoading(false);
    }
  };

  if (user && user.userType !== "PROFESSOR" && user.userType !== "ALUMNI") {
    return null; // Prevents flash of content before redirect
  }

  return (
    <div className="post-referral-container">
      <h2>Post a Referral</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="referral-form">
        {/* Company Details */}
        <div className="form-group">
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
        </div>

        <div className="form-group">
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
        </div>

        {/* Description and Requirements */}
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <ReactQuill
            id="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            modules={modules}
            placeholder="Job description and responsibilities"
          />
          <small className="form-text">
            Provide detailed information about the job role and responsibilities
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Requirements*</label>
          <ReactQuill
            id="requirements"
            value={formData.requirements}
            onChange={handleRequirementsChange}
            modules={modules}
            placeholder="Required skills and qualifications"
          />
          <small className="form-text">
            List the required skills, qualifications, and experience
          </small>
        </div>

        {/* Location and Mode */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location.city">City*</label>
            <input
              type="text"
              id="location.city"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              required
              placeholder="e.g. Bangalore"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location.country">Country*</label>
            <input
              type="text"
              id="location.country"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              required
              placeholder="e.g. India"
            />
          </div>
        </div>

        <div className="form-group">
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
              min="0"
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
              <option value="GBP">GBP</option>
              <option value="SGD">SGD</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>

        {/* Deadline */}
        <div className="form-group">
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
        </div>

        {/* Contact Information */}
        <div className="form-group">
          <label htmlFor="website">Company Website*</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
            placeholder="https://company.com"
          />
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Number</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="+91 1234567890"
          />
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
