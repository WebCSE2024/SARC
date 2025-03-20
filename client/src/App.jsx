import React from 'react'
import EventsPage from './pages/News/NewsPage'
import './App.css'

import Header from './components/header'
import Footer from './components/footer'


import PublicationsCard from './pages/PublicationsPage/PublicationsCard'

const App = () => {
  return (
    <div className='app'>
      <Header />
      <h2  >EVENTS:</h2>
      <EventsPage/>

      <h2>Publications:</h2>
      <PublicationsCard />
      <Footer />
      
    </div>
  )
}

export default App