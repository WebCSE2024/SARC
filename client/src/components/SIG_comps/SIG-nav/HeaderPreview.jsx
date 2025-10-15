import React from "react";
import "../Navigation/header.css";

export default function HeaderPreview() {
  return (
    <header className="header-navbar" role="banner">
      <nav aria-label="Primary" role="navigation">
        <a href="#" aria-label="Home">
          <div className="left-side">
            <div className="LogoTitle" aria-hidden>
              SARC
            </div>
          </div>
        </a>
        <ul className="nav-links" role="menubar" aria-label="Main sections">
          <li role="none"><a role="menuitem" href="#">Home</a></li>
          <li role="none"><a role="menuitem" href="#">Publications</a></li>
          <li role="none"><a role="menuitem" href="#">News</a></li>
          <li role="none"><a role="menuitem" className="active" href="#">SIGs</a></li>
        </ul>
        <div className="right-side">
          <a className="profile-btn" href="#">Profile</a>
        </div>
      </nav>
    </header>
  );
}
