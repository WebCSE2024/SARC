import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import { FaYoutube, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
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
            <Link to="/publications" aria-label="Publications">
              Publications
            </Link>
            <Link to="/sig" aria-label="Research Groups">
              Research Groups
            </Link>
            <Link to="/referrals" aria-label="Referrals">
              Referrals
            </Link>
          </div>
          <div className="footer-section" aria-labelledby="explore-heading">
            <h5 id="explore-heading">Contribute</h5>
            <Link to="/post-publication" aria-label="Submit Publication">
              Submit Publication
            </Link>
            <Link to="/post-referral" aria-label="Post Referral">
              Post Referral
            </Link>
            <Link to="/profile" aria-label="My Profile">
              My Profile
            </Link>
          </div>
          <div className="footer-section" aria-labelledby="quicklinks-heading">
            <h5 id="quicklinks-heading">Quick Links</h5>
            <a
              href="https://www.iitism.ac.in/computer-science-and-engineering"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="About Department"
            >
              About Department
            </a>
            <a
              href="https://cses.iitism.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Us"
            >
              Contact Us
            </a>
            <Link to="/" aria-label="Home">
              Home
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© Department of CSE, IIT ISM Dhanbad</p>
        <div className="footer-bottom-links">
          <a
            href="https://www.iitism.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.iitism.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Terms of Service"
          >
            Terms of Service
          </a>
        </div>
        <div className="footer-icons" aria-label="Social links">
          <a
            href="https://www.youtube.com/@IITISMDhanbad"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.facebook.com/CSESISMDhanbad/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.linkedin.com/company/cse-iit-ism-dhanbad/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
