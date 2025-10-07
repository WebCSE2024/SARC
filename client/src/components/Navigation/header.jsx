import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import sarcLogo from "../../../public/MainLogo.svg";
import "./header.css";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header-navbar" role="banner">
      <nav aria-label="Primary" role="navigation">
        <NavLink to="/" aria-label="Home">
          <div className="left-side">
            <img src={sarcLogo} alt="SARC logo" className="logo" />
            <div className="LogoTitle" aria-hidden>
              SARC
            </div>
          </div>
        </NavLink>
        {user ? (
          <ul className="nav-links" role="menubar" aria-label="Main sections">
            <li role="none">
              <NavLink role="menuitem" to="/publications">
                Publications
              </NavLink>
            </li>
            <li role="none">
              <NavLink role="menuitem" to="/referrals">
                Referrals
              </NavLink>
            </li>
            <li role="none">
              <NavLink role="menuitem" to="/news">
                News
              </NavLink>
            </li>
          </ul>
        ) : null}

        <div className="right-side">
          {isAuthenticated() ? (
            <>
              <NavLink
                to="/profile"
                className="profile-btn"
                aria-label="Profile"
              >
                Hi {user?.name || user?.username || "User"}
              </NavLink>
              <button
                className="logout-btn"
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="signup-btn" aria-label="Sign in">
              Sign in
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
