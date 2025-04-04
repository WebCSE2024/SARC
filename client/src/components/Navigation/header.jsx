import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import sarcLogo from "../../../public/MainLogo.svg";
import "./header.css";

const Header = () => {
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const closeNewsMenu = () => setShowNewsMenu(false);
  return (
    <>
      <header className="header-navbar">
        <nav>

          <NavLink to="/" onClick={closeNewsMenu}>
            <div className="left-side">
              {/* <img src={topBarLogo} alt="Landing Page Logo" className="logo" /> */}
              <img src={sarcLogo} alt="Landing Page Logo" className="logo" />
              <div className="LogoTitle">SARC</div>
            </div>
          </NavLink>


          <ul className="nav-links">
            <li><NavLink to="/publications" onClick={closeNewsMenu}>Publications</NavLink></li>
            <li><NavLink to="/referrals" onClick={closeNewsMenu}>Referrals</NavLink></li>
            <li><NavLink
              to="/news"
              className={showNewsMenu ? "active" : ""}
              onClick={() => setShowNewsMenu(!showNewsMenu)}
            >
              News
            </NavLink>
            </li>
          </ul>
          <div className="right-side">
            {/* show this button to logout */}
            <NavLink to="/signup" className="signup-btn" onClick={closeNewsMenu}>Sign in</NavLink>

            {/* add this button only if the user is loggen in */}
            <NavLink to="/profile" className="signup-btn" onClick={closeNewsMenu}> Hi {/*username here*/}</NavLink>

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
