import React from 'react';
import './ProfilePage.scss';
// import profileImg from '../../../public/NoProfileImg.png'
import eduLogo from '../../../public/TempImages/wallpaperflare.com_wallpaper (1).jpg'
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../../features/ProfilePageActivity/ActivityCard';
import ExperienceItem from '../../components/ExperienceBox/ExperienceItem';
import EducationItem from '../../components/EducationBox/EducationItem';
import defaultProfileImg from '../../../public/NoProfileImg.png';

import userData from '../../SampleData/userData.json'


const ProfilePage = () => {
    const navigate = useNavigate();

    const handlePostReferral = () => {
        navigate('/PostReferrals');
    };

    const handlePostPublication = () => {
        navigate('/PostPublication');
    };

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/login');
    };

    const user = userData.users[1];

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="cover-photo"></div>
                <div className="profile-info">
                    <img
                        src={user.profile_pic || defaultProfileImg }
                        alt="Profile Picture"
                        className="profile-picture"
                    />
                    <div className="basic-info">
                        <h1>{user && user.full_name}</h1>
                        <p className="title">{user && user.designation}</p>
                        <p className="location">{user && (`${user.location.city}, ${user.location.country}`)}</p>
                        {/* <div className="social-links">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaGithub /></a>
              <a href="mailto:example@email.com"><FaEnvelope /></a>
              <a href="tel:+1234567890"><FaPhone /></a>
            </div> */}
                    </div>

                    {/* activate post referral for alumni user only */}
                    {user && user.user_type == "alumni" && (<button
                        className="post-btn referral"
                        onClick={handlePostReferral}
                    >
                        Post Referral
                    </button>)}

                    {/* activate post publications for professor only */}
                    {user && user.user_type == "professor" && (<button
                        className="post-btn"
                        onClick={handlePostPublication}
                    >
                        Post Publication
                    </button>)}
                </div>
            </div>

            <div className="profile-content">
                <section className="about">
                    <h2>About</h2>
                    <p>{user && user.about}</p>
                </section>

                <section className="experience">
                    <h2>Experience</h2>
                    {user.experience.map((Exp_num, index) => (
                        <ExperienceItem data={Exp_num} key={index} />
                    ))}
                    {/* {user.experience && (<ExperienceItem data={user.experience} />)} */}


                </section>

                {user.education && (<section className="education">
                    <h2>Education</h2>
                    {user.education.map((EduItem, index) => (
                        <EducationItem data={EduItem} key={index} />
                    ))}
                    {/* <EducationItem /> */}
                </section>)}

                {/* <ActivityCard /> */}

                <div className="logout-section">
                    <button 
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;