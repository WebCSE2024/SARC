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
    <header className="header-navbar">
      <nav>
        <NavLink to="/">
          <div className="left-side">
            <img src={sarcLogo} alt="Landing Page Logo" className="logo" />
            <div className="LogoTitle">SARC</div>
          </div>
        </NavLink>
        {user ? (
          <ul className="nav-links">
            <li>
              <NavLink to="/publications">Publications</NavLink>
            </li>
            <li>
              <NavLink to="/referrals">Referrals</NavLink>
            </li>
            <li>
              <NavLink to="/news">News</NavLink>
            </li>
          </ul>
        ) : null}

        <div className="right-side">
          {isAuthenticated() ? (
            <>
              <NavLink to="/profile" className="profile-btn">
                Hi {user?.name || user?.username || "User"}
              </NavLink>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="signup-btn">
              Sign in
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
