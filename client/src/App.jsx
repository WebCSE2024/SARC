import React from 'react'
import EventsPage from './pages/News/NewsPage'
import './App.css'

import Header from './components/header'
import Footer from './components/footer'


import PublicationsCard from './pages/PublicationsPage/PublicationsCard'
import Referral_card from './pages/Referrals/referral_cards'
import AchievementsCard from './pages/News/NewsCards/AchievementsCard'

const App = () => {
  return (
    <div className='app'>
      <Header />
      <h2  >EVENTS:</h2>
      <h3>Achievements:</h3>
      <AchievementsCard />
      <EventsPage/>

      <h2>Referrals:</h2>
      <Referral_card/>


      <h2>Publications:</h2>
      <PublicationsCard />

      <Footer />
      
    </div>
  )
}

export default App