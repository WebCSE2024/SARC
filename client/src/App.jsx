import React from 'react'
import EventsPage from './pages/News/NewsPage'
import './App.css'

import Header from './components/header'
import Footer from './components/footer'

import ProfilePage from './pages/ProfilePage/ProfilePage'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage'
import PublicationsCard from './pages/PublicationsPage/PublicationsCard'
import Referral_card from './pages/Referrals/referral_cards'
import AchievementsCard from './pages/News/NewsCards/AchievementsCard'

const App = () => {
  return (
    <div className='app'>
      <Header />
      <ProfilePage />
      {/* <HomePage /> */}

      <LoginPage />

      <h2  >EVENTS:</h2>

      <h3>Achievements:</h3>
      <AchievementsCard />

        <h2  >Events:</h2>
      <EventsPage/>

      <h2>Referrals:</h2>
      <Referral_card/>


      <h2>Publications:</h2>
      <PublicationsCard />

   
      
    </div>
  )
}

export default App