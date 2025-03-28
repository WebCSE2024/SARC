import React, { useState } from 'react';
import './PostReferral.scss';

const PostReferral = () => {
    const [formData, setFormData] = useState({
        role: '',
        description: '',
        requirements: '',
        location: '',
        stipend: '',
        companyWebsite: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <div className="post-referral-container">
            <h2>Post a Referral</h2>
            <form onSubmit={handleSubmit} className="referral-form">
                <div className="form-group">
                    <label htmlFor="role">Role</label>
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

                <div className="form-group">
                    <label htmlFor="description">Description</label>
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
                    <label htmlFor="requirements">Requirements</label>
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

                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Bangalore, India"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stipend">Stipend/Salary</label>
                    <input
                        type="text"
                        id="stipend"
                        name="stipend"
                        value={formData.stipend}
                        onChange={handleChange}
                        placeholder="e.g. ₹15,000/month"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="companyWebsite">Company Website</label>
                    <input
                        type="url"
                        id="companyWebsite"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                        placeholder="https://company.com"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
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
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
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