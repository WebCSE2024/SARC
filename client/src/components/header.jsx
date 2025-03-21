import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import topBarLogo from "../assets/top_bar.png";
import "./header.css";

const Header = () => {
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const closeNewsMenu = () => setShowNewsMenu(false);
  return (
    <>
      <header className="header-navbar">
        <nav>
          <div className="left-side">
            <Link to="/">
              <img src={topBarLogo} alt="Landing Page Logo" className="logo" />
            </Link>
          </div>
          <ul className="nav-links">
            <li><Link to="/publications" onClick={closeNewsMenu}>Publications</Link></li>
            <li><Link to="/referrals" onClick={closeNewsMenu}>Referrals</Link></li>
            <li><Link
    to="/news"
    className={showNewsMenu ? "active" : ""}
    onClick={() => setShowNewsMenu(!showNewsMenu)}
  >
    News
  </Link>
            </li>
          </ul>
          <div className="right-side">
            <Link to="/signup" className="signup-btn" onClick={closeNewsMenu}>Sign in</Link>
          </div>
        </nav>
      </header>

      {showNewsMenu && (
        <div className="news-submenu">
          <div className="submenu-content">
            <Link to="/achievements">Achievements</Link>
            <Link to="/events">Events</Link>
            <Link to="/seminars">Seminars</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
