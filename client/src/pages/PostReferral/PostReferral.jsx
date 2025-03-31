import React, { useState } from 'react';
// import axios from 'axios';
import axiosInstance from '../../../axios.config';
import './PostReferral.scss';

const PostReferral = () => {
// Get logged in user

    const [formData, setFormData] = useState({
        role: '',
        companyName: '',
        description: '',
        requirements: '',
        location: {
            city: '',
            country: ''
        },
        mode: '',
        stipend: {
            amount: '',
            currency: 'INR'
        },
        deadline: '',
        website: '',
        email: '',
        contact: '',
        addedBy: '', // Will be filled from logged-in user
        status: 'pending',
        message: '' // Will be filled by admin
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle nested objects
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const referralData = {
                ...formData,
                addedBy: "randomID", // Add logged in user's ID
                status: 'pending', // Default status for new referrals posts
            };

            const response = await axiosInstance.post('/create-referral', referralData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // If using JWT
                }
            });

            if (response.status === 201) {
                // Show success message
                alert('Referral posted successfully!');
                // Reset form or redirect
            }
        } catch (error) {
            console.error('Error posting referral:', error);
            alert('Failed to post referral. Please try again.');
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
                    <label htmlFor="role">Role*</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
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
                <div className="form-group">
                    <label htmlFor="deadline">Application Deadline*</label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
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