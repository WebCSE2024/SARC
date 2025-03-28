import React, { useState } from 'react';
import './PostPublications.scss';
import { FaCloudUploadAlt } from 'react-icons/fa';

const PostPublications = () => {
    const [formData, setFormData] = useState({
        title: '',
        pages: '',
        email: '',
        phone: '',
        pdfFile: null
    });

    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFormData(prevState => ({
                ...prevState,
                pdfFile: file
            }));
            setFileName(file.name);
        } else {
            alert('Please upload a PDF file');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Add submission logic here
    };

    return (
        <div className="post-publication-container">
            <h2>Post Research Publication</h2>
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
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                        />
                        <div className="upload-placeholder">
                            <FaCloudUploadAlt className="upload-icon" />
                            <p>{fileName || 'Drag & Drop PDF here or click to browse'}</p>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="pages">Total Number of Pages*</label>
                    <input
                        type="number"
                        id="pages"
                        name="pages"
                        value={formData.pages}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="Enter number of pages"
                    />
                </div>

                <div className="contact-group">
                    <div className="form-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
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
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Post Publication
                </button>
            </form>
        </div>
    );
};

export default PostPublications;