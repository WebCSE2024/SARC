import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
// import linkedInLogo from '../assets/linkedin.png'; // Add LinkedIn logo to your assets
import {FaLinkedin} from 'react-icons/fa'

const LoginPage = () => {
//   const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form validation
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    setError('');
    // Here you will implement the first layer authentication check
    console.log('Checking credentials for:', username);
  };

  const handleLinkedInClick = () => {
    // This will be replaced with actual LinkedIn auth later
    // navigate('/dashboard');
    console.log('Initiating LinkedIn authentication');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to SARC</h1>
        <p className="subtitle">Student Alumni Relations Cell, IIT(ISM) Dhanbad</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="submit-button">
            Verify Credentials
          </button>
          
          <div className="divider">
            <span>Then</span>
          </div>
          
          <button 
            type="button"
            onClick={handleLinkedInClick} 
            className="linkedin-button"
          >
            <FaLinkedin style={{scale:1.5, marginRight:5,}}/>
            Sign in with LinkedIn
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;