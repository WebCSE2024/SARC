import React from 'react'
import EventsCard from './NewsCards/EventsCard'
import HackathonCard from './NewsCards/HackathonCard'
import './EventsPage.scss'
// import FloatingBookmark from '../../utils/Filtering/FloatingBookmark'
import SearchBox from '../../utils/Filtering/SearchBox'

// import TempTestCard from './TempTestCard'

const EventsPage = () => {
  return (
    <div className='eventsPage'>
      
      <SearchBox />

      {/* <FloatingBookmark elementId={`event-${123}`} /> */}
      {/* <TempTestCard /> */}

      {/* <h3>Hackathon:</h3> */}
      <HackathonCard posterImg={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvGVNKFKB3h0ay5aBrx-YVN_FcDgH6uf_lpjiGNtTpg1DOaTmRxca2WVB07obEBgS-CRQ&usqp=CAU`} />
      <HackathonCard />

      {/* <h3>Guest Talk:</h3> */}
      <EventsCard />

      <EventsCard />

    </div>
  )
}

export default EventsPage