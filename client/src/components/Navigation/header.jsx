import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import sarcLogo from "../../../public/MainLogo.svg";
import "./header.css";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const closeNewsMenu = () => setShowNewsMenu(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="header-navbar">
        <nav>
          <NavLink to="/" onClick={closeNewsMenu}>
            <div className="left-side">
              <img src={sarcLogo} alt="Landing Page Logo" className="logo" />
              <div className="LogoTitle">SARC</div>
            </div>
          </NavLink>

          <ul className="nav-links">
            <li>
              <NavLink to="/publications" onClick={closeNewsMenu}>
                Publications
              </NavLink>
            </li>
            <li>
              <NavLink to="/referrals" onClick={closeNewsMenu}>
                Referrals
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/news"
                className={showNewsMenu ? "active" : ""}
                onClick={() => setShowNewsMenu(!showNewsMenu)}
              >
                News
              </NavLink>
            </li>
          </ul>
          <div className="right-side">
            {isAuthenticated() ? (
              <>
                <NavLink
                  to="/profile"
                  className="profile-btn"
                  onClick={closeNewsMenu}
                >
                  Hi {user?.name || user?.username || "User"}
                </NavLink>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="signup-btn"
                onClick={closeNewsMenu}
              >
                Sign in
              </NavLink>
            )}
          </div>
        </nav>
      </header>

      {showNewsMenu && (
        <div className="news-submenu">
          <div className="submenu-content">
            <NavLink to="/achievements">Achievements</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/seminars">Seminars</NavLink>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
