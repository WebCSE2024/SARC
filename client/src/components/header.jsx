import React, { useState } from "react";
import topBarLogo from "../assets/top_bar.png";
import "./header.css";

const Header = () => {
  const [showNewsMenu, setShowNewsMenu] = useState(false);

  return (
    <>
      <header className="header-navbar">
        <nav>
          <div className="left-side">
            <a href="/">
              <img src={topBarLogo} alt="Landing Page Logo" className="logo" />
            </a>
          </div>
          <ul className="nav-links">
            <li><a href="#publications">Publications</a></li>
            <li><a href="#referrals">Referrals</a></li>
            <li>
              <a className="active" href="#" onClick={(e) => {
                e.preventDefault();
                setShowNewsMenu(!showNewsMenu);
              }}>News</a>
            </li>
          </ul>
          <div className="right-side">
            <a href="#signup" className="signup-btn">Sign in</a>
          </div>
        </nav>
      </header>
      {showNewsMenu && (
        <div className="news-submenu">
          <div className="submenu-content">
            <a href="#achievements">Achievements</a>
            <a className="active" href="#events">Events</a>
            <a href="#seminars">Seminars</a>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;