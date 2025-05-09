// import React from "react";
import "./ProfilePage.scss";
// import profileImg from '../../../public/NoProfileImg.png'
// import eduLogo from "../../../public/TempImages/wallpaperflare.com_wallpaper (1).jpg";
// import { FaLinkedin, FaGithub, FaEnvelope, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import ActivityCard from "../../features/ProfilePageActivity/ActivityCard";
import ExperienceItem from "../../components/ExperienceBox/ExperienceItem";
import EducationItem from "../../components/EducationBox/EducationItem";
import defaultProfileImg from "../../../public/NoProfileImg.png";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handlePostReferral = () => {
    navigate("/post-referral");
  };

  const handlePostPublication = () => {
    navigate("/post-publication");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover-photo"></div>
        <div className="profile-info">
          <img
            src={user.profile_pic || defaultProfileImg}
            alt="Profile Picture"
            className="profile-picture"
          />
          <div className="basic-info">
            <h1>{user.full_name}</h1>
            <p className="title">{user.designation}</p>
            <p className="location">
              {user.location &&
                `${user.location.city}, ${user.location.country}`}
            </p>
            {/* <div className="social-links">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaGithub /></a>
              <a href="mailto:example@email.com"><FaEnvelope /></a>
              <a href="tel:+1234567890"><FaPhone /></a>
            </div> */}
          </div>

          {/* Role-based action buttons */}
          <div className="action-buttons">
            {user.userType === "PROFESSOR" && (
              <>
                <button className="post-btn" onClick={handlePostPublication}>
                  Post Publication
                </button>
                <button
                  className="post-btn referral"
                  onClick={handlePostReferral}
                >
                  Post Referral
                </button>
              </>
            )}

            {user.userType === "ALUMNI" && (
              <button
                className="post-btn referral"
                onClick={handlePostReferral}
              >
                Post Referral
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <section className="about">
          <h2>About</h2>
          <p>{user.about}</p>
        </section>

        {user.experience && (
          <section className="experience">
            <h2>Experience</h2>
            {user.experience.map((exp, index) => (
              <ExperienceItem data={exp} key={index} />
            ))}
            {/* {user.experience && (<ExperienceItem data={user.experience} />)} */}
          </section>
        )}

        {user.education && (
          <section className="education">
            <h2>Education</h2>
            {user.education.map((edu, index) => (
              <EducationItem data={edu} key={index} />
            ))}
            {/* <EducationItem /> */}
          </section>
        )}

        {/* <ActivityCard /> */}

        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
