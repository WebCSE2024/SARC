import React from "react";
import "./footer.css";
import { FaYoutube, FaTwitter, FaLinkedin } from "react-icons/fa";
import LogoSmall from "../assets/Logo-Small.png";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={LogoSmall} alt="Logo" className="logo" />
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h5>Resources</h5>
            <a href="#">FAQs</a>
            <a href="#">Professor Publications</a>
          </div>
          <div className="footer-section">
            <h5>Explore</h5>
            <a href="#">Events</a>
            <a href="#">Give back</a>
            <a href="#">Alumni Directory</a>
          </div>
          <div className="footer-section">
            <h5>Quick links</h5>
            <a href="#">About us</a>
            <a href="#">Contact us</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© Department of CSE, IIT ISM Dhanbad</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="footer-icons">
          <FaYoutube />
          <FaTwitter />
          <FaLinkedin />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
