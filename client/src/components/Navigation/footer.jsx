import React from "react";
import "./footer.css";
import { FaYoutube, FaTwitter, FaLinkedin } from "react-icons/fa";
import LogoSmall from "../../../public/Logo-Small.png";
const Footer = () => {
  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={LogoSmall} alt="SARC small logo" className="logo" />
        </div>
        <div className="footer-links" aria-label="Footer navigation">
          <div className="footer-section" aria-labelledby="resources-heading">
            <h5 id="resources-heading">Resources</h5>
            <a href="#" aria-label="FAQs">
              FAQs
            </a>
            <a href="#" aria-label="Professor Publications">
              Professor Publications
            </a>
          </div>
          <div className="footer-section" aria-labelledby="explore-heading">
            <h5 id="explore-heading">Explore</h5>
            <a href="#" aria-label="Events">
              Events
            </a>
            <a href="#" aria-label="Give back">
              Give back
            </a>
            <a href="#" aria-label="Alumni Directory">
              Alumni Directory
            </a>
          </div>
          <div className="footer-section" aria-labelledby="quicklinks-heading">
            <h5 id="quicklinks-heading">Quick links</h5>
            <a href="#" aria-label="About us">
              About us
            </a>
            <a href="#" aria-label="Contact us">
              Contact us
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© Department of CSE, IIT ISM Dhanbad</p>
        <div className="footer-bottom-links">
          <a href="#" aria-label="Privacy Policy">
            Privacy Policy
          </a>
          <a href="#" aria-label="Terms of Service">
            Terms of Service
          </a>
        </div>
        <div className="footer-icons" aria-label="Social links">
          <FaYoutube aria-label="YouTube" />
          <FaTwitter aria-label="Twitter" />
          <FaLinkedin aria-label="LinkedIn" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
