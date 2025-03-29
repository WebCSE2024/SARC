import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
// import linkedInLogo from '../assets/linkedin.png'; // Add LinkedIn logo to your assets
import {FaLinkedin} from 'react-icons/fa'

const LoginPage = () => {
//   const navigate = useNavigate();

  const handleLinkedInClick = () => {
    // This will be replaced with actual LinkedIn auth later
    navigate('/dashboard');
  };

  const handleRegisterClick = () => {
    window.open('https://cses.fi/problemset/', '_blank');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to SARC</h1>
        <p className="subtitle">Student Alumni Relations Cell, IIT(ISM) Dhanbad</p>
        
        <div className="auth-section">
          <button 
            onClick={handleLinkedInClick} 
            className="linkedin-button"
          >
            {/* <img 
              src=''
              alt="LinkedIn Logo" 
              className="linkedin-icon"
            /> */}
            <FaLinkedin style={{scale:1.5, marginRight:5,}}/>
            Sign in with LinkedIn
          </button>

          <div className="register-prompt">
            <p>Haven't registered yet?</p>
            <button 
              onClick={handleRegisterClick}
              className="register-button"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;