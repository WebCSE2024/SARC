import React, { useState } from 'react';
import axios from 'axios';
import './PostPublications.scss';
import { FaCloudUploadAlt } from 'react-icons/fa';

const PostPublications = () => {
    const [formData, setFormData] = useState({
        title: '',
        pages: '',
        pagesDisplay: '',
        pdfFile: null
    });

    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            
            // Append all form fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('pages', formData.pages);
            formDataToSend.append('pagesDisplay', formData.pagesDisplay);
            formDataToSend.append('pdfFile', formData.pdfFile);
            
            // Add user ID if available from auth context
            // formDataToSend.append('addedBy', user._id);

            const response = await axios.post('/create-publication', 
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 201) {
                // Reset form
                setFormData({
                    title: '',
                    pages: '',
                    pagesDisplay: '',
                    pdfFile: null
                });
                setFileName('');
                alert('Publication posted successfully!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post publication');
            console.error('Error posting publication:', err);
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
                    <label htmlFor="pagesDisplay">Number of Pages to be displayed*</label>
                    <input
                        type="number"
                        id="pagesDisplay"
                        name="pagesDisplay"
                        value={formData.pagesDisplay}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="Enter number of pages to be displayed"
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Posting...' : 'Post Publication'}
                </button>
            </form>
        </div>
    );
};

export default PostPublications;