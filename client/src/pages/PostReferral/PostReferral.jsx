import React, { useState } from "react";
// import axios from 'axios';
import axiosInstance from "../../../axios.config";
import "./PostReferral.scss";

import ReferralPosterInfo from "../../SampleData/ReferralPosterInfo";

const PostReferral = () => {
  function convertToUTC(dateStr) {
    const [day, month, year] = dateStr.split("-");
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toUTCString();
  }

  // Get logged in user

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
    deadline: new Date().toISOString().split("T")[0], // Initialize with current date
    website: "",
    email: "",
    contact: "",
    addedBy: [], // Will be filled from logged-in user
    status: "pending",
    // message: '', // Will be filled by admin
    // createdAt: "",
    // updatedAt: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "deadline") {
      try {
        // Only convert to UTC if we have a valid date
        if (value) {
          const utcDate = new Date(value);
          if (!isNaN(utcDate.getTime())) {
            utcDate.setUTCHours(23, 59, 59, 999);
            setFormData((prevState) => ({
              ...prevState,
              [name]: utcDate.toISOString(),
            }));
          }
        } else {
          // If input is cleared, set to empty string or current date
          setFormData((prevState) => ({
            ...prevState,
            [name]: new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error("Invalid date:", error);
        // Keep the previous valid date on error
      }
    } else if (name.includes(".")) {
      // Handle nested objects
      const [parent, child] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const currentDateTime = new Date().toISOString();
      const referralData = {
        ...formData,
        addedBy: ReferralPosterInfo.addedBy, // Add logged in user's ID
        status: "pending", // Default status for new referrals posts
        // createdAt: currentDateTime,
        // updatedAt: currentDateTime
      };

      const response = await axiosInstance.post(
        "/referral/create-referral",
        referralData,
        {
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // If using JWT
          },
        }
      );

      if (response.status === 201) {
        // Show success message
        alert("Referral posted successfully!");
        // Reset form or redirect
      }
    } catch (error) {
      console.error("Error posting referral:", error);
      alert("Failed to post referral. Please try again.");
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
          <label htmlFor="jobProfile">jobProfile*</label>
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
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Job description and responsibilities"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Requirements*</label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            placeholder="Required skills and qualifications"
            rows="3"
          />
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
            <option value="on-site">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Stipend Details */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stipend.amount">Stipend Amount*</label>
            <input
              type="number"
              id="stipend.amount"
              name="stipend.amount"
              value={formData.stipend.amount}
              onChange={handleChange}
              required
              placeholder="e.g. 50000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stipend.currency">Currency*</label>
            <select
              id="stipend.currency"
              name="stipend.currency"
              value={formData.stipend.currency}
              onChange={handleChange}
              required
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* Deadline */}
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline.split("T")[0]} // Display only the date part
          onChange={handleChange} // Restore onChange
          required
          min={new Date().toISOString().split("T")[0]} // Prevent past dates
        />

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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email*</label>
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
            <label htmlFor="contact">Phone Number</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Post Referral
        </button>
      </form>
    </div>
  );
};

export default PostReferral;
