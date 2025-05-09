import React, { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.jobProfile ||
        !formData.companyName ||
        !formData.description
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Add user ID to form data
      const submissionData = {
        ...formData,
        addedBy: user.id,
      };

      const response = await sarcAPI.post(
        "/referral/create",
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
      toast.error(error.message || "Failed to post referral");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-referral-container">
      <h2>Post a Referral</h2>
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
            value={formData.description}
            onChange={handleDescriptionChange}
            modules={modules}
            placeholder="Job description and responsibilities"
          />
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Requirements</label>
          <ReactQuill
            value={formData.requirements}
            onChange={handleRequirementsChange}
            modules={modules}
            placeholder="Required skills and qualifications"
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
          <label htmlFor="website">Company Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
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
