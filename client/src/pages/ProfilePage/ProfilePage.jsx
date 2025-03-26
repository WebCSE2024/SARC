import React from 'react';
import './ProfilePage.scss';
import profileImg from '../../assets/NoProfileImg.png'
import experienceLogo from '../../assets/MainLogo.svg'
import eduLogo from '../../assets/TempImages/wallpaperflare.com_wallpaper (1).jpg'
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();

    const handlePostReferral = () => {
        navigate('/PostReferrals');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="cover-photo"></div>
                <div className="profile-info">
                    <img
                        src={profileImg}
                        alt="Profile"
                        className="profile-picture"
                    />
                    <div className="basic-info">
                        <h1>John Doe</h1>
                        <p className="title">Computer Science Student, IIT (ISM) Dhanbad</p>
                        <p className="location">Dhanbad, Jharkhand</p>
{/* <div className="social-links">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaGithub /></a>
              <a href="mailto:example@email.com"><FaEnvelope /></a>
              <a href="tel:+1234567890"><FaPhone /></a>
            </div> */}
                    </div>
                    <button 
                        className="post-referral-btn"
                        onClick={handlePostReferral}
                    >
                        Post Referral
                    </button>
                </div>
            </div>

            <div className="profile-content">
                <section className="about">
                    <h2>About</h2>
                    <p>Final year Computer Science student at IIT (ISM) Dhanbad with a passion for software development and problem-solving.</p>
                </section>
                
                <section className="experience">
                    <h2>Experience</h2>
                    <div className="experience-item">
                        <div className="exp-header">
                            <div className="company-logo">
                                <img src={experienceLogo} alt="Company Logo" />
                            </div>
                            <div className="exp-details">
                                <h3>Software Engineering Intern</h3>
                                <p className="company-name">Company Name</p>
                                <p className="duration">Jun 2023 - Aug 2023 · 3 mos</p>
                                <p className="location">Bengaluru, Karnataka, India</p>
                            </div>
                        </div>
                        <div className="exp-description">
                            <ul>
                                <li>Developed and maintained web applications</li>
                                <li>Collaborated with cross-functional teams</li>
                                <li>Improved application performance by 40%</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="education">
                    <h2>Education</h2>
                    <div className="education-item">
                        <div className="edu-header">
                            <div className="institute-logo">
                                <img src={eduLogo} alt="Institute Logo" />
                            </div>
                            <div className="edu-details">
                                <h3>Indian Institute of Technology (ISM) Dhanbad</h3>
                                <p className="degree">Bachelor of Technology - BTech, Computer Science</p>
                                <p className="duration">2020 - 2024</p>
                                <p className="grades">CGPA: 8.5/10</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;