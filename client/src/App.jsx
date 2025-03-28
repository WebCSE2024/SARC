import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'

import EventsPage from './pages/News/EventsPage.jsx'
import PublicationsPage from './pages/PublicationsPage/PublicationsPage'
// import ReferralCard from './pages/Referrals/referral_card.jsx'
import ReferralPage from './pages/Referrals/ReferralPage.jsx';
// import AchievementsCard from './pages/News/NewsCards/AchievementsCard'
import Achievements from './pages/News/AchievementsPage.jsx'
// import News from './pages/News/EventsPage.jsx'
import SeminarsPage from './pages/News/SeminarsPage.jsx';
import Header from './components/header'
import Footer from './components/footer'

import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import PostPublications from './pages/ProfilePage/PostReferral/PostPublications/PostPublications.jsx';

import PostReferral from './pages/ProfilePage/PostReferral/PostReferral';

const App = () => {
  return (
    <div className='app'>
      <BrowserRouter>
        <Header /> 
        {/* Stays on all pages */}
        {/* <PostReferral /> */}
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/referrals" element={<ReferralPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/news" element={<Navigate to="/events" />} />
          <Route path="/signup" element={<LoginPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/seminars" element={<SeminarsPage/>} />
          <Route path="/PostReferrals" element={<PostReferral/>} />
          <Route path="/PostPublication" element={<PostPublications/>} />
          
          {/* Temporary Redirects */}
          {/* <Route path="/seminars" element={<Navigate to="/" />} /> */}

          {/* 404 Not Found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer /> {/* Stays on all pages */}
      </BrowserRouter>



    </div>
  )
}

export default App