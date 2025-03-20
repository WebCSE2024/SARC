import React from 'react'
import EventsCard from './NewsCards/EventsCard'
import HackathonCard from './NewsCards/HackathonCard'
import './NewsPage.scss'

const EventsPage = () => {
  return (
    <div className='eventsPage'>
        <h3>Guest Talk:</h3>
        <EventsCard/>

        <h3>Hackathon:</h3>
        <HackathonCard/>


    </div>
  )
}

export default EventsPage